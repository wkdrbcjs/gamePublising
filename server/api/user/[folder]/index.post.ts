import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/schema'     // npx supabase gen types typescript --linked > ./types/schema.ts로 갱신
import type {IUser} from '~/interfaces/userInfo.interface'


export default defineEventHandler(async (event) => {
  const folderName = getRouterParam(event, 'folder')

  const supabase_svr_client = await serverSupabaseClient<Database>(event);
  const read_Body_data = await readBody(event)

  // 유저 등록 또는 업데이트
  if(folderName === 'userinfoput'){
    console.log('userinfoput read body data:', read_Body_data)
    const userInfoData = read_Body_data as IUser

    if (userInfoData.user_email && userInfoData.user_nick) {
      console.log('func_user_put call')
      const {data,error} = await supabase_svr_client.rpc('func_user_put',{
        p_user_serial_num: userInfoData.user_serial_num as any,
        p_user_email: userInfoData.user_email,
        p_user_nick: userInfoData.user_nick,
        p_user_auth_id: userInfoData.user_auth_id,
        p_user_point: userInfoData.user_point,
        p_user_prof_img: userInfoData.user_prof_img,
        p_is_email_rcv: userInfoData.is_email_rcv,
        p_create_at: userInfoData.create_at,
        p_update_at: userInfoData.update_at
      })

      if (error) {
        console.error('유저 정보 저장 실패:', error)
        throw createError({
          statusCode: 500,
          statusMessage: error.message
        })
      }

      console.log('유저 정보 저장 성공:',data)
      return data;
    } else{
      return null;
    }
  }
  // 이메일이 일치하는 유저 정보 가져오기
  else if(folderName === 'getuserinfo'){
    console.log('getinfobymail read body data:', read_Body_data)

    const {data,error} = await supabase_svr_client
    .from('tb_user_mst')                          // tb_user_mst라는 테이블로부터
    .select('*')                                  // 전체 데이터 대상으로 ('*'은 생략가능)
    .eq('user_email', read_Body_data.user_email)  // 필드명 user_email의 데이터가 read_Body_data의 데이터랑 같은 행
    .single()                                // 단일 데이터 반환 

    if(error){
      console.log('not found userinfo', error.message)
    }

    console.log('userinfo from DB:', data)
    return {data:data,error:error}
  }
  
  else {
    return 'nothing'
  }

})