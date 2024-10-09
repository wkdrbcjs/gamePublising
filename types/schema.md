##
의존성 설치
npm install supabase --save-dev

pakage.json 설정
"scripts": {
  "supabase": "supabase"
}

npx supabase login // Access key 생성 -> https://supabase.com/dashboard/account/tokens
npx supabase link --project-ref <Refenence ID>
npx supabase gen types typescript --linked > ./types/schema.ts
-> schema.ts 파일 갱신
##