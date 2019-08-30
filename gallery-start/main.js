const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* 遍历图片并添加至缩略图区 */
for(var i=1;i<6;i++){
    const newImage=document.createElement("img");
    newImage.setAttribute('src','images/pic'+i+'.jpg');
    thumbBar.appendChild(newImage);
    newImage.addEventListener('click',change);
}
function change(e){
    console.log(e.target.src)
    displayedImage.setAttribute('src',e.target.src)
}


/* 编写 变亮/变暗 按钮 */
btn.addEventListener('click',function(){
    if(btn.textContent=='变暗'){
        overlay.style.backgroundColor='rgba(0,0,0,0.5)';
        btn.textContent='变亮';
    }else{
        overlay.style.backgroundColor='rgba(0,0,0,0)';
        btn.textContent='变暗';
    }
});

