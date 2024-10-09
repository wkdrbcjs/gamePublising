<script setup lang="ts">
import './NewsBox.scss'
import type {INews} from '~/interfaces/news.interface'

import newsIcon from '~/assets/images/news/ico-news.png'
import eventIcon from'~/assets/images/news/ico-event.png'
import updateIcon from '~/assets/images/news/ico-update.png'
import otherIcon from '~/assets/images/news/ico-other.png'

import {convertToJapanTime} from '~/tools/utils'
import { Title } from '#build/components'

const route = useRoute()
const newsStore = useNewsStore()
const imageStore = useImageStore()

onMounted(async()=>{
  console.log('this is newsBox.vue onMounted')
  await newsStore.getNewsList(4)
  console.log('오시라세 리스트:', newsStore.newsList)
})

const iconbyType=(type: string)=>{
  switch(type){
    case 'update':
      return updateIcon
    case 'event':
      return eventIcon
    case 'news':
      return newsIcon
    default:
      return otherIcon
  }
}

const titleSlice=(title:string)=>{
  if (title.length > 25) {
    return title.slice(0, 25) + '...';
  }
  return title;
}

</script>

<template>
  <div class="newsbox">
    <div class="newsBoxHeader">
      <v-row class="rows">
        <v-col class="cols">お知らせ</v-col>
      </v-row>
    </div>

    <div class="newsBoxBody">
      <v-row class="rows" v-for="(item,index) in newsStore.newsList" :key="item.news_serial_num">

        <v-col cols="2" class="cols _fit_cont">
          <v-img :src="iconbyType(item.news_type)"/>
          <div class="newsdate">{{ convertToJapanTime(item.created_at) }}</div>
        </v-col>

        <v-col class="cols _title">
          <div class="newstitle"> {{ titleSlice(item.news_title) }}</div>
        </v-col>

        <v-col cols="2" class="cols _logo">
          <v-img class="logo_img" :src="item.news_gamelogo"/>
        </v-col>

        <v-divider :color="'#FFF'" :thickness="'2px'" />

      </v-row>

    </div>
    
    <div class="showAllText"><u>全てのお知らせを表示≫</u></div>

  </div>
</template>