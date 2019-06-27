<template>
  <v-app :dark="darkTheme" @userLogin="update">
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="showDrawer = !showDrawer"/>
      <v-toolbar-side-icon @click.stop="changeTheme">
        <v-icon>brightness_medium</v-icon>
      </v-toolbar-side-icon>
      <div v-if="user">Hello {{ user.name }}</div>
      <v-spacer/>

      <v-toolbar-items></v-toolbar-items>
      <!-- if logged in -->
      <div v-if="user">
        <v-toolbar-side-icon @click.stop="logout">
          <v-icon>directions_run</v-icon>
        </v-toolbar-side-icon>
      </div>
      <!-- else -->
      <div v-else>
        <v-btn flat @click="register">Register</v-btn>
        <v-btn flat @click="login">Login</v-btn>
      </div>
    </v-toolbar>

    <v-navigation-drawer app v-model="showDrawer">
      <v-toolbar>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">Pages</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list dense>
        <v-list-tile v-for="route in routes" :key="route.path" @click.stop>
          <router-link tag="v-list-tile-content" :to="route.path">{{route.name}}</router-link>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import Vue from "vue";
import router, { routes } from "./router";
import eventBus from "./eventBus";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

export default {
  components: {
    Home,
    Login,
    Register
  },
  data() {
    return {
      user: null,
      showDrawer: false,
      darkTheme: true
    };
  },
  computed: {
    routes() {
      return routes.filter(route => {
        if (this.user) {
          return route.userOnly || !route.guestOnly;
        } else {
          return !route.userOnly || route.guestOnly;
        }
      });
    }
  },
  methods: {
    login() {
      router.replace("Login");
    },
    register() {
      router.replace("Register");
    },
    logout() {
      this.$http.get("logout").then(
        res => {
          this.user = null;
        },
        err => console.log(err)
      );
    },
    update() {
      console.log("updating data");
      this.$http.get("is_auth").then(res => {
        console.log(res);
        if(res.status == 200) {
          this.user = res.body;
          this.darkTheme = this.user.darkTheme;
          console.log(this.user);
        }else {
          this.user = null;
        }
      });
    },
    changeTheme() {
      this.darkTheme = !this.darkTheme;
      if(this.user)
        this.$http.post("change_theme", { isDark: this.darkTheme });
    }
  },
  mounted() {
    this.update();
    eventBus.$on("userLogin", this.update);
  }
};
</script>



<style lang="sass">
// html, body
//   padding: 0
//   margin: 0
//   width: 100%
//   height: 100%

#app
  font-size: 18px
//   display: grid

// @media only screen and (min-width: 0px)
//   #app
//     grid-template-columns: 1fr

// @media only screen and (min-width: 720px)
//   #app
//     grid-template-columns: 1fr 1fr

// @media only screen and (min-width: 1080px)
//   #app
//     grid-template-columns: 1fr 1fr 1fr 1fr

.title
  text-align: center

.box
  border-top: 5px solid lightgrey
  border-left: 5px solid lightgrey

  border-bottom: 1px solid lightgrey
  border-right: 1px solid lightgrey
  border-radius: 1em
  margin: 1em
  padding: 0.25em

  > h2
    text-shadow: 5px 3px 2px darkgrey
    font-style: italic
</style>
