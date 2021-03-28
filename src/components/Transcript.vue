<template>
  <div id="transcript">
    <div class="upperborder">
      <img src="@/assets/transcript_upperborder.svg" style="width: 25vw"/>
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
import "@fontsource/space-mono/700.css"


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
  font-family: 'Space Mono', serif;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  bottom: 0px;
  left: 0px;
  width: 25vw;

}

.upperborder {
  width: 25vw;
}


.content {
  margin-top: -10px;
  padding: 20px;
  background-color: #f5f5f5;
  font-size: .9em;
}

.person {
  font-weight: 700;
}

.header {
  font-weight: 700;
  font-size: 1.3em;
  padding-bottom: 20px;
}

.title {
  font-style: italic;
  color: #5b5b5b;
}

.date {
  font-style: italic;
  color: #5b5b5b;
}

</style>

