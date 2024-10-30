(function(){
    const $body = $("body");

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
                start: 'top bottom',
                end: 'top top',
                // markers: true, 
                scrub: true,
            }
        });
        gsap.to('.l-message-fv__images', {
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
                clickable: true,
                renderBullet: function (index, className) {
                    let num = index + 1;
                    return (
                        '<div class="' + className + '"><div class="pagination_num">0' + num + '</div><div class="pagination_bar"></div></div>'
                    )
                },
            },
        });
        if($(".b-loading")[0]){
            kv_slider.autoplay.stop();
        }
    }


    if($(".b-loading")[0]){
        const $b_loading = $(".b-loading");
        const time = 3000;
        $body.addClass("loading");
        $b_loading.attr("data-scene",1);
        setTimeout(function(){
            $b_loading.attr("data-scene",2);
            setTimeout(function(){
                $b_loading.attr("data-scene",3);
                setTimeout(function(){
                    $b_loading.fadeOut(function(){
                        $body.removeClass("loading");
                        kv_slider.autoplay.start();
                    });
                },time);
            },time);
        },time);
    }


})();
