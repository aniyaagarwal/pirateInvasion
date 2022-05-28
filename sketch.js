const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
var isGameOver = false;
var isLaughing = false;
var score = 0;
var world;
var engine;
var backgroundImage;
var towerImage;
var ground;
var cannon;
var cannonball;
var angle;
var boats = [];
var balls = [];
var boatAnimation = [];
var brokenBoatAnimation = [];
var splashAnimation = [];
var boatSpriteData;
var boatSpriteSheet;
var brokenSpriteData;
var brokenSpriteSheet;
var splashSpriteData;
var splashSpriteSheet;
var cannonSound;
var backgroundSound;
var laughSound;
var splashSound;

function preload() {
  backgroundImage = loadImage("assets/background.gif");
  towerImage = loadImage("assets/tower.png");

  boatSpriteData = loadJSON("assets/boat/boat.json");
  boatSpriteSheet = loadImage("assets/boat/boat.png");

  brokenSpriteData = loadJSON("assets/boat/broken_boat.json");
  brokenSpriteSheet = loadImage("assets/boat/broken_boat.png");

  splashSpriteData = loadJSON("assets/water_splash/water_splash.json");
  splashSpriteSheet = loadImage("assets/water_splash/water_splash.png");

  cannonSound = loadSound("assets/cannon_explosion.mp3");
  splashSound = loadSound("assets/cannon_water.mp3");
  laughSound = loadSound("assets/pirate_laugh.mp3");
  backgroundSound = loadSound("assets/background_music.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, 595, 2400, 10, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  angleMode(DEGREES);
  angle = 15;

  cannon = new Cannon(160, 110, 130, 100, angle);

  var boatFrames = boatSpriteData.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenFrames = brokenSpriteData.frames;
  for (var i = 0; i < brokenFrames.length; i++) {
    var pos = brokenFrames[i].position;
    var img = brokenSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var splashFrames = splashSpriteData.frames;
  for (var i = 0; i < splashFrames.length; i++) {
    var pos = splashFrames[i].position;
    var img = splashSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    splashAnimation.push(img);
  }

}

function draw() {
  background(189);
  if (!backgroundSound.isPlaying()) {
    backgroundSound.play();
    backgroundSound.setVolume(0.25);
  }
  image(backgroundImage, 0, 0, width, height);
  Engine.update(engine);

  push();
  fill("brown");
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, 2400, 10);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.display();

  showBoats();

  for (i = 0; i < balls.length; i++) {
    showBalls(balls[i], i);
    destroyBoat(i)
  }

  textSize(20);
  fill(0);
  text(`Score = ${score}`, 1050, 50)

}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    cannonball = new CannonBall(cannon.x, cannon.y);
    cannonball.trajectory = [];
    Matter.Body.setAngle(cannonball.body, cannon.angle);
    balls.push(cannonball);
  }
}

function showBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) { //destroying ball if it falls out of the screen
      ball.remove(index);
      splashSound.play();
    }
  }
}

function destroyBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] != undefined && boats[i] != undefined) {
      var destroy = Matter.SAT.collides(balls[index].body, boats[i].body);
      if (destroy.collided) {
        boats[i].remove(i);
        World.remove(world, balls[index].body);
        delete balls[index];
        score = score + Math.round(random(40, 80));
      }
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] === undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var position = [-40, -60, -70, -20];
      var getPos = random(position);
      var boat = new Boat(width, height - 60, 170, 170, getPos, boatAnimation);
      boats.push(boat);
    }

    for (i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        })
        boats[i].display();
        boats[i].animate();
        var destroy = Matter.SAT.collides(this.tower, boats[i].body)
        if (destroy.collided && !boats[i].isBroken) {
          isGameOver = true;
          if (!isLaughing && !laughSound.isPlaying()) {
            laughSound.play();
            isLaughing = true;
          }
          gameOver();
        }
      } else {
        boats[i]
      }
    }

  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    balls[balls.length - 1].shoot();
    cannonSound.play();
  }
}

function gameOver() {
  swal({
    title: `GAME OVER!`,
    text: `Do you want to play again?`,
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "100x100",
    confirmButtonText: "Play Again"
  }, function (isConfirm) {
    if (isConfirm) {
      location.reload();
    }
  })
}