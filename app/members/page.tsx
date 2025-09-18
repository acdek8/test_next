// app/members/page.tsx

import { fetchMembers } from "@/app/lib/data";
import MembersTable from "@/app/ui/members/table";

export default async function Page({ searchParams }: any) {
  // any にしたので Promise/undefined を気にせずそのまま扱う
  const sp = searchParams ?? {};

  const filters = {
    kana: sp.kana ?? "",
    ageMin: sp.ageMin ?? "",
    ageMax: sp.ageMax ?? "",
    tel: sp.tel ?? "",
  };

  const members = await fetchMembers(filters);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">メンバー一覧</h1>

      <form method="GET" className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="kana"
            className="w-20 text-sm font-medium text-gray-700"
          >
            ふりがな
          </label>
          <input
            id="kana"
            name="kana"
            type="text"
            placeholder="やまだ"
            defaultValue={filters.kana}
            className="border rounded px-2 py-1 w-48"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-20 text-sm font-medium text-gray-700">年齢</label>
          <input
            name="ageMin"
            type="number"
            placeholder="20"
            defaultValue={filters.ageMin}
            className="border rounded px-2 py-1 w-20"
          />
          <span>〜</span>
          <input
            name="ageMax"
            type="number"
            placeholder="30"
            defaultValue={filters.ageMax}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="tel"
            className="w-20 text-sm font-medium text-gray-700"
          >
            電話番号
          </label>
          <input
            id="tel"
            name="tel"
            type="text"
            placeholder="090-xxxx-xxxx"
            defaultValue={filters.tel}
            className="border rounded px-2 py-1 w-48"
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="w-32 bg-blue-500 text-white px-4 py-2 rounded"
          >
            検索
          </button>
        </div>
      </form>

      <MembersTable members={members} />
    </>
  );
}
