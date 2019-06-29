import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import API from "./components/API";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

export const routes = [ // all routes
  {
    guestOnly: false,
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    guestOnly: false,
    userOnly: true,
    path: '/profile',
    name: 'Profile',
    component: Profile,
    props: true,
  },
  {
    guestOnly: false,
    path: '/api',
    name: 'API',
    component: API
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