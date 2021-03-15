// 功能1: 鼠标移上.banner显示左右箭头,鼠标移出.banner隐藏左右箭头
var bannerSlides = document.querySelector("main .main-content .banner");
var arrow_left = document.querySelector("main .main-content .banner .arrow_left ");
var arrow_right = document.querySelector("main .main-content .banner .arrow_right");
var bannerOl = document.querySelector("main .main-content .banner ol");
var bannerImgsLis = document.querySelectorAll("main .main-content .banner .bannerImgs ul li");
var bannerImgsUl = document.querySelector("main .main-content .banner .bannerImgs ul");

console.log(arrow_right)
console.log(bannerSlides)
bannerSlides.onmouseover = function(){
    arrow_left.style.display = "block";
    arrow_right.style.display = "block";

    // 鼠标.banner层以后清除定时器
    window.clearInterval( timer );
    timer = null;
}

bannerSlides.onmouseout = function(){
    arrow_left.style.display = "none";
    arrow_right.style.display = "none";

    // 注意:传统绑定事件,同一个对象同一个事件,具有唯一性
    if( timer == null ){
        timer = setInterval( function(){
            // 手动触发事件
            arrow_right.click();
        } , 2000 );
    }
}

// 功能2: 动态生成小圆点 根据轮播图图片的个数,生成相应个数的li,放在ol里面
for(var i = 0 ; i < bannerImgsLis.length ; i++ ){
    // 创建li标签
    var newLi = document.createElement("li");

    // 设置自定义属性
    newLi.setAttribute("data-index" , i );

    // 功能3: 被点击小圆圈高亮 功能4:点击小圆圈滚动到对应图片
    newLi.onclick = function(){
        document.querySelector("main .main-content .banner ol li.current").removeAttribute("class");

        this.className = "current";

        // 获取自定义属性
        var index = this.getAttribute("data-index");
        animate( bannerImgsUl , -bannerSlides.offsetWidth*index);

        // 功能7: 修复小Bug 点击某个小圆圈,再点击右侧按钮,出现图片跟小圆圈显示不正确,原因是因为我们点击小圆圈以后,跟num,circle变量都没有关系
        // 方式一:
        num = index;
        circle = index;

        // 方式二:
        // num = circle = index;
    }

    // 第一个li需要加上.current类
    if( i == 0 ){
        newLi.className = "current";
    }
    // 追加li标签到ol中
    bannerOl.append( newLi );
}


// 为了无缝轮播,克隆ul里面的第一个li
bannerImgsUl.appendChild( bannerImgsUl.children[0].cloneNode(true) );
bannerImgsUl.style.width = bannerImgsUl.children.length*100+"%";

// 功能5: 点击右侧按钮一次，就让图片滚动一张
// 定义一个变量控制当前第几张图片正在轮播
var num = 0;
// 再定义一个变量保存当前是第几个小圆点具有current类
var circle = 0;

// 定义一个变量,控制开关  类似水龙头
var flag = true;

arrow_right.onclick = function(){
    // 判断水龙头状态
    if( flag ){
        // 关闭节流阀
        flag = false;

        // 当我们滑动到最后一张图片,也就是我们克隆出来的那个图片
        if( num == bannerImgsUl.children.length - 1 ){
            bannerImgsUl.style.left = "0px";
            num = 0;
        }

        num++;
        // 让ul做动画
        animate( bannerImgsUl , -bannerSlides.offsetWidth*num , function(){
            // 当动画执行完毕以后,我们再打开节流阀
            flag = true;
        });

        // 功能6: 点击右侧按钮,小圆圈跟随变化
        circle++;
        if( circle == bannerOl.children.length ){
            circle = 0;
        }
        document.querySelector("main .main-content .banner ol li.current").removeAttribute("class");
        bannerOl.children[ circle ].className = "current";
    }
}

// 功能8:  实现左侧按钮点击
arrow_left.onclick = function(){
    // 判断节流阀状态
    if( flag ){
        // 关闭节流阀
        flag = false;

        if( num == 0 ){
            // 设置ul左偏移量为最后一个图片
            num = bannerImgsUl.children.length-1;
            bannerImgsUl.style.left = -bannerSlides.offsetWidth*num+"px";
        }

        num--;
        // 让ul做动画
        animate( bannerImgsUl , -bannerSlides.offsetWidth*num , function(){
            // 动画执行完毕,我们打开节流阀
            flag = true;
        });

        if(circle == 0){
            circle = bannerOl.children.length;
        }
        circle--;

        document.querySelector("main .main-content .banner ol li.current").removeAttribute("class");
        bannerOl.children[ circle ].className = "current";
    }
}

// 功能9:  实现自动轮播功能
var timer = setInterval( function(){
    // 手动触发事件
    arrow_right.click();
} , 2000 );


//动画函数
function animate( domElement, target , callback ){
    clearInterval( domElement.timer );

    domElement.timer = setInterval(function(){
        if( domElement.offsetLeft == target ){
            clearInterval( domElement.timer );

            callback && callback();
            
            return;
        }

        var speed = ( target - domElement.offsetLeft ) / 10;
        speed = speed >= 0 ? Math.ceil( speed ) : Math.floor( speed );

        domElement.style.left = domElement.offsetLeft + speed + "px";
    }, 20 );
}