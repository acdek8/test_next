import { getMemberById } from "@/app/lib/data";
import MemberForm from "../../MemberForm";

type Params = {
  id: string;
};

export default async function EditMemberPage({
  // params は Promise の場合もあるので await する
  params: rawParams,
}: {
  params?: Params | Promise<Params>;
}) {
  // await すると、Promise でも通常のオブジェクトでも正しく中身を取得できる
  const { id } = rawParams ? await rawParams : { id: "" };

  // DB からメンバーを取得
  const member = await getMemberById(id);

  return <MemberForm mode="edit" initialData={member} memberId={id} />;
}
