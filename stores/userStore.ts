import { defineStore } from 'pinia'
import type {IUser,IServerRes} from '~/interfaces/userInfo.interface'

export const useUserStore = defineStore('userStore', () => {
  const userinfo = ref<IUser | null>(null)

  const { $apiFetch } = useNuxtApp();

  const setUserStore = (userInfo: IUser)=>{
    console.log('user Store Set UserInfo:', userInfo)
    userinfo.value = {...userInfo}
  }

  const unsetUserStore= ()=>{
    console.log('user Store unSet UserInfo')
    userinfo.value = null
  }

  // 이메일에 해당하는 유저 정보 가져오기
  const getUserInfobyEmail= async(email:string)=>{
    const {data:data,error} = await $apiFetch('/api/user/getuserinfo', {
      user_email: email
    })
    console.log('DB 유저 정보:', data)
    let result = data as IServerRes

    if(result?.error) {
      return null;
    }
    return result?.data
  }

  const userInfoPut = async(userInfo: any)=>{
    const {data:data,error} = await $apiFetch('/api/user/userinfoput', {
      ...userInfo
    })
    // console.log('유저 정보 저장 결과:', data) 
    // {0: func_name: "func_user_put"
    // op: "insert"
    // rst_val: 200}
    let result = data as any
    
    console.log('유저 정보 저장 결과:', result[0])

    if(error){
      console.error('userinfoput error:',error)
      return null;
    }
    return result[0]?.rst_val // 200(inset) or 201(update)
  }
 
  

  return {
    userinfo,
    getUserInfobyEmail,
    userInfoPut,
    setUserStore,
    unsetUserStore,
  }
}, {
  persist: true // 상태를 로컬 스토리지에 자동으로 저장
});