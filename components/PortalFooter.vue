<script setup lang="ts">
import './PortalFooter.scss'
const router = useRouter()
</script>

<template>
  <v-footer color="#1D1F26" class="v_footer">
    <v-row justify="center" no-gutters class="row_default">
      <v-col cols="12" class="col_default">
        <div class="text_company_links">
          <div class="text_company">運営: SHINSEMA株式会社</div>
          <div class="text_company">開発: My Play Inc.</div>
        </div>

        <br><div class="text_company_links">
          <div class="text_link">
            <span @click="router.push('/rules')"><u>利用規約</u></span> / 
            <span @click="router.push('/privacypolicy')"><u>プライバシーポリシー</u></span> / 
            <span @click="router.push('/')"><u>特定商取引法に基づく表記</u></span
          ></div>
        </div>

        <br><div class="text_company_links">
          <div class="text_link">
            <span @click="router.push('/faq')"><u>お問い合わせ</u></span>
          </div>
        </div>

        <br><div class="text_company_links">
          <div class="text_copylight">Copyright © SHINSEMA k.k. / My Play Inc.</div>
        </div>
      </v-col>

    </v-row>
  </v-footer>
</template>
