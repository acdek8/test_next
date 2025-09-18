"use client";

import { useRouter } from "next/navigation";

export default function EditButton({ memberId }: { memberId: string }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/members/${memberId}/edit`);
  };

  return (
    <button
      onClick={handleEdit}
      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
    >
      編集
    </button>
  );
}
