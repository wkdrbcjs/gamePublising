import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) as any
  const session = ref(null) as any

  const isAuthenticated = computed(() => !!user.value)
  const supabase_client = useSupabaseClient()
  const config = useRuntimeConfig()
  
  // 세션 확인
  const fetchSession = async () => {
    console.log('세션 확인')
    const { data,error } = await supabase_client.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    return {
      user: user.value, 
      session: session.value
    }
  }

  // 이메일 및 패스워드로 로그인
  const loginWithPw = async (email: string, password: string) => {
    console.log('이메일 및 패스워드로 로그인', email, password)

    // 비밀번호 암호화
    const hashedPassword = await sha256(password);

    const { data, error } = await supabase_client.auth.signInWithPassword({
      email: email,
      password: hashedPassword,
    })
    console.log('이메일 로그인',data,error)
    if (error) {
      console.log('이메일 로그인 에러:', error.message)
      return error.message
    }
    session.value = data.session
    user.value = data.user
    return user.value
  }

  // supabase auth 유저 생성
  const supaBaseAuthCreate = async(email:string, pwd: string )=>{
    // auth 유저 생성은 admin 전용 cli를 생성 후 진행
    const supabaseAdmin = await createClient(config.public.supabase_url!, config.public.supabase_rolekey!);
    
    // 비밀번호 암호화
    const hashedPassword = await sha256(pwd);
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: hashedPassword
    })
    console.log('auth 유저 생성 결과:', data, error?.message)
    if(error){
      console.log('auth 유저 생성 에러:',error?.message)
      if(error?.message.includes('cannot be used')){
        return 'cannot be used'
      } else {
        return 'otherReason'
      }
    }
    console.log('auth 유저 생성 완료', data?.user)
    return data?.user
  }

  // 메일 인증 다시 보내기
  const resendAuthMail= async(email: string)=>{
    const {data,error} = await supabase_client.auth.resend({
      type: 'signup',
      email: email
    })
    console.log('resendAuthMail', data, error)
    if(error) return error
    return data
  }


  // 구글로 로그인
  const loginWithGoogle = async() => {
    const { data, error } = await supabase_client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://zccgglnkyyrsxdicnwih.supabase.co/auth/v1/callback`
      }
    })
    // console.log('구글 로그인 결과:', data, error)
    // if(error) {
    //   console.log('구글 로그인 에러:', error, error?.message)
    // }
    // return data.url
  }

  const signUp = async (email:string, pwd:string) => {
    const { data, error } = await supabase_client.auth.signUp({
      email:email,
      password: pwd
    })
    if (error) {throw error}
    return data
  }

  const signOut = async () => {
    const { error } = await supabase_client.auth.signOut()
    if (error) {throw error}
    session.value = null
    user.value = null
  }

  // 패스워드 sha256 암호화
  async function sha256(passwords: string) {
    const msgBuffer = new TextEncoder().encode(passwords);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // console.log('패스워드 암호화:', hashArray.map(b => b.toString(16).padStart(2, '0')).join(''))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  return {
    user,
    session,
    isAuthenticated,
    fetchSession,
    loginWithPw,
    loginWithGoogle,
    supaBaseAuthCreate,
    resendAuthMail,
    signUp,
    signOut
  }
})