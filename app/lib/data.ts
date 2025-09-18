import postgres from "postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchMembers(filters: {
  kana?: string;
  ageMin?: string;
  ageMax?: string;
  tel?: string;
}) {
  const conditions: any[] = [];

  // ふりがな検索
  if (filters.kana) {
    conditions.push(
      sql`(kana_last_name ILIKE ${
        "%" + filters.kana + "%"
      } OR kana_first_name ILIKE ${"%" + filters.kana + "%"})`
    );
  }

  // 年齢下限
  if (filters.ageMin) {
    const min = parseInt(filters.ageMin, 10);
    if (!isNaN(min)) {
      conditions.push(sql`age >= ${min}`);
    }
  }

  // 年齢上限
  if (filters.ageMax) {
    const max = parseInt(filters.ageMax, 10);
    if (!isNaN(max)) {
      conditions.push(sql`age <= ${max}`);
    }
  }

  // 電話番号
  if (filters.tel) {
    conditions.push(sql`tel ILIKE ${"%" + filters.tel + "%"}`);
  }

  // AND で条件をつなぐ（join が無い環境でも動くように自前で連結）
  let whereClause = sql``;
  if (conditions.length > 0) {
    whereClause = conditions[0];
    for (let i = 1; i < conditions.length; i++) {
      whereClause = sql`${whereClause} AND ${conditions[i]}`;
    }
  }

  // クエリ本体
  return sql`
    SELECT * FROM members
    WHERE TRUE
    ${conditions.length > 0 ? sql`AND ${whereClause}` : sql``}
    ORDER BY id DESC
  `;
}

export async function deleteMember(id: string) {
  await sql`DELETE FROM members WHERE id = ${id}`;
}

export async function createMember(data: {
  last_name: string;
  first_name: string;
  kana_last_name: string;
  kana_first_name: string;
  gender: string;
  birth_date: string;
  age: number;
  post_code: string;
  address: string;
  tel: string;
  profile: string;
  pm_years: number;
}) {
  await sql`
  INSERT INTO members (
    last_name, first_name, kana_last_name, kana_first_name,
    age, gender, birth_date, post_code, address, tel,
    profile, pm_years, created_at, updated_at
  ) VALUES (
    ${data.last_name}, ${data.first_name}, ${data.kana_last_name}, ${data.kana_first_name},
    ${data.age}, ${data.gender}, ${data.birth_date}, ${data.post_code}, ${data.address}, ${data.tel},
    ${data.profile}, ${data.pm_years}, NOW(), NOW()
  )
`;
}

export async function getMemberById(id: string) {
  const result = await sql`
  SELECT *
  FROM members
  WHERE id = ${id}
  LIMIT 1
`;
  return result[0];
}

export async function updateMember(id: string, data: any) {
  await sql`
    UPDATE members SET
      last_name = ${data.last_name},
      first_name = ${data.first_name},
      kana_last_name = ${data.kana_last_name},
      kana_first_name = ${data.kana_first_name},
      gender = ${data.gender},
      birth_date = ${data.birth_date},
      age = ${data.age},
      post_code = ${data.post_code},
      address = ${data.address},
      tel = ${data.tel},
      profile = ${data.profile},
      pm_years = ${data.pm_years},
      updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? "0");
    const numberOfCustomers = Number(data[1][0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
