import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '~/types/schema'     // npx supabase gen types typescript --linked > ./types/schema.ts로 갱신

export default defineEventHandler(async (event) => {
  const logintype = getRouterParam(event, 'logintype')

  const supabase_svr_client = await serverSupabaseClient<Database>(event);
  // 
  const supa_url = process.env.SUPABASE_URL
  const supa_role_key = process.env.SUPABASE_ROLEKEY


  ///////    내부 함수   /////////
  // supabase auth 유저 추가
  const userRegitOnSupaBaseAuth= async(email:string, pwd: string )=>{
    const supabaseAdmin = await createClient(supa_url!, supa_role_key!);
    console.log('auth 유저 생성')
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: pwd
    })
    console.log('user Regit On SupaBase Auth:', data, error?.message)
    if(error){
      console.log('create auth user error:',error?.message)
      if(error?.message.includes('cannot be used')){
        return 'notValidMail'
      }
    }
    console.log('auth 유저 생성 완료', data)
    return data
  }

  // 이메일 패스워드 로그인 방식
  const userSignWithPwd = async(email:string, pwd: string )=>{
    const { data, error } = await supabase_svr_client.auth.signInWithPassword({
      email: email,
      password: pwd
    })

    if(error){
      console.log('로그인 시도 에러:',error.message)
      // auth 유저 등록이 안되어 있는 경우
      if(error.message.includes('Invalid login credentials')){ 
        // auth 유저 생성 
        const authres = await userRegitOnSupaBaseAuth(email, pwd)
        if(authres === 'notValidMail'){
          return { user: 'not valid mail' }
        }
        // signup을 해서 메일 인증 요청
        await supabase_svr_client.auth.signUp({
          email: email,
          password: pwd
        })
        return { user: 'please check mail' }
      }
      // 메일 확인을 안한 경우
      if(error.message.includes('Email not confirmed')){
        const {data,error} = await supabase_svr_client.auth.resend({
          type: 'signup',
          email: email
        })
        console.log('resend:', data)
        return { user: 'please check mail' }
      }
      return { user: 'other reason' }
    }

    return { user: data.user, session: data.session }
  }

  const userSignWithGoogle = async() =>{
    const { data, error } = await supabase_svr_client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://zccgglnkyyrsxdicnwih.supabase.co/auth/v1/callback`
      }
    })
    console.log('구글 로그인 결과:', data, error)
    if(error) {
      console.log('구글 로그인 에러:', error, error?.message)
    }
    return data.url
  }

  ////////////////////////////////

  ///////   로그인 관련 로직  /////////
  /////// 이메일 패스워드로 로그인하려는 경우 
  /*if(logintype === 'loginemailwithpw'){
    console.log('== Login With Email/Password Start ==')
    
    // 서버로 전달 받은 Body 조회 
    const {email, pwd} = await readBody(event)
    console.log('로그인 시도:', email, pwd)
    // 0. 기존 회원 로그인 시도
    // 1. 기존 회원 등록 되어 있으면 -> signup
    // 2. 회원 안되어 있으면 생성 -> mail 확인 요청 보냄
    // 3. 메일 확인을 안하면 userSignWithPwd가 통과가 안됨... ==> Email not confirmed 에러 
    // => please check mail 반환

    console.log(0, '로그인 시도')
    let signresult = await userSignWithPwd(email, pwd)
    console.log('로그인 결과:',signresult)

    if(signresult.user === 'please check mail'){
      console.log('이메일 체크 요망:', email)
      return 'checkEmail';
    }
    if(signresult.user === 'not valid mail'){
      console.log('이메일 형식 올바르지 않음:', email)
      return 'checkEmailVaild';
    }
    if(signresult.user === 'other reason'){
      return 'unknwon';
    }


    // 로그인 정보를 회원 정보DB에 갱신


    // 로그인 상태
    const { data, error } = await supabase_svr_client.auth.signUp({
      email: email,
      password: pwd
    })
    console.log('signUp result', data, error)
    if(error){
      console.log('sign up error:',error.message)
      return 'failSignUp';
    }

    console.log('== Login With Email/Password End ==')
    return { user:signresult.user, session: signresult.session }
  }*/

  //////// 구글로 로그인하려는 경우
  /*else if(logintype === 'loginwithgoogle'){
    console.log('== Login With Google Start ==')
    let signresult = await userSignWithGoogle()
    console.log('Login Result :', signresult) // -> url 및 provider를 획득  
    console.log('== Login With Google End ==')
    return signresult
  }*/
  
})
