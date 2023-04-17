var PLAY =1;
var END =0;
var gameState=PLAY;
var trex, trex_running, edges, trex_collided;
var groundImage;
var ground;
var invisibleGround;
var cloud;
var cloud, cloudImg;
var obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var obstaclesGroup, cloudsGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var checkpointSound, dieSound, jumpSound;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
cloudImg = loadImage("cloud.png");
obstacle1=loadImage("obstacle1.png");
obstacle2=loadImage("obstacle2.png");
obstacle3=loadImage("obstacle3.png");
obstacle4=loadImage("obstacle4.png");
obstacle5=loadImage("obstacle5.png");
obstacle6=loadImage("obstacle6.png");
gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");
checkpointSound = loadSound("checkpoint.mp3");
dieSound = loadSound("die.mp3");
jumpSound = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
 //criando o trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
 trex.addAnimation("collided",trex_collided);
ground = createSprite (width/2, height, width, 20);
ground.addImage(groundImage)
//adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;

  invisibleGround = createSprite(width/2, height+60, width, 150);
  invisibleGround.visible=false;
gameOver = createSprite(300, 100);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.7;

restart = createSprite(300, 140);
restart.addImage(restartImg);
restart.scale = 0.7;
score = 0;

obstaclesGroup = new Group();
cloudsGroup = new Group();
//trex.debug = true
trex.setCollider("rectangle",0,0,40,40);
}

function draw(){
  //definir a cor do plano de fundo 
  background("white");
  
  if (gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    text("score: "+score, 500, 50);
    score = score+Math.round(getFrameRate()/60);
    ground.velocityX = -(2+3*score/100);
    //registrando a posição y do trex
      console.log(trex.y)
      
      //pular quando tecla de espaço for pressionada
      if(touches.length>0 || keyDown("space") && trex.y>=500){
        trex.velocityY = -10;
      jumpSound.play();
      touches = []
      }
      if(ground.x<0){
        ground.x = ground.width/2
      }
      trex.velocityY = trex.velocityY + 0.8;
      spawnClouds();
      spawnObstacles()
      if(score>0 && score %100===0){
        checkpointSound.play();
      }
      if(obstaclesGroup.isTouching(trex)){
gameState = END;
     dieSound.play()


    }
  }else if (gameState === END){
ground.velocityX= 0;
obstaclesGroup.setVelocityXEach(0);
cloudsGroup.setVelocityXEach(0);
gameOver.visible = true;
restart.visible = true;
 trex.velocityY = 0;
trex.changeAnimation("collided", trex_collided);
obstaclesGroup.setLifetimeEach(-1);
cloudsGroup.setLifetimeEach(-1);
if(mousePressedOver(restart)){
  //console.log("reiniciar o jogo")
   reset()
  }
}
 //impedir que o trex caia
  trex.collide(invisibleGround)
 
  drawSprites();
}
function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
trex.changeAnimation("running",trex_running);
score = 0;
gameOver.visible = false; restart.visible = false;
}
function spawnClouds(){
  if (frameCount%60===0){

    cloud = createSprite(windowWidth, 100, 40, 10);
cloud .scale = 0.8
cloud.velocityX = -3
cloud.addImage(cloudImg)
cloud.y= Math.round(random(100, 220))
 cloud.depth = trex.depth;
trex.depth = trex.depth +1;
cloud.lifetime = 1000;
cloudsGroup.add(cloud);
}
}
function spawnObstacles(){
  if (frameCount%60===0){  
obstacle = createSprite(windowWidth, windowHeight-20, 10, 40);
obstacle.velocityX= -(6+score/100);
var rand = Math.round(random(1,6));
switch(rand){
  case 1:obstacle.addImage(obstacle1);
  break;
  case 2:obstacle.addImage(obstacle2);
  break;
  case 3:obstacle.addImage(obstacle3);
  break;
  case 4:obstacle.addImage(obstacle4);
  break;
  case 5:obstacle.addImage(obstacle5);
  break;
  case 6:obstacle.addImage(obstacle6);
  break;
default:break;
}

obstacle.scale = 0.7;
obstacle.lifetime = 1000;
obstaclesGroup.add(obstacle);

  }
}
