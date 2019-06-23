import Vue from "vue";
import VueResource from "vue-resource";
import Vuex from "vuex";

Vue.use(VueResource);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    comments: []
  },
  mutations: {
    fetchComments(state, data) {
      state.comments = data;
    }
  },
  actions: {
    fetchComments() {
      Vue.http.get("https://jsonplaceholder.typicode.com/posts")
        .then(res => this.commit("fetchComments", res.body))
        .catch(e => {
          console.log(e);
        });
    }
  }
});