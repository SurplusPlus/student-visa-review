<template>
  <div :id="'audioBlob-' + id" :class="[ 'audioBlob', viewmode, thisdata.type, { 'playing': areWePlaying } ]" :style="positionStyle">  
      <svg :width="viewboxdim" :height="viewboxdim" :viewBox="'0 0 ' + viewboxdim + ' ' + viewboxdim">
        <g>
          <path @click="onclick" class="blobpath" :d="points" :style="'fill: url(#texture-' + id + ')' "></path>

          <template v-if="viewmode !== 'indexview'">
            <foreignObject :class="thisdata.type" x="0%" y="0%" width="100%" height="100%" dominant-baseline="middle" text-anchor="middle">
              <div class='divtextwrapper'>
                <div @click="onclick" class='divtext'>{{ thisdata['Name'] }}</div>
              </div>
            </foreignObject>    
        </template>

        </g>
          <defs>
            <pattern :id="'texture-'+id" width="1" height="1" :viewBox="'0 0 ' + viewboxdim + ' ' + viewboxdim" preserveAspectRatio="none">
              <image :xlink:href="SVGTexture" :width="viewboxdim" :height="viewboxdim" preserveAspectRatio="none"></image>
            </pattern>
          </defs>
      </svg>
  </div>
</template>

<script>
/*  eslint-disable */ 
import { gsap } from "gsap";
import "@fontsource/space-mono/700.css"

export default {
  name: "AudioBlob",
  props: ['id', 'viewmode'],
  data() {
    return {
      blob: null,
      numPoints: 12,
      minDuration: 4,
      maxDuration: 8,
      rawpoints: [],
      tl: null,
      dimpadding: 20,
    };
  },
  methods: {
    onclick: function() {
      if(this.playingPathId === this.id) {
        // we're already playing this blob! we should pause/play
        if(this.status === "playing") {
           this.$store.commit("setStatus", "paused");
        } else {
          return this.$store.commit("setStatus", "playing");
        }
      } else {
//        this.$store.commit("setNextPlayingPathId", this.id);
        this.$store.commit("setNextPlayingPathId", this.id);
        console.log('setNextPlayingPathId', this.id);
      }
    }
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    thisdata() {
      var self = this;
      try {
        return this.audiopathData[this.id]
      } catch {
        return null;
      }
    },
    points() {
      try {
        return cardinal(this.rawpoints, true, 1.1);
      } catch {
        return []
      }
    },
    centerX() {
      return this.radii.max + this.dimpadding ;
    },
    centerY() {
      if(this.thisdata.type === "interview") {
        return this.radii.max + (this.dimpadding / 4);
      } else {
        return this.radii.max + this.dimpadding;
      }
    },
    radii() {
      try {
        if(this.thisdata.type === "start") {
          return { min: 120, max: 150 }
        } else if(this.thisdata.type === "intro") {
          return { min: 100, max: 120 }
        } else {
          return { min: 60, max: 90 }
        }
      } catch {
        return null;
      }
    },
    positionStyle() {
      if(this.viewmode !== "indexview") {
        return { 'transform': 'translate(' + -this.centerX + "px, "+ -this.centerY + "px)"}
      } else {
        return { };
      }
    },
    viewboxdim() {
      return (this.radii.max + this.dimpadding) * 2;
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    areWePlaying() {
      return this.playingPathId === this.id;
    },
    SVGTexture() {
      if(this.thisdata.SVGTexture !== undefined && this.thisdata.SVGTexture !== "") {
        return require('@/assets/map/maptextures/' + this.thisdata.SVGTexture)
      } else {
        return require('@/assets/map/maptextures/broken_image.gif')
      }
    },
    status() {
      return this.$store.state.status;
    },
  },
  mounted() {
    this.blob = createBlob({
      this: this,
      animated: this.viewmode === "mapview",
    });
  },
  watch: {
    areWePlaying (newv, oldv) {
      console.log(newv, oldv);
      if(newv) {
        this.tl.timeScale(3);
      } else {
        this.tl.timeScale(1);
      }
    }
  },
};

/** BELOW FROM https://codepen.io/osublake/pen/vdzjyg */ 
var createBlob = function(options) {
  var self = options.this;
   
  var points = [];  
  
  var slice = (Math.PI * 2) / self.numPoints;
  var startAngle = random(Math.PI * 2);
  
  var tl = gsap.timeline({
  });   

  for (let i = 0; i < self.numPoints; i++) {
    
    let angle = startAngle + i * slice;
    let radius = random(self.radii.min, self.radii.max);
    var duration = random(self.minDuration, self.maxDuration);
    
    
    let point = {
      x: self.centerX + Math.cos(angle) * radius,
      y: self.centerY + Math.sin(angle) * radius,
    };  

    if(options.animated) {

      tl.to(point, {
        x: self.centerX + Math.cos(angle) * self.radii.max,
        y: self.centerY + Math.sin(angle) * self.radii.max,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: duration,
      }, random(duration)); 
    }
   
    points.push(point);
  }
  
  self.rawpoints = points;
  self.tl = tl;

  
}



// Cardinal spline - a uniform Catmull-Rom spline with a tension option
function cardinal(data, closed, tension) {
  
  if (data.length < 1) return "M0 0";
  if (tension == null) tension = 1;
  
  var size = data.length - (closed ? 0 : 1);
  var path = "M" + data[0].x + " " + data[0].y + " C";
  
  for (var i = 0; i < size; i++) {
    
    var p0, p1, p2, p3;
    
    if (closed) {
      p0 = data[(i - 1 + size) % size];
      p1 = data[i];
      p2 = data[(i + 1) % size];
      p3 = data[(i + 2) % size];
      
    } else {
      p0 = i == 0 ? data[0] : data[i - 1];
      p1 = data[i];
      p2 = data[i + 1];
      p3 = i == size - 1 ? p2 : data[i + 2];
    }
        
    var x1 = p1.x + (p2.x - p0.x) / 6 * tension;
    var y1 = p1.y + (p2.y - p0.y) / 6 * tension;

    var x2 = p2.x - (p3.x - p1.x) / 6 * tension;
    var y2 = p2.y - (p3.y - p1.y) / 6 * tension;
    
    path += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
  }
  
  return closed ? path + "z" : path;
}


function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}







</script>

<style scoped>

.audioBlob.mapview {
  position: absolute;
}

.blobpath {
  stroke: #212121;
  stroke-width: .25px;
}

.blobpath:hover {
  stroke: rgba(110, 167, 252, 1);
  stroke-width: 2px;
  cursor: pointer;
}


.playing .blobpath {
  stroke: rgba(110, 167, 252, 1);
  stroke-width: 2px;
  box-shadow: 0px 0px 50px rgb(10, 116, 255);
}

text, .divtext {
  user-select: none;
}

foreignObject, foreignObject > * {
  pointer-events: none;
}

.divtextwrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.interview .divtextwrapper {
  flex-direction: column;
  justify-content: end;
}

.divtext { 
  font-size: 0.8em;
  text-align: center;
  color: #212121; 
  line-height: 150%;
  /* text-transform: uppercase; */
}

.intro .divtext {
  margin: 1em; 
  display: inline-block;
  padding: 20px;
  background: rgb(245, 245, 245, 1);
  border-radius: 10px;
  mix-blend-mode: hard-light;
  /* height: 150px; */
  /* background: linear-gradient(180deg,  rgba(235,227,220,.6) 0%, rgba(191,212,244,.95) 100%); */
  box-shadow: 0px 0px 20px rgba(110, 167, 252, .2), 0px 0px .5px #212121;
}

.interview .divtext {
  position: absolute;
  bottom: 0px;
}

.intro .divtext {
  color: blue;
}

svg {
  font-family: 'Space Mono', serif;
  height: auto;
}

.indexview svg {
  width: 100%;
  height: 100%;
}

</style>
