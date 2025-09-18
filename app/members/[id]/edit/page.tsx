import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

export default async function EditMemberPage({ params }: { params: any }) {
  // any なので直接アクセスできます
  const id = String(params.id);
  const member = await getMemberById(id);

  return <MemberForm mode="edit" initialData={member} memberId={id} />;
}
