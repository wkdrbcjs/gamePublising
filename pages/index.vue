<script setup lang="ts">
import './index.scss'

import NewsBox from '~/components/portal/NewsBox.vue'
import LoginBox from '~/components/portal/LoginBox.vue'
import GameList from '~/components/portal/GameList.vue'
import GameBanner from '~/components/portal/GameBanners.vue'

import sideBanner from '~/assets/other/sideBanner.png'

onMounted(()=>{
})

</script>

<template>
<div class="portal">
  <v-row class="rows">
    <v-col cols="1" class="sideEvent">
      <v-img :src="sideBanner"/>
    </v-col>

    <v-col class="portalMain">
      <div class="gameBanner_main"><GameBanner /></div>
      <div class="loginBox_main"><LoginBox /></div>
      <div class="newsBox_main"><NewsBox /></div>
      <div class="gameList_main"><GameList /></div>
    </v-col>

    <v-col cols="1" class="sideEvent">
      <v-img :src="sideBanner"/>
    </v-col>
  </v-row>
</div>
</template>
