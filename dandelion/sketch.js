//Inspired by Meng Na's sketch
let video;
const mymodelURL = "https://teachablemachine.withgoogle.com/models/jzYKwzSL1/model.json";
let count = 0;

let outerpetals = [];
let midpetals = [];
let innerpetals = [];
let flag = false;
let flag2 = false;
let flag3 = false;
let textFlag = false;

function preload() {
  seed = loadImage("seed.svg");
  stem = loadImage("stem.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  mymodel = ml5.imageClassifier(mymodelURL, modelReady);
  video = createCapture(VIDEO);
  mymodel.classify(video, gotResults);
  // resultP = createP("loading");


  for (i = 0; i < 12; i++) {
    innerpetals.push(new innerpetal(width / 2 + 25, height / 2 + 8, random(40, 43), PI / 6 * i, i));

    midpetals.push(new innerpetal(width / 2 + 25, height / 2 + 8, random(50, 53), PI / 6 * i, i));

    outerpetals.push(new innerpetal(width / 2 + 25, height / 2 + 8, random(60, 63), PI / 6 * i, i));
  }
}

function draw() {
  background(255);

  image(stem, width/2, height/2, 50, 300);
  
  
  for (i = 0; i < 12; i++) {
    if (flag) {
      outerpetals[i].move();
    }
    if(flag2){midpetals[i].move();}
    if(flag3){innerpetals[i].move();}
    innerpetals[i].show();
    midpetals[i].show();
    outerpetals[i].show();
  }

  if (textFlag == true) {
    textFont('Helvetica');
    textSize(26);
    text("B L O W    T H E    D A N D E L I O N !", width/2-180, 110);
  }
}

function innerpetal(x, y, size, deg, index) {
  this.x = x;
  this.y = y;
  this.deg = deg;
  this.size = size;
  this.index = index;
  this.xspeed = random(2, 5);
  this.yspeed = random(1, 2);

  this.show = function() {
    push();
    translate(this.x, this.y);
    rotate(this.deg);
    //move of innerpetal ?
    rotate(sin(frameCount / (40 + noise(index) * 50) + noise(index)) / 16);
    image(seed, 0, 0, this.size * 3 * 0.35, this.size * 4 * 0.35);
    pop();
  }

  this.move = function() {
    this.x += this.xspeed;
    this.y -= this.yspeed;
  }
}

function mouseClicked() {
  flag = true;
}

function modelReady() {
  textFlag = true;
}

function gotResults(err, results) {
  if (err) console.log(err);
  if (results) {
    // console.log(results);
    // resultP.html("result is" + " " + results[0].label);
    if (results[0].label == "blow") {
      count++;
    }
    if (count == 6) {
      flag = true;
    }
    if(count == 50){
      flag2 = true;
    }
    if(count == 100){
      flag3 = true;
    }
  }
  mymodel.classify(video, gotResults);
}