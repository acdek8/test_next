"use client";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const genderLabel: Record<number, string> = {
  0: "未回答",
  1: "男性",
  2: "女性",
};

export default function MembersTable({ members }: { members: any[] }) {
  return (
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">氏名</th>
          <th className="border px-2 py-1">氏名ふりがな</th>
          <th className="border px-2 py-1">性別</th>
          <th className="border px-2 py-1">年齢</th>
          <th className="border px-2 py-1">電話番号</th>
          <th className="border px-2 py-1">プロフィール</th>
          <th className="border px-2 py-1">PM経験年数</th>
          <th className="border px-2 py-1">登録日時</th>
          <th className="border px-2 py-1 text-center"></th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td className="border px-2 py-1">
              {m.last_name} {m.first_name}
            </td>
            <td className="border px-2 py-1">
              {m.kana_last_name} {m.kana_first_name}
            </td>
            <td className="border px-4 py-2">
              {genderLabel[m.gender] ?? "不明"}
            </td>
            <td className="border px-2 py-1">{m.age ?? "-"}</td>
            <td className="border px-2 py-1">{m.tel}</td>
            <td className="border px-2 py-1">{m.profile}</td>
            <td className="border px-2 py-1">{m.pm_years}年</td>
            <td className="border px-2 py-1">
              {m.updated_at
                ? new Date(m.updated_at).toLocaleString("ja-JP")
                : "-"}
            </td>
            <td className="border px-2 py-1 text-center whitespace-nowrap">
              <EditButton memberId={m.id} />
              <DeleteButton memberId={m.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
