<script setup lang="ts">
import './GameBanners.scss'

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination,Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
const swiperModules = ref([Navigation, Pagination, Autoplay]);

const pagioptions = ref({
  clickable: true,
});

import dummyGameBanner from '~/assets/other/dummyGameBanner.png'


</script>

<template>
  <div class="gamebanners">
    <div class="swiperArea">
      <Swiper ref="eventSwiper"
        :modules="swiperModules"
        navigation
        :pagination="pagioptions"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false
        }"
      :loop="true"
      >
        <SwiperSlide v-for="(item, idx) in 4" :key="`newMini-${idx}`" class="bk-slide">
          <v-img
            :src="dummyGameBanner"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>