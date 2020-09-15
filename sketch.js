// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

let classifier;
let video;
let currentWord;
let currentIndex = 0;
let isPlaying = false;
let flag = false;
let img;
const words = ['banana', 'watch', 'shoe', 'book', 'cellphone', 'keyboard', 'shirt', 'pants', 'cup'];
const myVoice = new p5.Speech();

function preload() {
  img = loadImage("1.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  classifier = ml5.imageClassifier('MobileNet', video);

  select('#start').mousePressed(function() {
    playNextWord();
  });

  select('#next').mousePressed(function() {
    currentIndex++;
    if (currentIndex >= words.length) {
      currentIndex = 0;
    }
    playNextWord();
  });

  myVoice.onEnd = speechEnded;
}

function draw() {
  image(video, 0, 0, width, height);
  if (flag) {
    image(img, width / 2, height / 2 - 120);
    textSize(32);
    fill(255);
    text("You found it!", width / 2 - 10, height / 2 + 100);
  }
}

function playNextWord() {
  isPlaying = true;
  flag = false;
  currentWord = words[currentIndex];
  select('#instruction').html(`Go find ${currentWord}!`);
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(gotResult);
}

function gotResult(err, results) {
  const result = results[0].label;
  const oneWordRes = result.split(',')[0];
  const top3Res = results.map(r => r.label);
  const ifFound = top3Res.find(r => r.includes(currentWord))
  if (ifFound) {
    isPlaying = false;
    flag = true;
    select('#message').html(`You found ${currentWord}!`);
    myVoice.speak(`You found ${currentWord}!`);
    image(img, 20, 20);
    tint(148, 170, 233, 126);
  } else {
    myVoice.speak(`I see ${oneWordRes}`);
    tint(239, 187, 214, 126);
  }
}

function speechEnded() {
  if (isPlaying) classifyVideo();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}