"use strict";
const sense = require("sense-hat-led").sync;

var BRIGHTNESSSTEP = 10;
var g = [0, 180, 0]; // Green
var k = [0, 0, 0]; // Black
var y = [255, 255, 0]; // Yellow

console.log("Starting Christmas Tree!");

sense.clear(0, 0, 0);
sense.lowLight = true;

var tree = [
k, k, k, k, k, k, k, k,
k, k, k, g, k, k, k, k,
k, k, g, g, g, k, k, k,
k, k, k, g, k, k, k, k,
k, g, g, g, g, g, k, k,
k, k, k, g, k, k, k, k,
g, g, g, g, g, g, g, k,
k, k, k, g, k, k, k, k
];

var candlepos = [
  [3, 0],
  [4, 1],
  [1, 3],
  [0, 5],
  [6, 5],
  [5, 3]
];

function candle(xpos, ypos, brightness, maxbrightness, minbrightness) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.brightness = brightness;
    this.maxbrightness = maxbrightness;
    this.minbrightness = minbrightness;
    this.brightnessincrease = false;
    this.light = function () {
      sense.setPixel(this.xpos, this.ypos, y);
    };
    this.burn = function() {
      if (this.brightnessincrease) {
        this.brightness = this.brightness + BRIGHTNESSSTEP;
        if (this.brightness >= this.maxbrightness) {
          this.brightness = this.maxbrightness;
          this.brightnessincrease = false;
        }
      } else {
        this.brightness = this.brightness - BRIGHTNESSSTEP;
        if (this.brightness <= this.minbrightness) {
          this.brightness = this.minbrightness;
          this.brightnessincrease = true;
        }
      }
      // if (this.xpos == 0) {
      //   console.log(this.brightness);
      // }
      sense.setPixel(this.xpos, this.ypos, [this.brightness, this.brightness, 0]);
    };
    this.off = function () {
      sense.setPixel(this.xpos, this.ypos, k);
    };
}

var candles = [];
for (var i = 0; i < candlepos.length; i++) {
  candles.push(new candle(candlepos[i][0], candlepos[i][1], 100+Math.round(Math.random()*150), 255-Math.round(Math.random()*30), 50+Math.round(Math.random()*30)) );
}

var TREESHOWN = true;
var CANDLESSHOWN = true;
var TREEREDRAW = true;

var draw = function() {
  if (TREESHOWN && TREEREDRAW) {
    sense.setPixels(tree);
    TREEREDRAW = false;
  }
  if (!TREESHOWN) {
    CANDLESSHOWN = false;
  }
  if (CANDLESSHOWN) {
    for (let c of candles) {
      c.burn();
    }
  } else {
    for (let c of candles) {
      c.off();
      TREEREDRAW = true;
    }
  }
  // if (Math.random() < 0.1) {
  //   CANDLESSHOWN = !CANDLESSHOWN;
  // }
}

var display = setInterval(draw, 50);
