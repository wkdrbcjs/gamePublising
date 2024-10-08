
<script setup lang="ts">
import './LoginDialog.scss'
import type {IUser,IRes, ISignRes} from '~/interfaces/userInfo.interface'

import { validationRules as getValidationRules } from '@/tools/validationRules';
import { useAuthStore } from '~/stores/auth'

import iconApple from '~/assets/images/login/ico_apple.png';
import iconGoogle from '~/assets/images/login/ico_google.png';
import iconX from '~/assets/images/login/ico_x.png';

const { $apiFetch, $toast } = useNuxtApp()
const validationRules = getValidationRules()
const authStore = useAuthStore()
const route = useRoute()
const userStore = useUserStore()

const prop = defineProps({
  openDialog:{type:Boolean, required:true},
  isLogut:{type:Boolean, required:true},
})
const emit= defineEmits(['closeDialog'])

const showLogin_Popup = ref(false)
const showLogOut_Popup = ref(false)

watch(() => prop.openDialog, (newVal) =>{
  if(newVal){
    console.log('watch prop.openDialog', newVal)
    showLogin_Popup.value = newVal
  }
})

watch(() => prop.isLogut, (newVal) =>{
  if(newVal){
    console.log('watch prop.openDialog', newVal)
    showLogOut_Popup.value = newVal
  }
})

const showCheckEmail = ref(false)     // 메일 인증 확인 팝업
const showCheckEmail_re = ref(false)  // 메일 재송신 확인 팝업

const userEmail = ref('')
const userNickNanme = ref('')
const userEmailRCV = ref(0)

const login_email = ref('')
const login_pw = ref('')
const showPassword = ref(false)
const login_other = ref('')

const findUserInfo = ref<IUser[]>([])

onMounted(async()=>{
  // 유저 세션확인 = 로그아웃 안하고 브라우저 종료했으면 남아있을 수 있음
  let userSession = await authStore.fetchSession();
  console.log('current UserSession:', userSession)
  
  // 구글 로그인이 되었는지 확인, url에 code가 붙어있는지 보면 됨
  const check_code = route.query?.code
  console.log('this is LoginDialog check_code:', check_code)

  // 구글 로그인 같은 소셜 로그인은 페이지가 리다이렉트되기 때문에 onMounted에서 처리
  // 이메일/패스워드는 관련 로직에서 직접 처리
  // check_code가 있으면 구글 로그인을 한 것이므로 router에 도메인만 잘라서 돌려주고 유저 생성 또는 업데이트 진행
  if(check_code !== undefined && userSession.session !== null) {
    console.log('소셜 로그인 됨 유저 정보 insert 또는 update')
    // auth 말고 suapbase의 DB
    // 유저 찾기 -> DB에 유저 없으면 insert 없으면 upodate -> supabse의 func_user_put 에서 처리
    await setUserInDB()
  }
})

const setUserInDB= async()=>{
  // 소셜 로그인     : code 값이 있어야 진행되므로 무조건 세션이 존재함
  // 이메일/패스워드 : 로그인 완료되면 세션 업데이트 이뤄지기 때문에 무조건 세션 존재함 
  console.log('DB에서 검색할 유저 이메일:',authStore.user?.email)

  // 1. 유저가 DB 상에 존재 하는지 확인
  findUserInfo.value.push(await userStore.getUserInfobyEmail(authStore.user?.email))
  console.log('DB userInfo: ',findUserInfo.value[0])

  // 유저 정보 있으면 update 업데이트 목록: 최근 접속 날짜, 프로바이더 등..
  if(findUserInfo.value[0] !== null){
    console.log('유저 정보 있으면 update')
    await checkUpdateUserInfo()
  } 
  // 유저 정보가 없으면 insert
  else {
    console.log('유저 정보가 없으면 insert')
    await checkInsertUserInfo()
  }
}

// user 데이터를 전달하면 func_user_put 에서 insert
const checkInsertUserInfo= async()=>{
  let user = {
    user_serial_num: null,                          // null 로 입력하면 insert시키는데 identify 설정되어 있으므로 자동 증가
    user_email: authStore.user?.email,
    user_nick: authStore.user?.email.split('@')[0], // 이메일 @ 까지 자르기
    user_auth_id: authStore.user?.id,               // uuid
    user_point: 0,
    user_prof_img: '~',
    is_email_rcv: 1,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  }

  console.log('insert 유저 정보:', user)
  let result = await userStore.userInfoPut(user)
  console.log('insert 결과:',result)
  if(result && result !== undefined) {
    await userStore.setUserStore(user)
    console.log('유저 스토어:', userStore.userinfo)
  }
}

// user 데이터를 전달하면 func_user_put 에서 update -> 변경된 데이터만 바뀜
// 유저의 세션이 유지된 환경인지 알기 애매해서 let user로 생성해서 store에 저장
// ex) providers, last_sign_in_at
const checkUpdateUserInfo= async()=>{
  let user = {
    user_serial_num: findUserInfo.value[0].user_serial_num,
    user_email: findUserInfo.value[0].user_email,
    user_nick: findUserInfo.value[0].user_nick,
    user_auth_id: findUserInfo.value[0].user_auth_id,
    user_point: findUserInfo.value[0].user_point,
    user_prof_img: findUserInfo.value[0].user_prof_img,
    is_email_rcv: findUserInfo.value[0].is_email_rcv,
    create_at: findUserInfo.value[0].create_at,
    update_at: authStore.user?.last_sign_in_at                // <- 웬만하면 얘만 바뀜
  }

  console.log('update 유저 정보:', user)
  let result = await userStore.userInfoPut(user)
  console.log('update 결과:',result)
  if(result && result !== undefined) {
    await userStore.setUserStore(user)
    console.log('유저 스토어:', userStore.userinfo)
  }
}


// 이메일로 로그인
const loginWithEmail = async () => {
  console.log('loginWithEmail:', login_email.value, login_pw.value)
  if(!login_email.value){
    $toast.info('이메일 입력해주세요')
    return
  }
  if(!login_pw.value){
    $toast.info('비밀번호 입력해주세요')
    return
  }

  // 스토어 이메일 로그인 로직 호출
  const loginResult = await authStore.loginWithPw(login_email.value, login_pw.value)
  console.log('이메일 로그인 결과:', loginResult)
  
  // 로그인 결과에 따른 분기 처리
  if(typeof(loginResult) === 'string'){
    // auth 유저 등록이 안되어있는 경우 - auth 생성 - 메일 인증
    if(loginResult.includes('Invalid login credentials')){
      console.log('auth 생성 시작')
      let userCreate = await authStore.supaBaseAuthCreate(login_email.value, login_pw.value)

      // 메일 형식이 유효한 형식이 아닌 경우 ex) 오타 gamil
      if(typeof(userCreate) === 'string' && userCreate.includes('cannot be used')){
        $toast.info('有効なメールか確認してください。')
        return
      }
      else if(typeof(userCreate) === 'string' && userCreate.includes('otherReason')){
        console.log('otherReason')
        return
      }
      // 정상적으로 auth 생성이 된 경우 -- signup추가 해야됨
      else {
        // 메일 인증을 해달라고 표시
        showCheckEmail.value = true
        return
      }
    }
    // 메일 인증을 하지 않은 경우
    if(loginResult.includes('Email not confirmed')){
      showCheckEmail_re.value = true
      return
    }
  }

  let userSession = await authStore.fetchSession()
  console.log('이메일/패스워드 로그인 후 세션 확인:', userSession)

  // 유저 정보 스토어에 저장
  await setUserInDB()

  $toast.success('musubi Gamesへようこそ!')
  closeLoginDioalog()
}

// 구글로 로그인 
// 구글 프로바이더 url 반환 -> 반환된 url 오픈 -> 로그인(자동 or 수동)
// * 구글 로그인 되어있으면 자동으로 Auth 유저 생성 및 세션 갱신
// * 게스트 브라우저인 경우 구글 프로바이더 url로 라우팅 ->유저가 구글 로그인 -> Auth 유저 생성 및 세션 갱신
// * 유저 생성 확인 : https://supabase.com/dashboard/project/zccgglnkyyrsxdicnwih/auth/users
const clickLoginWithGoogle= async() => {
  await authStore.loginWithGoogle()
  let userSession = await authStore.fetchSession()
  console.log('구글 로그인 후 세션 확인:', userSession)
  if(authStore.user) $toast.success('musubi Gamesへようこそ!')
}


// 로그아웃 - 세션 없앰
const clicklogOut= async()=>{
  showLogOut_Popup.value = false
  await authStore.signOut()
  
  let userSession = await authStore.fetchSession()
  console.log('로그아웃 후 세션 확인:', userSession)

  await userStore.unsetUserStore()

  if(!authStore.user) $toast.success('ログアウトしました。')
}

// 2024/10/04 기준
// SMTP 설정하지 않으면 org에 등록된 구성원(대표님, 나)에게만 메일 보내기 및 시간당 4건의 메일만 보내기가 가능
// 참고: https://supabase.com/docs/guides/platform/going-into-prod#rate-limiting-resource-allocation--abuse-prevention
const resendEmail= async()=>{
  console.log('이메일 재송신')
  showCheckEmail_re.value = false
  let resendResult = await authStore.resendAuthMail(login_email.value)
  if(resendResult) $toast.info('再送信しました。')
}

const closeLoginDioalog= ()=>{
  showLogin_Popup.value = false
  login_email.value = ''
  login_pw.value = ''
  emit('closeDialog')
}



/*const loginEmailWithPw = async() =>{
  console.log('로그인 시도 이메일:', login_email.value)
  if(!login_email.value){
    $toast.info('이메일 입력해주세요')
    return
  }
  if(!login_pw.value){
    $toast.info('비밀번호 입력해주세요')
    return
  }

  const {data:data,error} = await $apiFetch('/api/user/login/loginemailwithpw', {
    email: login_email.value,
    pwd: login_pw.value
  })

  console.log('로그인 결과:',data)

  if(data ==='checkEmail'){
    showCheckEmail.value = true
  }
  else if(data ==='checkEmailVaild'){
    $toast.info('有効なメールか確認してください。')
  }
  else if(data ==='failSignUp'){
    $toast.info('이 이메일로는 로그인이 불가합니다.')
  }

  else if(data === 'unknwon'){
    $toast.error('서버 에러 발생')
  }

  else{
    let result = data as ISignRes
    $toast.success('로그인 성공')
  }
}*/

/*const clickLoginWithGoogle= async() => {
  await loginWithGoogle()
  if(google_Result_Code){
    // 코드 반환되었으면 로그인 완료
    console.log('반환된 코드', google_Result_Code)
    // session 갱신
    authStore.fetchSession()
  }
}

const loginWithGoogle = async() =>{
  const {data,error} = await $apiFetch('/api/user/login/loginwithgoogle', {})

  console.log('구글로 로그인 결과:', data,error)
  if (error) {
    console.error('Error Email logging in:', error)
  }
  let googleURL = data as string

  if (googleURL) {
    const width = 600;
    const height = 800;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const newWindow = window.open(
      googleURL,
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );

    if (newWindow) {
      const checkWindowClosed = setInterval(() => {
        let code = null
        try {
          if (newWindow.closed) {
            clearInterval(checkWindowClosed);
            console.log('로그인 창이 닫혔습니다.')
          } else {
            const currentUrl = newWindow.location.href;
            console.log(currentUrl)
            if (currentUrl.includes('code=')) {
              console.log('code 추출')
              code = getExtractCode(currentUrl);
              console.log(code)
              google_Result_Code.value = code ?? ''
              clearInterval(checkWindowClosed);
              newWindow.close();
            }
          }
        } catch (e) {
          // 크로스 도메인 오류 방지
        }
      }, 500);
    } else {
      console.log(new Error('팝업 창을 열 수 없습니다.'));
    }
  }
};

// 구글 로그인 - 반환된 코드
const getExtractCode = (url:any) => {
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get('code');
};
*/

</script>


<template>
  <!-- 로그인 팝업-->
  <v-dialog v-model="showLogin_Popup" class="loginDialog">
    <v-card class="dialogCardArea elevation-3">

      <div class="close_icon" @click="closeLoginDioalog()">
        <v-icon color="red darken-3">mdi-close</v-icon>
      </div>

      <v-card-title class="text-h5 font-weight-bold card_Title">
        ログイン
      </v-card-title>
      <v-card-text class="card_text">
        <v-form class="_form">
          <h3 class="h3_title">
            メールアドレス
          </h3>
          <v-text-field
            v-model="login_email"
            bg-color="white"
            variant="outlined"
            placeholder="m@example.com"
            :rules="validationRules.emailRules"
          />
          <h3 class="h3_title _space">
            パスワード
            <div class="" style="align-items: end;">
              <a href="#" style="color: gray;">パスワード変更</a>
            </div>
          </h3>
          <v-text-field 
            v-model="login_pw"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
          />
          
          <v-btn color="black" class="mt-4" elevation="2" block
            @click="loginWithEmail()">
            <span> ログイン </span>
          </v-btn>

          <v-btn variant="outlined" class="mt-4" block @click="clickLoginWithGoogle()">
            <v-img class="login_icon" :src="iconGoogle" contain />
            <span> Googleでログイン </span>
          </v-btn>

        </v-form>
      </v-card-text>
      <v-card-text class="text-center mt-2">
        Don't have an account? <a href="#" class="text-decoration-none">Sign up</a>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- 로그아웃 팝업 -->
  <v-dialog v-model="showLogOut_Popup" class="loginDialog notLoginPopup" :opacity="0">
    <v-card class="dialogCardArea elevation-3">
      <v-card-text class="card_text">
        <v-form class="_form">
          <h3 class="h3_title logout_title">
            ログアウトしますか？
           </h3>
          
          <div class="logoutBtnArea">
            <v-btn color="white" class="cancelBtn" elevation="2"
              @click="showLogOut_Popup = false">
              <span> キャンセル </span>
            </v-btn>

            <v-btn color="black" class="confirmBtn" elevation="2"
              @click="clicklogOut()">
              <span> ログアウト </span>
            </v-btn>
          </div>

        </v-form>
      </v-card-text>

    </v-card>
  </v-dialog>

  <!-- 이메일 확인 요청 팝업 -->
  <v-dialog v-model="showCheckEmail" class="loginDialog notLoginPopup" :opacity="0">
    <v-card class="dialogCardArea elevation-3">
      <v-card-text class="card_text">
        <v-form class="_form">
          <h3 class="h3_title logout_title">
            Musubi Gamesへようこそ!
          </h3>
          <h3 class="h3_text">
            認証メールを送りましたので<a href="https://mail.google.com" style="color: inherit; cursor: pointer;">
            <u>メール認証</u></a>後、再度ログインをお願いします。
          </h3>
          
          <v-btn color="black" class="mt-4" elevation="2" block
            @click="showCheckEmail = false">
            <span> 出る </span>
          </v-btn>
        </v-form>
      </v-card-text>

    </v-card>
  </v-dialog>

  <!-- 이메일 재송신 요청 팝업 -->
  <v-dialog v-model="showCheckEmail_re" class="loginDialog notLoginPopup" :opacity="0">
    <v-card class="dialogCardArea elevation-3">
      <v-card-text class="card_text">
        <v-form class="_form">
          <h3 class="h3_title logout_title">
            メール認証エラー
          </h3>
          <h3 class="h3_text">
            認証メールをお送りしましたが、まだ確認が完了していません。
            <br>お手数ですが、認証の確認をお願いします。
          </h3>
          
          <div class="logoutBtnArea">
            <v-btn color="white" class="cancelBtn" elevation="2"
              @click="showCheckEmail_re = false">
              <span> 出る </span>
            </v-btn>

            <v-btn color="black" class="confirmBtn" elevation="2"
              @click="resendEmail()">
              <span> 再送信 </span>
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

    </v-card>
  </v-dialog>
  
</template>
