<template>
  <div id="indexnav">
    <router-link class="returnbutton" :to="{ name: 'Landscape' }">
      <div class="buttontext">Return</div>
      <img src="@/assets/return.svg"/>
    </router-link>
  </div>
</template>

<script>

import "@fontsource/space-mono/400.css"

export default {
  name: "Nav",
  data() {
    return {};
  },
  components: {
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">


#indexnav {
  pointer-events: none;
  font-family: 'Space Mono', serif;
  position: fixed;
  z-index: 1000;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#indexnav > * {
  pointer-events: all;
}

.returnbutton {
  display: inline-block;
  position: relative;
  text-align: center;
}

.buttontext {
  position: absolute;
  top: 30px;
  left: 30px;
  color: black;
  font-size: 1.5em;
}


</style>

