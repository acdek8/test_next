// app/members/[id]/edit/page.tsx
import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

export default async function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await getMemberById(params.id);
  return <MemberForm mode="edit" initialData={member} memberId={params.id} />;
}
