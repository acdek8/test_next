// app/ui/members/MemberForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMemberAction, updateMemberAction } from "@/app/lib/actions";
import { validateMemberForm } from "@/app/members/MemberValidation"; // ✅ 外部バリデーション呼び出し

function formatDateSlash(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

export default function MemberForm({
  mode,
  initialData,
  memberId,
}: {
  mode: "create" | "edit";
  initialData?: any;
  memberId?: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState(() => {
    if (initialData) {
      const [pc1 = "", pc2 = ""] = initialData.post_code?.split("-") ?? [];
      return {
        ...initialData,
        birth_date: formatDateSlash(initialData.birth_date),
        post_code_1: pc1,
        post_code_2: pc2,
        gender: String(initialData.gender ?? "0"),
        address: initialData.address ?? "",
        tel: initialData.tel ?? "",
        profile: initialData.profile ?? "",
        pm_years: initialData.pm_years ?? "",
      };
    }
    return {
      last_name: "",
      first_name: "",
      kana_last_name: "",
      kana_first_name: "",
      gender: "0", // ✅ 未回答
      birth_date: "",
      post_code_1: "",
      post_code_2: "",
      address: "",
      tel: "",
      profile: "",
      pm_years: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateMemberForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // PM経験が未入力なら "0" を補完
    const normalizedForm = {
      ...form,
      pm_years: form.pm_years.trim() === "" ? "0" : form.pm_years,
      post_code: `${form.post_code_1}-${form.post_code_2}`,
      gender: form.gender, // ✅ "0" | "1" | "2" をそのまま送信
    };

    if (mode === "create") {
      await createMemberAction(normalizedForm);
    } else if (mode === "edit" && memberId) {
      await updateMemberAction(memberId, normalizedForm);
    }
    router.push("/members");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded shadow"
    >
      <h1 className="text-xl font-bold">
        {mode === "create" ? "メンバー登録" : "メンバー編集"}
      </h1>
      {/* 氏名 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">氏名</label>
          <label className="text-sm text-gray-700">（姓）</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
          <label className="text-sm text-gray-700">（名）</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
        </div>
        {errors.last_name && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.last_name}</p>
        )}
        {errors.first_name && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.first_name}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          漢字、ひらがな、全角カタカナ、全角数字が入力できます。
        </p>
      </div>
      {/* 氏名ふりがな */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">氏名ふりがな</label>
          <label className="text-sm text-gray-700">（姓）</label>
          <input
            name="kana_last_name"
            value={form.kana_last_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
          <label className="text-sm text-gray-700">（名）</label>
          <input
            name="kana_first_name"
            value={form.kana_first_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
        </div>
        {errors.kana_last_name && (
          <p className="text-xs text-red-500 mt-1 ml-32">
            {errors.kana_last_name}
          </p>
        )}
        {errors.kana_first_name && (
          <p className="text-xs text-red-500 mt-1 ml-32">
            {errors.kana_first_name}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          ひらがなで入力してください。
        </p>
      </div>
      {/* 性別 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">性別</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="0"
              checked={form.gender === "0"}
              onChange={handleChange}
            />{" "}
            未回答
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="1"
              checked={form.gender === "1"}
              onChange={handleChange}
            />{" "}
            男性
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="2"
              checked={form.gender === "2"}
              onChange={handleChange}
            />{" "}
            女性
          </label>
        </div>
        {errors.gender && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.gender}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          性別を選択してください。
        </p>
      </div>
      {/* 生年月日 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">生年月日</label>
          <input
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            placeholder="YYYY/MM/DD"
            className="border px-2 py-1 w-40"
          />
        </div>
        {errors.birth_date && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.birth_date}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          未成年の登録は認めておりません。正しい日付を入力してください。
        </p>
      </div>
      {/* 郵便番号 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">郵便番号</label>
          <input
            name="post_code_1"
            value={form.post_code_1}
            onChange={handleChange}
            placeholder="123"
            className="border px-2 py-1 w-20"
          />
          <span>ー</span>
          <input
            name="post_code_2"
            value={form.post_code_2}
            onChange={handleChange}
            placeholder="4567"
            className="border px-2 py-1 w-24"
          />
        </div>
        {errors.post_code && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.post_code}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          正しい形式（3桁 + 4桁の半角数字）で入力してください。
        </p>
      </div>
      {/* 住所 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">住所</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        {errors.address && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.address}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          全角で入力してください。
        </p>
      </div>
      {/* 電話番号 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">電話番号</label>
          <input
            name="tel"
            value={form.tel}
            onChange={handleChange}
            placeholder="08099999999"
            className="border px-2 py-1 w-40"
          />
        </div>
        {errors.tel && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.tel}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          半角数字で入力してください。
        </p>
      </div>
      {/* プロフィール */}
      <div>
        <div className="flex items-start gap-4">
          <label className="w-32 font-semibold pt-1">プロフィール</label>
          <textarea
            name="profile"
            value={form.profile}
            onChange={handleChange}
            className="border px-2 py-1 w-full h-24"
          />
        </div>
        {errors.profile && (
          <p className="text-xs text-red-500 mt-1 ml-32">{errors.profile}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 ml-32">
          20文字以上200文字以下で入力してください。
        </p>
      </div>
      {/* PM経験年数 */}{" "}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">PM経験年数</label>
          <div className="flex items-center gap-2">
            <input
              name="pm_years"
              value={form.pm_years}
              onChange={handleChange}
              placeholder="10"
              className="border px-2 py-1 w-24 text-right"
            />
            <span className="text-gray-700">年</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          未入力の場合は0年として登録します。
        </p>
      </div>
      {/* ボタン */}
      <div className="pt-4">
        <button
          type="submit"
          className={`px-6 py-2 rounded text-white ${
            mode === "create"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {mode === "create" ? "登録" : "更新"}
        </button>
      </div>
    </form>
  );
}
