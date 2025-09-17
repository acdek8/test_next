import { fetchMembers } from "@/app/lib/data";
import MembersTable from "@/app/ui/members/table";

// 明示的に PageProps を定義
type PageProps = {
  searchParams?: {
    kana?: string;
    ageMin?: string;
    ageMax?: string;
    tel?: string;
  };
};

export default async function Page({ searchParams }: any) {
  // searchParams から filters を整形
  const filters = {
    kana: searchParams?.kana || "",
    ageMin: searchParams?.ageMin || "",
    ageMax: searchParams?.ageMax || "",
    tel: searchParams?.tel || "",
  };

  // DB から条件に合うメンバーを取得
  const members = await fetchMembers(filters);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">メンバー一覧</h1>

      {/* 検索フォーム */}
      <form method="GET" className="mb-6 space-y-3">
        {/* ふりがな */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="kana"
            className="w-20 text-sm font-medium text-gray-700"
          >
            ふりがな
          </label>
          <input
            id="kana"
            type="text"
            name="kana"
            placeholder="やまだ"
            defaultValue={filters.kana}
            className="border rounded px-2 py-1 w-48"
          />
        </div>

        {/* 年齢範囲 */}
        <div className="flex items-center gap-2">
          <label className="w-20 text-sm font-medium text-gray-700">年齢</label>
          <input
            type="number"
            name="ageMin"
            placeholder="20"
            defaultValue={filters.ageMin}
            className="border rounded px-2 py-1 w-20"
          />
          <span>〜</span>
          <input
            type="number"
            name="ageMax"
            placeholder="30"
            defaultValue={filters.ageMax}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* 電話番号 */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="tel"
            className="w-20 text-sm font-medium text-gray-700"
          >
            電話番号
          </label>
          <input
            id="tel"
            type="text"
            name="tel"
            placeholder="090-xxxx-xxxx"
            defaultValue={filters.tel}
            className="border rounded px-2 py-1 w-48"
          />
        </div>

        {/* 検索ボタン */}
        <div className="flex justify-start">
          <button
            type="submit"
            className="w-32 bg-blue-500 text-white px-4 py-2 rounded"
          >
            検索
          </button>
        </div>
      </form>

      {/* 一覧テーブル */}
      <MembersTable members={members} />
    </>
  );
}
