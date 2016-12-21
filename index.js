"use strict";
const sense = require("sense-hat-led").sync;

sense.clear(255, 255, 255);
sense.lowLight = true;
sense.setPixel(0,7,[244,0,0]);
var color = sense.getPixel(0,7);
