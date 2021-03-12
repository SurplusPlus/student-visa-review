<template>
  <div id="transcript">
    <div class="upperborder">
      <img src="@/assets/transcript_upperborder.svg" />
    </div>
    <div class="content">
      <div class="header">Transcript</div>
      <div class="text">Minho Kwon with Yoonji Kang, November</div>
    </div>
  </div>
</template>

<script>
import "@fontsource/cormorant-garamond/500.css"

export default {
  name: "Transcript",
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


#transcript {
  font-family: 'Cormorant Garamond', serif;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  bottom: 0px;
  left: 0px;
}

.upperborder {
}
.content {
  margin-top: -20px;
  padding: 20px;
  background-color: #E5E1E0;
}

</style>

