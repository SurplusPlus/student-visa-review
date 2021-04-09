/* eslint-disable */

import Vue from "vue";
import VueRouter from "vue-router";

import store from '@/store'

import Overlay from "@/views/Overlay.vue";
import TestView from "@/views/TestView.vue";
import IndexView from "@/views/IndexView.vue";
import MapController from "@/views/MapController.vue";
import SplashPage from "@/views/SplashPage.vue";

Vue.use(VueRouter);

var siteName = "Student Visa Review"

const routes = [
  {
    path: "/",
    redirect: "/coming-soon"
  },
  {
    path: "/index/:slug?",
    name: "Index",
    components: {
      overlay: Overlay,
      index: IndexView,
      map: MapController,
    },
  },
  {
    path: "/landscape/:slug?",
    name: "Landscape",
    components: {
      overlay: Overlay,
      index: null,
      map: MapController,
    },
  },
  {
    path: "/testview",
    name: "TestView",
    components: {
      overlay: Overlay,
      index: null,
      map: TestView,
    },
  },
  {
    path: "/coming-soon", 
    name: "ComingSoon",
    components: {
      overlay: null,
      index: null,
      map: SplashPage,
    },
    alias: '*'
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});


export default router;

