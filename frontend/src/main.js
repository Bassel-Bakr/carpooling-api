import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(Vuetify, {
  iconfont: 'md'
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");