// import Form from "@/app/ui/invoices/edit-form";
// import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
// import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";

// // ✅ params は Promise ではなく { id: string } 型
// export default async function Page({ params }: { params: { id: string } }) {
//   const id = params.id;

//   // 請求書データと顧客一覧を並列で取得
//   const [invoice, customers] = await Promise.all([
//     fetchInvoiceById(id),
//     fetchCustomers(),
//   ]);

//   return (
//     <main>
//       {/* パンくずリスト */}
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: "Invoices", href: "/dashboard/invoices" },
//           {
//             label: "Edit Invoice",
//             href: `/dashboard/invoices/${id}/edit`,
//             active: true,
//           },
//         ]}
//       />

//       {/* 編集フォーム */}
//       <Form invoice={invoice} customers={customers} />
//     </main>
//   );
// }
