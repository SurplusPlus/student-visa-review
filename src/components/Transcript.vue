<template>
  <div id="transcript">
    <div class="upperborder">
      <img src="@/assets/transcript_upperborder.svg" />
    </div>
    <div class="content">
      <div class="header">Transcript</div>
      <div class="transcript">
        <div class="titlebar"><span class="title">Minho Kwon with Yoonji Kang</span>, <span class="date">November</span></div>
        <p><span class="person">Minho:</span> Okay Yoonji, I’m glad to see you in person. I’m will ask you some question about our exhibition. The first question is, who and where are you?</p>
        <p><span class="person">Yoonji:</span> First of all, nice to meet you as well. My name is Yoonji Kan from South Korea, and I am a graduate architecture student in RISD. I am taking classes fully online.</p>
        <p><span class="person">Minho:</span> Oh, that’s really interesting because...</p>
      </div>
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

