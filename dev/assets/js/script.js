(function(){
    const $body = $("body");
    document.documentElement.style.setProperty('--vw', document.documentElement.clientWidth + 'px');
    $(window).on('resize orientationchange', function () {
      document.documentElement.style.setProperty('--vw', document.documentElement.clientWidth + 'px');
    })
    



    $("a").on("click",function(){
        document.startViewTransition(() => {
            // 遷移後のDOM構造を指定
            // ･･･
        });
    });


    $(window).on("scroll",function(){
        if($(this).scrollTop() > $(this).height()){
            $body.addClass("header-bg");
        }else{
            $body.removeClass("header-bg");
        }
        if($(".e-scrollprompter")[0]){
            if($(this).scrollTop() > 100){
                $(".e-scrollprompter").fadeOut();
            }
        }
    });



    if($(".js-menu")[0]){
        var top_memory = window.scrollY;
        $(".js-menu").on("click",function(){
            if(!$body.hasClass("is-menu-open")){
                top_memory = window.scrollY;
                $body.addClass("is-menu-open");
                setTimeout(function(){
                    if($body.hasClass("is-menu-open")){$body.css("overflow","hidden");}
                },200)
            }else{
                // console.log(top_memory);
                $body.removeClass("is-menu-open");
                $body.css("overflow","visible");
                window.scrollTo(0,top_memory);
            }
            return false;
        });
        // $('.global-menu').on('click', function(event) {
        //     if (!$(event.target).closest('.js-closest').length) {
        //         if($body.hasClass("is-menu-open")){
        //             $body.removeClass("is-menu-open");
        //         }
        //     }
        // });
    }

    if($(".top-index")[0]){
        $(".top-index").on("click",function(){
            if(!$(this).hasClass("is-open")){
                $(this).addClass("is-open");
                return false;
            }
        });
    }

    // if($(".e-card")[0]){
    //     $(".e-card").on("click",function(){
    //         return false;
    //     });
    // }



    if($(".b-faq")[0]){
        $(".b-faq").each(function(){
            let $head = $(this).find(".b-faq__head");
            let $body = $(this).find(".b-faq__body");
            $body.slideUp();
            $head.on("click",function(){
                $(this).toggleClass("open")
                $body.slideToggle();
            });
        });
    }

    if($(".l-message-fv")[0]){
        const setVw = function() {
            const vw = document.documentElement.clientWidth / 100;
            document.documentElement.style.setProperty('--vw', `${vw}px`);
        }
        window.addEventListener('DOMContentLoaded', setVw);
        window.addEventListener('resize', setVw);

        gsap.set('.l-message-fv__images',{
            scale: 0.6,
        });
        gsap.to('.l-message-fv__images', {
            scale: 1,
            scrollTrigger: {
                trigger: '.l-message-fv__pagetitle',
                start: 'bottom bottom',
                // end: 'top top',
                // markers: true, 
                once: true,
                scrub: true,
            }
        });
        gsap.to('.l-message-fv__images--inner', {
            scale: 0.6,
            scrollTrigger: {
                trigger: '.l-message-fv__end',
                start: 'top bottom',
                end: 'top top',
                // markers: true, 
                scrub: true,
            }
        });
    }

    if($(".kv-slider__swiper")[0]){
        var kv_slider = new Swiper('.kv-slider__swiper', {
            effect: 'fade',
            slidesPerView: 1,
            speed: 1000,
            loop: true,
            allowTouchMove: false,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                // clickable: true,
                // type: 'progressbar',
                renderBullet: function (index, className) {
                    let num = index + 1;
                    return (
                        '<div class="' + className + '"><div class="pagination_num">o' + num + '</div><div class="pagination_bar"></div>o3</div>'
                    )
                },
                // renderProgressbar: function(progressbarFillClass){
                //     return (
                //         '<div class="swiper-pagination-bullet"><div class="pagination_num">o1</div><div class="pagination_bar"><span class="'+progressbarFillClass+'"></span></div><div class="pagination_num">o3</div></div>'
                //     )
                // },
            },
        });
        if($(".b-loading")[0]){
            kv_slider.autoplay.stop();
        }
    }


    if($(".b-about-slider")[0]){
        const about_slider = new Swiper('.b-about-slider', {
            slidesPerView: "auto",
            spaceBetween: 30,
            slidesOffsetAfter: 30,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            pagination: {
              el: '.b-about-slider__pagination',
              type: 'fraction' ,
              formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
              },
              formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
              },    
            },
            navigation: {
              nextEl: '.b-about-slider__next',
              prevEl: '.b-about-slider__prev',
            },
        });
        about_slider.autoplay.stop();
        const b_about_slider = new inview('.b-about-slider', {
            margin: '-10% 0%',
            viewIn: function(){
                about_slider.autoplay.start();
            },
            viewOut: function(){
                about_slider.autoplay.stop();
            },
            once: false
        });
    }


    if($(".b-loading")[0]){

        const keyName = 'viewed';
        const keyValue = true;
        if (!sessionStorage.getItem(keyName)) {
            sessionStorage.setItem(keyName, keyValue);
            // console.log("初回の閲覧");
            const $b_loading = $(".b-loading");
            const $skip = $(".b-loading__skip");
            const time = 3000;
            $body.addClass("loading");
            $body.attr("data-scene",1);
            function loadingend(){
                $b_loading.fadeOut(function(){
                    $body.removeClass("loading");
                    kv_slider.autoplay.start();
                });
            }
            setTimeout(function(){
                $body.attr("data-scene",2);
                setTimeout(function(){
                    $body.removeClass("loading");
                    loadingend();
                },time);
                // setTimeout(function(){
                //     $body.attr("data-scene",3);
                //     $body.removeClass("loading");
                //     setTimeout(function(){
                //         loadingend();
                //     },time);
                // },time);
            },time);
            $skip.on("click",function(){
                loadingend();
            });
            gsap.set('.kv-slider__swiper',{
                scale: 0.6,
            });
            gsap.to('.kv-slider__swiper', {
                scale: 1,
                scrollTrigger: {
                    trigger: '.kv-slider__wrapper',
                    // end: 'bottom bottom+=10%',
                    start: 'top top',
                    end: 'bottom-=25% bottom',
                    // markers: true, 
                    once: true,
                    scrub: true,
                    onLeave: function(){
                        $body.addClass("kv-no-scroll");
                    },
                }
            });
    
        } else {
            // console.log("2回目以降の閲覧");
            $(".b-loading").hide();
            $body.addClass("kv-no-scroll");
            kv_slider.autoplay.start();
        }







    }

    if($(".b-aco")[0]){
        $(".b-aco").each(function(){
            if( !$(this).hasClass("is-open") ){
                $(this).find(".b-aco__body").hide();
            }
        });
        $(".b-aco__head").on("click",function(){
            $(this).parent(".b-aco").toggleClass("is-open");
            $(this).next(".b-aco__body").slideToggle();
        });
    }

    if($(".js-parallax")[0]){
        let target = document.getElementsByClassName("js-parallax");
        let parallaxConfig = {
          delay: 0, // スクロール止めてから動く秒数
          orientation: "up", // 動く方向
          scale: 1.1, // 動く大きさ
        };
        const parallax_instance = new simpleParallax(target, parallaxConfig);
    }


    if($(".l-about-sticky")[0]){
        const $head = $('.global-header');
        let isRunning = false;
        const checkGetBounding = function(){
          if (!isRunning) {
            isRunning = true;
            window.requestAnimationFrame(function(){
              const recta = $head[0].getBoundingClientRect();
              const rectb = [];
              const flg = [];
              $('.l-about-sticky').each(function(i){
                rectb[i] = this.getBoundingClientRect();
                if(rectb[i].top <= recta.bottom && recta.top <= rectb[i].bottom && rectb[i].left <= recta.right && recta.left <= rectb[i].right){
                  flg[i] = true;
                }else{
                  flg[i] = false;
                }
                if(flg.includes(true)){
                  $body.addClass('is-header-observe');
                }else{
                  $body.removeClass('is-header-observe');
                }
              });
              isRunning = false;
            });
          }
        }
        $(window).on("load scroll", checkGetBounding );
    }


    function arrayShuffle(array) {
        for(let i = (array.length - 1); 0 < i; i--){
          let r = Math.floor(Math.random() * (i + 1));
          let tmp = array[i];
          array[i] = array[r];
          array[r] = tmp;
        }
        return array;
    }

    if($("#grid")[0]){
        let code = "";
        arrayShuffle(galleryAry).forEach(function(data){
            // code = code + '<div class="p-gallery__grid-item"><img src="/assets/img/gallery/'+data['img']+'" alt="'+data['ttl']+'"><dl><dt>'+data['ttl']+'</dt><dd>'+data['txt']+'</dd></dl></div>';
            code = code + '<div class="p-gallery__grid-item"><img src="/assets/img/gallery/'+data['img']+'" alt="'+data['ttl']+'"><p>'+data['txt']+'</p></div>';
        });
        $("#grid").append(code);
        var loadCounter = 0;
        var msnry;
        $('.p-gallery__grid-item img').each(function(){
            $(this).on("load",function(){
                loadCounter++;
                if (loadCounter === $('.p-gallery__grid-item img').length) {
                    console.log(loadCounter)
                    msnry = new Masonry( '#grid', {
                        itemSelector: '.p-gallery__grid-item',
                        initLayout: false,
                    });
                    msnry.on('layoutComplete',function(){
                        $("#grid").addClass("complete");
                    });
                    msnry.layout();
                }
            });
        });

        
        $("#grid").on( 'click', '.p-gallery__grid-item', function() {
            $(this).toggleClass('wide');
            msnry.layout();
        });


    }



    if($(".l-chat")[0]){
        const setVw = function() {
            const vw = document.documentElement.clientWidth / 100;
            document.documentElement.style.setProperty('--vw', `${vw}px`);
        }
        window.addEventListener('DOMContentLoaded', setVw);
        window.addEventListener('resize', setVw);
        $(".l-chat").each(function(){
            gsap.set($(this).find('.l-chat__images--inner')[0],{
                // scale: 0.6,
                y: "-30%",
                width: "80%",
                height: "50%",
                // maxWidth: "780px",
                maxWidth: "calc(100% - 100% + 780px)",
                borderRadius: "22px",
            });
            gsap.to($(this).find('.l-chat__images--inner')[0], {
                // scale: 1,
                y: "0%",
                width: "100%",
                height: "100%",
                // maxWidth: "2000px",
                maxWidth: "calc(100%  + 780px - 780px)",
                borderRadius: "0px",
                scrollTrigger: {
                    trigger: $(this).find('.l-chat__pagetitle')[0],
                    start: 'bottom bottom',
                    // end: 'top top',
                    // markers: true, 
                    scrub: true,
                }
            });
            if($(this).find('.l-chat__end')[0]){
                gsap.to($(this).find('.l-chat__images .i5')[0], {
                    // scale: 0.6,
                    width: "80%",
                    height: "50%",
                    // maxWidth: "780px",
                    maxWidth: "calc(100% - 100% + 780px)",
                    borderRadius: "22px",
                    scrollTrigger: {
                        trigger: $(this).find('.l-chat__end')[0],
                        start: 'top bottom',
                        end: 'top top',
                        // markers: true, 
                        scrub: true,
                    }
                });
            }
        });
    }


    if($('.rellax')[0]){
        var rellax = new Rellax('.rellax',{center:true});
    }


    if($(".p-chat__member")[0]){
        if( $(window).width()<=1366 ){
            gsap.to('.p-chat__member--inner',{
                // x: if( $(window).width()<=1366 ){ -1366 + $(window).width() }else{0},
                // x: ($(window).width()<1366)?-1366 + $(window).width():0,
                x: -1366 + $(window).width(),
                ease: "none",
                scrollTrigger: {
                    trigger: '.p-chat__member',
                    start: "top-=50px top",
                    // end: $('.p-chat__member--inner').width() - $(window).width(),
                    anticipatePin: 1,
                    pin: true,
                    // markers: true, 
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });
        }
    }





    //ONE-DAY
    if($(".b-day-fv")[0]){
        gsap.to('.b-day-fv__blur',{
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
                trigger: '.b-day-fv',
                start: "top top",
                end: "bottom bottom",
                // markers: true, 
                scrub: true,
                invalidateOnRefresh: true,
            }
        });
        $(".b-day-prof__flex").on("click",function(){
            $body.removeClass("view-prof");
        });
        $(".b-day-prof__btn").on("click",function(){
            $body.addClass("view-prof");
        });
        var orsslider = new Swiper('.b-day-ors__slider', {
            effect: 'fade',
            slidesPerView: 1,
            speed: 1000,
            loop: true,
            allowTouchMove: false,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                renderBullet: function (index, className) {
                    let num = index + 1;
                    return (
                        '<div class="' + className + '"><div class="pagination_num">o' + num + '</div><div class="pagination_bar"></div>o4</div>'
                    )
                },
            },
        });
    }



})();
