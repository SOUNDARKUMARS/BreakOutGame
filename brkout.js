const cvs=document.getElementById("breakout")
const ctx=cvs.getContext("2d")
const BgImg=new Image()
BgImg.src="img/bg.jpg"
let rightArrow=false
let leftArrow=false
const Ball_rad=8
let life=3
let Score=0
let scoreUnit=10
let level=1
cvs.style.border="3px solid #a21313"
ctx.lineWidth=3
let Game_over=false
// create paddle st
// paddle variables
const marignBottom=50
const paddleWidth=100
const paddleHeight=20

// gameover and you won
const end=document.getElementById("gameoverImg")
const youwin=document.getElementById("youwonImg")
const palyagain=document.getElementById("playAgain")

palyagain.addEventListener("click", function(){
    location.reload()
})
function showYouWon(){
    youwin.style.visibility="visible"
    palyagain.style.visibility="visible"
}
function showYouLose(){
    end.style.visibility="visible"
    palyagain.style.visibility="visible"
}
//images
const lvlImg=new Image()
lvlImg.src="img/level.png"
 
const lifeImg=new Image()
lifeImg.src="img/life.png"
 
const scoreImg=new Image()
scoreImg.src="img/score.png"

// audios 
const wallHit=new Audio()
wallHit.src="audio/wall.mp3"
 
const lifelost=new Audio()
lifelost.src="audio/life_lost.mp3"
 
const paddleHit=new Audio()
paddleHit.src="audio/paddle_hit.mp3"
 
const win=new Audio()
win.src="audio/win.mp3"
 
const brickHit=new Audio()
brickHit.src="audio/brick_hit.mp3"


const paddle={
    x:cvs.width/2-paddleWidth/2,
    y:cvs.height-marignBottom,
    height:paddleHeight,
    widht:paddleWidth,
    dx:5
}

//function create ball end
//  create ball end
function DrawPaddle(){

    ctx.fillStyle='#2c2d2a'
    ctx.fillRect(paddle.x,paddle.y,paddle.widht,paddle.height)

    ctx.strokeStyle='#f6f706'
    ctx.strokeRect(paddle.x,paddle.y,paddle.widht,paddle.height)
}

// paddle movement st
document.addEventListener("keydown",function(event){
    if(event.key=="ArrowLeft"){
        leftArrow=true
    }else if(event.key=="ArrowRight"){
        rightArrow=true
    }
})
document.addEventListener("keyup",function(event){
    if(event.key=="ArrowLeft"){
        leftArrow=false
    }else if(event.key=="ArrowRight"){
        rightArrow=false
    }
})

// mobile devices' button navigation right and left
let rightBtn = document.getElementById("right");
let leftBtn = document.getElementById("left");
let animationFrameId;

function moveRight() {
    if(paddle.x+paddle.widht<cvs.width){
    paddle.x += paddle.dx
    animationFrameId = requestAnimationFrame(moveRight)}
}
function moveLeft() {
if(paddle.x>0){
    paddle.x -= paddle.dx
    animationFrameId = requestAnimationFrame(moveLeft)}
}
function stopMove() {
    cancelAnimationFrame(animationFrameId)
}

rightBtn.addEventListener('touchstart', function() {
    moveRight()
})
rightBtn.addEventListener('touchend', stopMove)

leftBtn.addEventListener('touchstart', function() {
    moveLeft()
})

leftBtn.addEventListener('touchend', stopMove)


// paddle moveMent end
function movePaddle(){
    if(rightArrow&&paddle.x+paddle.widht<cvs.width){
        paddle.x += paddle.dx
    }else if(leftArrow&&paddle.x>0){
        paddle.x -= paddle.dx
    }
}

// create paddle end
// create ball st
const ball={
    x:cvs.width/2,
    y:paddle.y-Ball_rad,
    radius:Ball_rad,
    speed:4,
    dx:3*(Math.random()*2-1),
    dy:-3
}
// fucntion create ball st
function drawball(){
    ctx.beginPath()
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2)
    ctx.fillStyle="#1cbccd"
    ctx.fill()
    ctx.strokeStyle="black"
    ctx.stroke()
    ctx.closePath()
}
// move tha ball
function moveBall(){
    ball.x+=ball.dx
    ball.y+=ball.dy
}
// ball wall collision
function ballWallCollission(){
    if(ball.x+ball.radius>cvs.width || ball.x-10+Ball_rad<0){
        wallHit.play()
        ball.dx=-ball.dx
    }else if((ball.y)-Ball_rad<0){
        ball.dy=-ball.dy
        wallHit.play()
    }else if(ball.y+Ball_rad>cvs.height){
        lifelost.play()
        resetBall()
        ball.speed
        life--
    }

}
function resetBall(){

    console.log(`now life is ${life}`)
    ball.x=cvs.width/2
    ball.y=paddle.y-Ball_rad
    ball.dx=3*(Math.random()*2-1)
    ball.dy=-3 
}
DrawPaddle()

// ball nd paddle collision
function ballPaddleCollision(){
    if(ball.x>paddle.x && ball.x<paddle.x+paddle.widht&&ball.y+6>paddle.y&&paddle.y<paddle.y+paddle.height){
        paddleHit.play()
        let collidePoint=ball.x-(paddle.x+paddleWidth/2)
        collidePoint=collidePoint/(paddleWidth/2) 
        let angle=collidePoint*Math.PI/3

        ball.dx=ball.speed*Math.sin(angle)
        ball.dy=-ball.speed*Math.cos(angle)
    }
}

// bricks area 
//  creating bricks
const brick = {
    row : 1,
    column : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#b80512",
    strokeColor : "#ffffff"
}
let bricks=[]
function createBricks(){
    ctx.lineWidth=2
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
                
            }
        }
    }
}
createBricks()

function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}
 function ballBrickCollission(){
    
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.column; c++){
            let b=bricks[r][c]
            if(b.status){
            if(ball.x+Ball_rad>b.x && ball.x - ball.radius < b.x+brick.width&& ball.y+Ball_rad > b.y && ball.y-ball.radius < b.y+brick.height){
                brickHit.play()
                console.log("ball and brick collided")
                ball.dy=-ball.dy
                b.status=false
                Score+=scoreUnit

            }
        }
        }
    }
 }


 
function GameStatus(text,textX,textY,img,imgX,imgY){
    ctx.fillStyle = "black"
    ctx.font= "25px Arial"
    ctx.fillText(text,textX,textY)
    ctx.drawImage(img,imgX,imgY,width=25,height=25)
}

function gameover(){
    if(life==0){
        Game_over=true
        showYouLose()
    }
   
}

function levelUp(){
    let levelDone=true
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.column; c++){
            levelDone=levelDone&&!bricks[r][c].status
         }
    }
    if(levelDone){
       win.play()

        if(level==5){
            showYouWon()
            Game_over=true
            return
        }

        brick.row++
        createBricks()
        resetBall()
        level++
        ball.speed+=0.5
    }
}

function draw(){
    DrawPaddle()
    drawball()
    drawBricks()
    GameStatus(Score,35,25,scoreImg,5,5)
    GameStatus(life,cvs.width-25,25,lifeImg,cvs.width-55,5)
    GameStatus(level,cvs.width/2,25,lvlImg,cvs.width/2-30,5)
    }
function update(){
movePaddle()
moveBall()
ballWallCollission()
ballPaddleCollision()
ballBrickCollission()
gameover()
levelUp()
}


function loop(){
    ctx.drawImage(BgImg,0,0)
    draw()
    update()
    if(!Game_over){
        requestAnimationFrame(loop) 
    }
  
}
loop()


