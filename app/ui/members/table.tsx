'use client';

export default function MembersTable({ members }: { members: any[] }) {
  return (
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">氏名</th>
          <th className="border px-2 py-1">ふりがな</th>
          <th className="border px-2 py-1">性別</th>
          <th className="border px-2 py-1">年齢</th>
          <th className="border px-2 py-1">電話番号</th>
          <th className="border px-2 py-1">プロフィール</th>
          <th className="border px-2 py-1">登録日時</th>
          <th className="border px-2 py-1">更新日時</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td className="border px-2 py-1">{m.id}</td>
            <td className="border px-2 py-1">{m.last_name} {m.first_name}</td>
            <td className="border px-2 py-1">{m.kana_last_name} {m.kana_first_name}</td>
            <td className="border px-2 py-1">{m.gender}</td>
            <td className="border px-2 py-1">{m.age ?? '-'}</td>
            <td className="border px-2 py-1">{m.tel}</td>
            <td className="border px-2 py-1">{m.profile}</td>
            <td className="border px-2 py-1">{new Date(m.created_at).toLocaleString()}</td>
            <td className="border px-2 py-1">{new Date(m.updated_at).toLocaleString()}</td>
            <td className="border px-2 py-1 text-center">
              <button className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                編集
              </button>
            </td>
            <td className="border px-2 py-1 text-center">
              <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
