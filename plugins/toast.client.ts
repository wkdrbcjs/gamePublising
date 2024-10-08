import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css'; // デフォルトのCSSを使う

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      toast: useToast({
        position: 'bottom-right', // たとえば右上に表示する
        duration: 2000 // たとえば5秒間表示する
      })
    }
  };
});
