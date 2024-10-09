import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/schema'     // npx supabase gen types typescript --linked > ./types/schema.ts로 갱신

export default defineEventHandler(async (event) => {
  const newsApi = getRouterParam(event, 'newsapi')

  const supabase_svr_client = await serverSupabaseClient<Database>(event);
  const read_Body_data = await readBody(event)


  if(newsApi === 'getnewslist'){
    const newsCount = read_Body_data?.p_get_count
    newsCount !== null
    ? console.log('조회할 오시라세 개수:', newsCount) 
    : console.log('오시라세 전체 조회')

    const {data,error} = await supabase_svr_client.rpc('func_news_get',{
      p_get_count: newsCount
    })
    if(error) {
      console.log('오시라세 조회 에러:',error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    console.log(data)
    return data
  }

  else {

  }
  
})