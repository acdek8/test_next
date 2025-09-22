// app/members/MemberValidation.tsx

const nameRegex =
  /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uFF21-\uFF3A\uFF41-\uFF5A]+$/;
const kanaRegex = /^[\u3040-\u309Fー]+$/;
const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
const telRegex = /^\d{10,11}$/;

export function validateMemberForm(form: Record<string, string>) {
  const errors: Record<string, string> = {};

  if (
    !form.last_name ||
    form.last_name.length > 20 ||
    !nameRegex.test(form.last_name)
  ) {
    errors.last_name =
      "姓は必須です。姓は20文字以下で入力してください。登録できない文字が含まれています。";
  }
  if (
    !form.first_name ||
    form.first_name.length > 20 ||
    !nameRegex.test(form.first_name)
  ) {
    errors.first_name =
      "名は必須です。名は20文字以下で入力してください。登録できない文字が含まれています。";
  }

  if (
    !form.kana_last_name ||
    form.kana_last_name.length > 20 ||
    !kanaRegex.test(form.kana_last_name)
  ) {
    errors.kana_last_name =
      "氏名ふりがなは必須項目です。姓は20文字以下で入力してください。登録できない文字が含まれています。";
  }
  if (
    !form.kana_first_name ||
    form.kana_first_name.length > 20 ||
    !kanaRegex.test(form.kana_first_name)
  ) {
    errors.kana_first_name =
      "氏名ふりがなは必須項目です。名は20文字以下で入力してください。登録できない文字が含まれています。";
  }

  if (!form.gender) {
    errors.gender = "性別を選択してください。";
  }

  if (!form.birth_date || !dateRegex.test(form.birth_date)) {
    errors.birth_date =
      "未来の日付は登録できません。正しい形式で入力してください。";
  } else {
    const inputDate = new Date(form.birth_date.replaceAll("/", "-"));
    if (inputDate > new Date()) {
      errors.birth_date = "未来の日付は入力できません";
    }
  }

  if (
    !form.post_code_1 ||
    !form.post_code_2 ||
    !/^\d{3}$/.test(form.post_code_1) ||
    !/^\d{4}$/.test(form.post_code_2)
  ) {
    errors.post_code = "正しい形式で入力してください。";
  }

  if (form.address.length > 100) {
    errors.address = "住所は100文字以内で入力してください";
  }

  if (!form.tel || !telRegex.test(form.tel)) {
    errors.tel =
      "電話番号は必須項目です。電話番号は10〜11桁の半角数字で入力してください";
  }

  if (form.profile.length > 200) {
    errors.profile = "プロフィールは200文字以内で入力してください";
  }

  return errors;
}
