"use client";

import { useRouter } from "next/navigation";
import { deleteMemberAction } from "@/app/lib/actions";

export default function DeleteButton({ memberId }: { memberId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除しますか？");
    if (!confirmed) return;

    try {
      await deleteMemberAction(memberId);
      router.refresh(); // 一覧を再取得
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      削除
    </button>
  );
}
