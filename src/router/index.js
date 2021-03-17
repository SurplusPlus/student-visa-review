/* eslint-disable */

import Vue from "vue";
import VueRouter from "vue-router";

import store from '@/store'

import Overlay from "@/views/Overlay.vue";
import IndexView from "@/views/IndexView.vue";
import MapController from "@/views/MapController.vue";
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
      overlay: Overlay,
      underlay: IndexView,
    },
  },
  {
    path: "/landscape",
    name: "Landscape",
    components: {
      overlay: Overlay,
      underlay: MapController,
    },
  },
  {
    path: "/test",
    name: "Test",
    components: {
      overlay: Overlay,
      underlay: TestView,
    },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});


export default router;

