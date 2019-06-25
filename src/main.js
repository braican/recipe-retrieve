import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueFire from 'vuefire';
import store from './store';
import { auth } from '@/firebase';

Vue.config.productionTip = false;

auth.onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});
