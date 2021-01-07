/* eslint-disable */

import Vue from "vue";
import VueRouter from "vue-router";

import store from '@/store'

import Nav from "@/components/Nav.vue";
import Intro from "@/components/Intro.vue";
import ListView from "@/components/ListView.vue";

Vue.use(VueRouter);

var siteName = "Vue / Vuex / Router <-> Airtable"

const routes = [
  {
    path: "/",
    redirect: "/intro",
  },
  {
    path: "/intro",
    name: "Intro",
    components: {
      nav: Nav,
      view: Intro,
    }
  },
  {
    path: "/list",
    name: "ListView",
    components: {
      nav: Nav,
      view: ListView,
    },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});


export default router;

