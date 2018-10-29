$(function(){


    //导航栏
    $(document).ready(function() {
        $(window).scroll(function(){
            var scrollPos=$(window).scrollTop();
            //滚动大于400px时导航栏固定在窗口顶部
            if(scrollPos >=400){
                $("#nav").addClass("fixed");
                $("#navi").addClass("full");
            }else{
                $("#nav").removeClass("fixed");
                $("#navi").removeClass("full");
            }
        });
    });

    function Choices(){
        $(".Choices-banner ul").animate({marginLeft:"-1184px"},2000, function () {  
                $(".Choices-banner ul>li").eq(0).appendTo($(".Choices-banner ul"));  
                $(".Choices-banner ul").css('marginLeft','0px');  
        });
          
        $(".Choices-tel ul").css('marginLeft','-1184px');  
        $(".Choices-tel ul>li").eq(0).appendTo($(".Choices-tel ul"));  
        $(".Choices-tel ul").css({marginLeft:"0px"},2000);
    }
    var tabChange = setInterval(Choices,5000);//每隔3000毫秒（3秒）调用一次Choices函数

    $('.Choices-banner').mouseover(function(){
        clearInterval(tabChange);//鼠标悬停在Choices-banner上时,清除定时器，轮播停止
    });

    $('.Choices-banner').mouseout(function(){
        tabChange = setInterval(Choices,5000);
    });

    $('.Choicesnext').click(function () {
        Choices();
    })

})
