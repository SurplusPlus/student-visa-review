/* eslint-disable */

import Vue from "vue";
import VueRouter from "vue-router";

import store from '@/store'

import IndexNav from "@/views/IndexNav.vue";
import LandscapeNav from "@/views/LandscapeNav.vue";
import IndexView from "@/views/IndexView.vue";
import LandscapeView from "@/views/LandscapeView.vue";
import TestView from "@/views/TestView.vue";

Vue.use(VueRouter);

var siteName = "Student Visa Review"

const routes = [
  {
    path: "/",
    redirect: "/Landscape"
  },
  {
    path: "/index",
    name: "Index",
    components: {
      nav: IndexNav,
      view: IndexView,
    },
  },
  {
    path: "/landscape",
    name: "Landscape",
    components: {
      nav: LandscapeNav,
      view: LandscapeView,
    },
  },
  {
    path: "/test",
    name: "Test",
    components: {
      nav: LandscapeNav,
      view: TestView,
    },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});


export default router;

