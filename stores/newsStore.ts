import { defineStore } from 'pinia'
import type {INews} from '~/interfaces/news.interface'

export const useNewsStore = defineStore('newsStore', () => {

  const { $apiFetch } = useNuxtApp()
  const imageStore = useImageStore()
  const newsList = ref<INews[]>([])

  // 오시라세 리스트 가져오기
  const getNewsList = async(count: number | null)=>{
    const {data:data,error} = await $apiFetch('api/news/getnewslist',{
      p_get_count: count
    })
    if(error){
      console.log(error)
      return
    }
    console.log(data)
    newsList.value = data as INews[]
    await convertlogo()
    // return data
  }

  const convertlogo= async()=>{
    for(let i =0 ; i< newsList.value.length; i++){
      newsList.value[i].news_gamelogo = await logobyType(newsList.value[i].news_gamelogo)
    }
  }


  const logobyType= async(game: string)=>{
    // supabase의 storage에서 musubi라는 버켓에서 가져올 것임
    // musubi- 버켓
    // - news 폴더
    // -- logo 폴더
    // --- game.png
    const imageUrl = await imageStore.getImageUrl(`news/logo/${game}.png`)
    // console.log(imageUrl)
    return imageUrl
  }


  return {
    newsList,
    getNewsList,
  }
})