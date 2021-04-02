<template>
  <div :id="'audioBlob-' + id" :class="[ 'audioBlob', thisdata.type, { 'playing': areWePlaying } ]" :style="positionStyle">  
      <svg @click="onclick" :width="viewboxdim" :height="viewboxdim" :viewBox="'0 0 ' + viewboxdim + ' ' + viewboxdim">
        <g>
          <path class="blobpath" :d="points" :style="'fill: url(#texture-' + id + ')' "></path>
          <template v-if="thisdata.type !== 'interview'">
            <foreignObject x="0%" y="0%" width="100%" height="100%" dominant-baseline="middle" text-anchor="middle">
              <div class='divtextwrapper'>
                <div class='divtext'>{{ thisdata['Name'] }}</div>
              </div>
            </foreignObject>    
          </template>
          <template v-else>
            <text x="50%" y="95%" dominant-baseline="middle" text-anchor="middle">{{ thisdata['Name'] }}</text>    
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
  props: ['id'],
  data() {
    return {
      blob: null,
      numPoints: 6,
      minDuration: 2,
      maxDuration: 3,
      rawpoints: [],
      tl: null,
      dimpadding: 30,
    };
  },
  methods: {
    onclick: function() {
      // clicking on a blob means playing it!
      this.$store.commit("setNextPlayingPathId", this.id);
      console.log('setNextPlayingPathId', this.id);
      // this is handled by MapController
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
        let thisdata = this.audiopathData.filter(function(d) {
          return d.id === self.id;
        })[0]
        return thisdata;
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
    centerXY() {
      return this.radii.max + this.dimpadding ;
    },
    radii() {
      if(this.thisdata.type === "transit") {
        return { min: 170, max: 180 }
      } else {
        return { min: 80, max: 100 }
      }
    },
    positionStyle() {
      return { 'margin-top': -this.centerXY + "px", 'margin-left': -this.centerXY + "px"}
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
    }
  },
  mounted() {
    this.blob = createBlob({
      this: this
    });
  },
  watch: {
    areWePlaying (newv, oldv) {
      console.log(newv, oldv);
      if(newv) {
        this.minDuration= 0.5;
        this.maxDuration= 1;
        console.log(this.tl.duration())
        // TODO make this work 
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
    console.log(radius);
    var duration = random(self.minDuration, self.maxDuration);
    
    
    let point = {
      x: self.centerXY + Math.cos(angle) * radius,
      y: self.centerXY + Math.sin(angle) * radius,
    };   

    tl.to(point, duration, {
      x: self.centerXY + Math.cos(angle) * self.radii.max,
      y: self.centerXY + Math.sin(angle) * self.radii.max,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: -random(duration)
    }); 
   
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

.blobpath {
  stroke: #999;
  stroke-width: 1;
}

.playing .blobpath {
  stroke: #FFA;
  stroke-width: 5; 
}

text, .divtext {
  user-select: none;
}

.divtextwrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.divtext {
  display: inline-block;
  padding: 10px;
  background-color: white;
  font-size: 1.1em;
}
.transit .text {
  color: blue;
}

svg {
  font-family: 'Space Mono', serif;
  height: auto;
}

</style>
