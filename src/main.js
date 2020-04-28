import Vue from "vue";
import Vuelidate from "vuelidate/src";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Paginate from "vuejs-paginate";
import tooltipDirective from "@/directives/tooltip.directive";
import Loader from "@/components/app/Loader";
import VueMeta from "vue-meta";
// FILTERS //////////////////////////////////////////////
import dateFilter from "./filters/date.filter";
import currencyFilter from "./filters/currency.filter";
/////////////////////////////////////////////////////////

import messagePlugin from "@/utils/message.plugin";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(VueMeta);
Vue.component("paginate", Paginate);
Vue.component(Loader);
Vue.directive("tooltip", tooltipDirective);
// eslint-disable-next-line no-unused-vars
const firebaseConfig = {
  apiKey: "AIzaSyD5PJeEODtjFy6_4gLslUZMEMwdrZeDIVE",
  authDomain: "vue-crm-2a5e3.firebaseapp.com",
  databaseURL: "https://vue-crm-2a5e3.firebaseio.com",
  projectId: "vue-crm-2a5e3",
  storageBucket: "vue-crm-2a5e3.appspot.com",
  messagingSenderId: "527950977766",
  appId: "1:527950977766:web:484e3c249a5629cc43b927",
  measurementId: "G-NTBX98PKEV"
};

firebase.initializeApp(firebaseConfig);

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
