"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteMember } from "./data";
import { createMember } from "./data";
import { updateMember } from "./data";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

export async function deleteMemberAction(id: string) {
  await deleteMember(id);
}

export async function createMemberAction(form: {
  last_name: string;
  first_name: string;
  kana_last_name: string;
  kana_first_name: string;
  gender: string;
  birth_date: string; // ユーザー入力は "YYYY/MM/DD"
  post_code_1: string;
  post_code_2: string;
  address: string;
  tel: string;
  profile: string;
  pm_years?: string;
}) {
  const post_code = `${form.post_code_1}-${form.post_code_2}`;
  const pm_years = form.pm_years ? parseInt(form.pm_years, 10) : 0;

  const raw = form.birth_date.trim();
  let birth_date = raw;
  if (/^\d{8}$/.test(raw)) {
    birth_date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }

  // 年齢計算用
  const [y, m, d] = birth_date.split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  await createMember({
    last_name: form.last_name,
    first_name: form.first_name,
    kana_last_name: form.kana_last_name,
    kana_first_name: form.kana_first_name,
    gender: form.gender,
    birth_date, // ← 正規化済み
    age,
    post_code,
    address: form.address,
    tel: form.tel,
    profile: form.profile,
    pm_years,
  });
}

export async function updateMemberAction(id: string, form: any) {
  const post_code = `${form.post_code_1}-${form.post_code_2}`;
  const pm_years = form.pm_years ? parseInt(form.pm_years, 10) : 0;

  // birth_date を YYYY-MM-DD に変換
  let birth_date = form.birth_date;
  if (/^\d{8}$/.test(birth_date)) {
    birth_date = `${birth_date.slice(0, 4)}-${birth_date.slice(
      4,
      6
    )}-${birth_date.slice(6, 8)}`;
  }

  // 年齢計算
  const [y, m, d] = birth_date.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (
    today.getMonth() < m - 1 ||
    (today.getMonth() === m - 1 && today.getDate() < d)
  ) {
    age--;
  }

  await updateMember(id, {
    ...form,
    post_code,
    birth_date,
    age,
    pm_years,
  });
}
