import { countGrapheme } from "~/tools/stringHandler";

export const validationRules = ()=> ({
  required: (v: string) => !!v || "必ず入力してください",

  emailRules: [
    (v: string) => !!v || "メールアドレスは入力必須です",
    (v: string) => /.+@.+\..+/.test(v) || "メールアドレスの形式で入力してください"
  ],

  halfWidthJapanese: (v: string) => /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/.test(v) || "半角英数記号のみ入力してください",
  min10Characters: (v: string) => (v && v.length >= 10) || "10文字以上入力してください",
  min8Characters: (v: string) => (v && v.length >= 8) || "8文字以上入力してください",
  max16Characters: (v: string) => (v && v.length <= 16) || "文字数は16文字以内でお願いします",
  max25Characters: (v: string) => (v && v.length <= 25) || "文字数は25文字以内でお願いします",
  max50Characters: (v: string) => (v && v.length <= 50) || "文字数は50文字以内でお願いします",
  mustHaveOneNumber: (v: string) => /(?=.*\d)/.test(v) || "少なくとも1つの数字を入力してください",
  all6DigitNumbers: (v: string) => /^[0-9]{6}$/.test(v) || "６桁の数字を入力してください",
  mustHaveOneSpecialCharacter: (v: string) => /([#!@$%])/.test(v) || "少なくとも1つの特殊文字(#、!、@、$、%)を入力してください",
  mustHaveOneUppercaseCharacter: (v: string) => /(?=.*[A-Z])/.test(v) || "少なくとも1つの英大文字を入力してください",
  confirmPassword: (targetPwd: string, checkPwd: string) => targetPwd === checkPwd || "「パスワード」 と 「パスワード(確認)」 が一致しません",
  max16Graphemes: (v: string) => (v && countGrapheme(v) <= 16) || "文字数は16文字以内でお願いします",
  validZipcode: (v: string) => /^\d{3}-*\d{4}$/.test(v) || "正しい郵便番号を入力してください",
  onlyAlphabet: (v: string) => /^[A-Za-z]*$/.test(v) || "半角英字でご入力ください",
  min2Characters: (v: string) => (v && v.length >= 2) || "2文字以上入力してください",
  notIncludeSpace: (v: string) => !(/( |　)+/g.test(v)) || "スペースは入力しないでください。",
  exact8AlphaNumeric: (v: string) => !v || /^[a-zA-Z0-9]{8}$/.test(v) || "8文字の半角英数で入力してください",
});
