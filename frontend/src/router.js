import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

export const routes = [ // all routes
  {
    guestOnly: false,
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    guestOnly: true,
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    guestOnly: true,
    path: '/register',
    name: 'Register',
    component: Register
  }
];

export default new Router({
  routes
});