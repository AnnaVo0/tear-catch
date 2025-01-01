//Move the catcher with the left and right arrow keys to catch the falling objects. 

/* VARIABLES */
let catcher, fallingObject, fallingObjectGolden;
let score = 0, lives = 3;
let playButton, directionsButton, backButton;
let screen = 0;
// let catcherSpeed = 0;
// let currentTime, durationOfBuff = 3000, buffBegins;

// Font assets
let font;

// Image assets
let homeScreenImg, backgroundImg, catcherImgL, catcherImgR, fallingObjectImg, fallingObjectGoldenImg;

// Sound assets
let tearSfx;

/* PRELOAD LOADS FILES */
function preload(){
  // Font
  font = loadFont("assets/font1/BalsamiqSans-Regular.ttf");
  // Home screen img
  homeScreenImg = loadImage("assets/homeScreen.png");
  // Background img
  backgroundImg = loadImage("assets/bg.png");
  // Catcher img
  catcherImgL = loadImage("assets/catcherL.png");
  catcherImgR = loadImage("assets/catcherR.png");
  // fallingObject img
  fallingObjectImg = loadImage("assets/tear.png")
  fallingObjectGoldenImg = loadImage("assets/tear_golden.png");
  // Tear sound effect
  tearSfx = loadSound("assets/tearSfx.wav");
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(450,450);
  textFont(font);

  homeScreen();
}

/* DRAW LOOP REPEATS */
function draw() {
  // Directions screen
  if (screen == 0) {
    if (directionsButton.mouse.presses()) {
      screen = 1;
      directionsScreen();
    } else if (playButton.mouse.presses()) {
      screen = 2;
      playScreenAssets();
    }
  }

  // Back button from directions screen
  if (screen == 1) {
    if (backButton.mouse.presses()) {
      screen = 0;
      backButton.pos = {x: 600, y: 600};
      homeScreen();
    }
  }

  // Game screen
  if (screen == 2) {
    background(backgroundImg);
    
    // If fallingObject reaches bottom, move back to random position at top
    if (fallingObject.y >= height) {
      fallingObject.y = 0;
      fallingObject.x = random(width);
      fallingObject.vel.y = random(4, 6);
      // Loses one life point if fallingObject reaches bottom (score cannot go beneath 0)
      if (lives > 0) {
        lives = lives - 1;
      }
    }
  
    // if fallingObjectGolden reaches bottom, move back to random position at top
    if (fallingObjectGolden.y >= height) {
      fallingObjectGolden.y = 0;
      fallingObjectGolden.x = random(width);
      fallingObjectGolden.vel.y = random(5, 7);
    }
  
    // Move catcher
    if (kb.pressing("left")) {
      catcher.img = catcherImgL;
      catcher.vel.x = -5;
    } else if (kb.pressing("right")) {
      catcher.img = catcherImgR;
      catcher.vel.x = 5;
    } else {
      catcher.vel.x = 0;
    }
  
    // Stop catcher at edges of screen
    if (catcher.x < 50) {
      catcher.x = 50;
    } else if (catcher.x > 400) {
      catcher.x = 400;
    }
  
    // If fallingObject collides with catcher, move back to random position at top and add 1 to score
    if (fallingObject.collides(catcher)) {
      tearSfx.play();
      fallingObject.y = 0;
      fallingObject.x = random(width);
      fallingObject.vel.y = random(4, 6);
      fallingObject.direction = "down";
      score = score + 1;
    }
  
    // If fallingObjectGolden collides with catcher, move back to random position at top and add 2 to score
    if (fallingObjectGolden.collides(catcher)) {
        tearSfx.play();
        fallingObjectGolden.y = 0;
        fallingObjectGolden.x = random(width);
        fallingObjectGolden.vel.y = random(5, 7);
        fallingObjectGolden.direction = "down";
        score = score + 2;
        // buffBegins = millis();
        // checkBuffElapsed(buffBegins);
      }
  
    // If fallingObject collides with fallingObjectGolden, sets the directs both down
    if (fallingObject.collides(fallingObjectGolden)) {
      fallingObject.direction = "down";
      fallingObjectGolden.direction = "down";
    }
    
    // Win state
    youWin();
  
    // Lose state
    youLose();
    
    // Score display
    textSize(20);
    fill("darkblue");
    text("Tears Caught: " + score, 8, 25);
  
    // Lives display
    text("Lives left: " + lives, 8, 50);
  }
}

/* FUNCTIONS */
// Home screen
function homeScreen() {
  background(homeScreenImg);

  // Adds play button
  playButton = new Sprite(width/2 - 150, height/2 + 175, 120, 75, "k");
  playButton.textSize = 21;
  playButton.text = "Play";
  playButton.color = "#7be864";

  // Adds directions button
  directionsButton = new Sprite(width/2 - 150, height/2 + 90, 120, 75, "k");
  directionsButton.textSize = 21;
  directionsButton.text = "Directions";
  directionsButton.color = "#7be864";

}

// Directions screen
function directionsScreen() {
  playButton.pos = {x: 550, y: 550};
  directionsButton.pos = {x: 550, y: 550};
  background(backgroundImg);
  textSize(20);
  text("    Alina has a nearing project deadline!\nCatch 9 of her tears so she doesn't flood her\n desk by using the left and right arrow keys!", width/2 - 195, height/2 - 150);
  text("       Regular tears are worth one point,\n              gold tears are worth two!\nLosing a gold tear will not deduct life points.", width/2 - 195, height/2 - 50);
  backButton = new Sprite(width/2, height/2 + 125, 120, 75, "k");
  backButton.textSize = 21;
  backButton.text = "Back";
  backButton.color = "#7be864";
}

// Game screen
function playScreenAssets() {
  playButton.pos = {x: 550, y: 550};
  directionsButton.pos = {x: 550, y: 550};

  //Create catcher 
  catcher = new Sprite(catcherImgL, 200, 370);
  catcher.collider = "k"
  catcher.color = color(95,158,160);
  
  //Create falling object
  fallingObject = new Sprite(fallingObjectImg, 100,0);
  fallingObject.rotationLock = true;
  fallingObject.vel.y = 4;

  //Create golden falling object
  fallingObjectGolden = new Sprite(fallingObjectGoldenImg, 300, 0);
  fallingObjectGolden.rotationLock = true;
  fallingObjectGolden.vel.y = 5;

}


// Win screen
function youWin() {
  if (score >= 9) {
    catcher.pos = {x: -200, y: -200};
    fallingObject.pos = {x: -100, y: -100};
    fallingObjectGolden.pos = {x: -50, y: -50};
    textSize(25);
    text("You won!", width/2 - 50, height/2);
    text("Click to restart.", width/2 - 81, height/2 + 50);
    restart();
  }
}

// Lose screen
function youLose() {
  if (lives == 0) {
    catcher.pos = {x: -200, y: -200};
    fallingObject.pos = {x: -100, y: -100};
    fallingObjectGolden.pos = {x: -50, y: -50};
    textSize(25);
    text("You lost!", width/2 - 50, height/2);
    text("Click to restart.", width/2 - 81, height/2 + 50);
    restart();
  }
}

// Restart game
function restart() {
  if (mouseIsPressed) {
    score = 0;
    lives = 3;
    catcher.pos = {x: 200, y: 380};
    fallingObject.y = 0;
    fallingObject.x = random(width);
    fallingObject.vel.y = random(4, 6);
    fallingObject.direction = "down";
  }
}

// // Checks golden tear buff duration
// function checkBuffElapsed(timeBuffBegan) {
//   currentTime = millis();
//   if (currentTime - timeBuffBegan >= durationOfBuff) {
//     catcherSpeed = catcherSpeed + 3;
//     }
//   }
// }