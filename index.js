"use strict";
const sense = require("sense-hat-led").sync;
const express = require('express')

var PORT = parseInt(process.env.PORT) || 80;
var ROTATE = parseInt(process.env.ROTATE) || 0;

var BRIGHTNESSSTEP = 10;
var g = [0, 180, 0]; // Green
var k = [0, 0, 0]; // Black
var y = [255, 255, 0]; // Yellow

sense.setRotation(ROTATE);
sense.clear(0, 0, 0);
sense.lowLight = true;

// Christmas tree graphics
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

// Candle positions
var candlepos = [
  [3, 0],
  [4, 1],
  [1, 3],
  [0, 5],
  [6, 5],
  [5, 3]
];

// Candles setup
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

// Display logic
var TREESHOWN = false;
var CANDLESSHOWN = false;
var REDRAW = true;

var draw = function() {
  if (TREESHOWN && REDRAW) {
    sense.setPixels(tree);
  }

  if (!TREESHOWN) {
    CANDLESSHOWN = false;
    if (REDRAW) {
      sense.clear(0, 0, 0);
    }
  }

  if (CANDLESSHOWN) {
    for (let c of candles) {
      c.burn();
    }
  } else {
    if (REDRAW) {
      for (let c of candles) {
        c.off();
      }
    }
  }
  REDRAW = false;
}

// Display cycle
console.log("Starting Christmas Tree!");
var display = setInterval(draw, 50);

// Web interface
var app = express()

app.get('/tree', function (req, res) {
  TREESHOWN = true;
  CANDLESSHOWN = false;
  REDRAW = true;
  res.send('OK!')
})

app.get('/christmas', function (req, res) {
  TREESHOWN = true;
  CANDLESSHOWN = true;
  REDRAW = true;
  res.send('OK!')
})

app.get('/off', function (req, res) {
  TREESHOWN = false;
  CANDLESSHOWN = false;
  REDRAW = true;
  res.send('OK!')
})

app.get('/', function (req, res) {
  res.send('Endpoints: <b>/tree</b>, <b>/christmas</b>, <b>/off</b>')
})

app.listen(PORT, function () {
  console.log('Christmas tree app listening on port '+PORT)
})
