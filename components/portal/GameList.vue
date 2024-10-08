<script setup lang="ts">
import './GameList.scss'

import dummyGameImg from '~/assets/other/dummyGameImg.png'


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div class="gamelist">
    <div class="title_text">
     ゲーム一覧
    </div>

    <div class="listContainer">

      <div class="outBox" v-for="i in 6" :key="i">
        <v-img :src="dummyGameImg"/>
        <div class="gameTitle">
          {{ '結・MUSUBI' }}
        </div>
        <div class="gameDesc">
          {{ '新概念のデジタルお守りサービス' }}
        </div>
      </div>
    </div>

    <div class="goTotop" @click="scrollToTop">
      <u>▲このページのトップへ</u>
    </div>
    
  </div>
</template>