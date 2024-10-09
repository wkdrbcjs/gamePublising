<script setup lang="ts">
import './PortalHeader.scss'
import logo from '~/assets/logo.png'
import LoginDialog from './user/LoginDialog.vue';

const router = useRouter()

const supabase_Client = useSupabaseClient() // supabase 클라이언트 
const authStore = useAuthStore()            // auth 스토어

const isMenuOpen = ref(false)
const open_loginDialog = ref(false)
const showingLogout = ref(false)

const bgColor = ref('#1D1F26') // 나중에 페이지에 따라 헤더 색이 바뀌어야 할 수도?

const menuItems = [
  { title: 'ホーム', link:'/home' },
  { title: 'お知らせ', link:'/news' },
  { title: 'ゲーム', link:'/game' },
  { title: 'サポート', link:'/support' },
]

/*onMounted(async()=>{
  console.log('this is PortalHeader')
  console.log('SupaBase CLI: ',supabase_Client)
  let userSession = await authStore.fetchSession();
  console.log('current UserSession:', userSession)
})*/

// 햄버거 메뉴 토글
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const moveTo= (title:string ,link: string)=>{
  console.log(title,'페이지로 이동, link:', link)
  router.push(link)
}

const clickLogin=()=>{
  if(authStore.user === null) {
    open_loginDialog.value = false
    setTimeout(() => {
      open_loginDialog.value = true
    },50)
  }
}

const clickLogOut= async()=>{
  if(authStore.user) {
    showingLogout.value = false
    setTimeout(() => {
      showingLogout.value = true
    },50)
  }
}

</script>

<template>
<v-app-bar :color="bgColor">
  <v-container>
    <v-row align="center">
      <v-col cols="3" class="v_col_logo"> <!-- 로고 -->
        <v-img :src="logo" @click="moveTo('portal','/')"/>
      </v-col>
      <v-col></v-col> <!-- 나머지 빈공간 자동계산 -->

      <!-- 화면 절반 이상일때에는 메뉴 버튼들만 표시 -->
      <v-col class="d-none d-md-flex v_col_menu">
        <v-btn v-for="item in menuItems" :key="item.title" @click="moveTo(item.title, item.link)" >
          {{ item.title }}
        </v-btn>
      </v-col>
      
      <!-- 화면 절반 이하일때에는 햄버거메뉴, 로그인 버튼 표시 -->
      <v-col class="d-flex d-md-none v_col_sign">
        <div class="signArea">
          <div class="d-flex menu_toggle" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <v-btn v-if="!authStore.user" class="d-flex sign_btn">
            <span @click="clickLogin()">ログイン</span>
          </v-btn>

<!-- 리프레시를 해도 로그인 로그아웃 -->

          <v-btn v-else class="d-flex sign_btn">
            <span @click="clickLogOut()">ログアウト</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

  </v-container>
</v-app-bar>

<v-navigation-drawer class="d-flex d-md-none" v-model="isMenuOpen" location="top">
  <v-list class="v_list_style">
    <v-list-item v-for="(item, index) in menuItems" :key="item.title" class="list_item"
      @click="moveTo(item.title, item.link)">
      <v-list-item-title class="item_title">{{ item.title }}</v-list-item-title>
      <v-divider :color="'#FFF'" :thickness="'2px'" />
    </v-list-item>
  </v-list>
</v-navigation-drawer>


<!-- 로그인 컴포넌트 추가 -->
<LoginDialog 
  :openDialog="open_loginDialog"
  :isLogut="showingLogout" 
  @closeDialog="open_loginDialog = false, showingLogout = false">
</LoginDialog>


<!-- todo -->
<!-- 로그인 되었을 때 헤더 화면 변경 또는 유저 정보를 보여줄 수 있는 무언가 -->


</template>