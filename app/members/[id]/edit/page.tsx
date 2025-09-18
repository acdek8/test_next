import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

export default async function EditMemberPage({ params }: { params: any }) {
  const member = await getMemberById(params.id);
  return <MemberForm mode="edit" initialData={member} memberId={params.id} />;
}
