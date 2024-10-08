<script setup lang="ts">
import PortalHeader from '~/components/PortalHeader.vue'
import PortalFooter from '~/components/PortalFooter.vue'
</script>

<template>
  <v-app>
    <PortalHeader />
    <v-main>
      <slot />
    </v-main>
    <PortalFooter />
  </v-app>
</template>

<style>
.v-main {
  --v-layout-top: 65px !important;
}
</style>
