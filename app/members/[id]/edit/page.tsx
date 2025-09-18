import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

export default async function EditMemberPage({ params }: { params?: any }) {
  // params が Promise<{id: string}> でも {id: string} でも OK
  const p: { id: string } = await params;
  const id = String(p.id);

  const member = await getMemberById(id);

  return <MemberForm mode="edit" initialData={member} memberId={id} />;
}
