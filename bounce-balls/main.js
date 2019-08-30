// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}
//
function shape(x,y,velx,vely,exits){
  this.x=x;
  this.y=y;
  this.velx=velx;
  this.vely=vely;
  this.exits=exits;
}
//小球
function ball(x,y,velx,vely,color,size,exits){
  shape.call(this,x,y,velx,vely,exits)
  this.color=color;
  this.size=size;
}

ball.prototype.draw=function(){
  if(this.exits===1){
    ctx.beginPath();
    ctx.fillStyle=this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
  }
}
// let newBall =new ball(50,100,4,4,'blue',100);
// console.log(newBall.x);
// newBall.draw();
ball.prototype.upData=function(){
  if((this.x+this.size)>=width){
    this.velx=-(this.velx);
  }
  if((this.x-this.size)<=0){
    this.velx=-(this.velx)
  }
  if((this.y+this.size)>=height){
    this.vely=-(this.vely);
  }
  if((this.y-this.size)<=0){
    this.vely=-(this.vely);
  }
  this.x+=this.velx;
  this.y+=this.vely;
}
let balls=[];
let count=0;
ball.prototype.collisionDetect=function(){//碰撞检测
  for(let j=0;j<balls.length;j++){
    if(this!==balls[j]){
      let dx=this.x-balls[j].x;
      let dy=this.y-balls[j].y;
      distance=Math.sqrt(dx*dx+dy*dy);
      if(distance<this.size+balls[j].size){
        balls[j].color=randomColor();
        this.color=randomColor();
      }
    }
    
  }
}

function loop(){
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  while(balls.length<25){
    let newBall =new ball(random(0,width),random(0,height),random(-7,7),random(-7,7),randomColor(),random(10,20),1);
    balls.push(newBall);
  }
  for(let i=0;i<balls.length;i++){
    let h1=document.querySelector('h1');

    balls[i].draw();
    balls[i].upData();
    balls[i].collisionDetect();
    h1.textContent=(25-count).toString();
  }
  evilCircle.draw();
  evilCircle.setControls();
  evilCircle.collisionDetect();
  evilCircle.checkBounds();
  requestAnimationFrame(loop);
}

//恶魔圈
function EvilCircle(x,y,velx,vely,exits){
  shape.call(this,x,y,velx,vely,exits);
  this.color='red';
  this.size=10;
}
EvilCircle.prototype.draw=function(){
  ctx.beginPath();
  ctx.lineWidth=4;
  ctx.strokeStyle='red';
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.stroke();
}
EvilCircle.prototype.checkBounds=function(){
  if((this.x+this.size)>=width){
    this.x+=(-this.x);
  }
  if((this.x-this.size)<=0){
    this.x+=(-this.x);
  }
  if((this.y+this.size)>=height){
    this.y-=(this.y);
  }
  if((this.y-this.size)<=0){
    this.y-=(this.y);
  }
}
EvilCircle.prototype.setControls=function(){
  window.onkeydown=e=>{
    if(e.key==='a'){
      this.x-=this.velx;
    }else if(e.key==='d'){
      this.x+=this.velx;
    }else if(e.key==='w'){
      this.y-=this.vely;
    }else if(e.key==='s'){
      this.y+=this.vely;
    } 
  };
}
EvilCircle.prototype.collisionDetect=function(){
  for(let m=0;m<balls.length;m++){
    if(balls[m].exits!==0){
      let dx=this.x-balls[m].x;
      let dy=this.y-balls[m].y;
      let distance=Math.sqrt(dx*dx+dy*dy);
      if(distance<=this.size+balls[m].size){
        balls[m].exits=0;
        count++;
      }
    }
    
  }
}
let evilCircle=new EvilCircle(50,100,20,20,1);
console.log(evilCircle);


loop();