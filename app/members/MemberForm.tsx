"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMemberAction, updateMemberAction } from "@/app/lib/actions";

export default function MemberForm({
  mode,
  initialData,
  memberId,
}: {
  mode: "create" | "edit";
  initialData?: any;
  memberId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(
    initialData || {
      last_name: "",
      first_name: "",
      kana_last_name: "",
      kana_first_name: "",
      gender: "",
      birth_date: "",
      post_code_1: "",
      post_code_2: "",
      address: "",
      tel: "",
      profile: "",
      pm_years: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      await createMemberAction(form);
    } else if (mode === "edit" && memberId) {
      await updateMemberAction(memberId, form);
    }
    router.push("/members");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded shadow"
    >
      <h1 className="text-xl font-bold">
        {mode === "create" ? "メンバー登録" : "メンバー編集"}
      </h1>

      {/* 氏名 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">氏名</label>
          <label className="text-sm text-gray-700">（姓）</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
          <label className="text-sm text-gray-700">（名）</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          漢字、ひらがな、全角カタカナ、全角英字で入力できます。
        </p>
      </div>

      {/* 氏名ふりがな */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">氏名ふりがな</label>
          <label className="text-sm text-gray-700">（せい）</label>
          <input
            name="kana_last_name"
            value={form.kana_last_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
          <label className="text-sm text-gray-700">（めい）</label>
          <input
            name="kana_first_name"
            value={form.kana_first_name}
            onChange={handleChange}
            className="border px-2 py-1 w-40"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          ひらがなで入力してください。
        </p>
      </div>

      {/* 性別 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">性別</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="男性"
              checked={form.gender === "男性"}
              onChange={handleChange}
            />{" "}
            男性
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="女性"
              checked={form.gender === "女性"}
              onChange={handleChange}
            />{" "}
            女性
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          性別を選択してください。
        </p>
      </div>

      {/* 生年月日 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">生年月日</label>
          <input
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            placeholder="YYYY/MM/DD"
            className="border px-2 py-1 w-40"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          未成年の登録は認めておりません。正しい日付を入力してください。
        </p>
      </div>

      {/* 郵便番号 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">郵便番号</label>
          <input
            name="post_code_1"
            value={form.post_code_1}
            onChange={handleChange}
            placeholder="123"
            className="border px-2 py-1 w-20"
          />
          <span>ー</span>
          <input
            name="post_code_2"
            value={form.post_code_2}
            onChange={handleChange}
            placeholder="4567"
            className="border px-2 py-1 w-24"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          正しい形式（3桁 + 4桁の半角数字）で入力してください。
        </p>
      </div>

      {/* 住所 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">住所</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          全角で入力してください。
        </p>
      </div>

      {/* 電話番号 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">電話番号</label>
          <input
            name="tel"
            value={form.tel}
            onChange={handleChange}
            placeholder="08099999999"
            className="border px-2 py-1 w-40"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          半角数字で入力してください。
        </p>
      </div>

      {/* プロフィール */}
      <div>
        <div className="flex items-start gap-4">
          <label className="w-32 font-semibold pt-1">プロフィール</label>
          <textarea
            name="profile"
            value={form.profile}
            onChange={handleChange}
            className="border px-2 py-1 w-full h-24"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          20文字以上200文字以下で入力してください。
        </p>
      </div>

      {/* PM経験年数 */}
      <div>
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">PM経験年数</label>
          <div className="flex items-center gap-2">
            <input
              name="pm_years"
              value={form.pm_years}
              onChange={handleChange}
              placeholder="10"
              className="border px-2 py-1 w-24 text-right"
            />
            <span className="text-gray-700">年</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-32">
          未入力の場合は0年として登録します。
        </p>
      </div>

      {/* ボタン */}
      <div className="pt-4">
        <button
          type="submit"
          className={`px-6 py-2 rounded text-white ${
            mode === "create"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {mode === "create" ? "登録" : "更新"}
        </button>
      </div>
    </form>
  );
}
