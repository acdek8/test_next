import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

ype Params = { id: string };

// Next.js が定義している PageProps の制約に合うように
// props.params を必ず Promise<Params> として受け取り
export default async function EditMemberPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // await して Params を展開
  const { id } = await params;

  // 型チェック済みの id を渡してデータ取得
  const member = await getMemberById(id);

  return (
    <MemberForm
      mode="edit"
      initialData={member}
      memberId={id}
    />
  );
}
