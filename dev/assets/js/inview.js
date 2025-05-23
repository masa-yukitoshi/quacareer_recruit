class inview {
    constructor(myQuery, myOptions) {
      // デフォルト設定
      const defaults = {
        root: null,
        margin: '0% 0%',
        threshold: 0,
        viewIn: function () {
          this.target.classList.add('inviewed');
        },
        viewOut: function () {
          this.target.classList.remove('inviewed');
        },
        once: true,
      };
      let opts = { ...defaults, ...myOptions }; // 記述されたオプションの上書き
  
      this.query = myQuery;
      this.settings = opts;
  
      // デフォルト実行
      const nodelist = document.querySelectorAll(this.query);
      const node = Array.from(nodelist).reverse();
      const options = {
        root: this.settings.root,
        rootMargin: this.settings.margin,
        threshold: this.settings.threshold,
      };
      const onceFlag = this.settings.once;
  
      const callback = (entries, observer) => {
        entries.forEach((entry) => {
          this.settings.target = entry.target;
          if (entry.isIntersecting) {
            this.settings.viewIn();
            if (onceFlag) {
              observer.unobserve(entry.target);
            }
          } else {
            this.settings.viewOut();
          }
        });
      };
  
      const observer = new IntersectionObserver(callback, options);
      node.forEach((obj) => observer.observe(obj));
    }
}
/*
第一引数は必須、第二引数オプションは任意
デフォルトの挙動はclass「inviewed」の付け外し
const obs2 = new inview('.target', {
    root: null, //root（default値：null）
    margin: '0% 0%', //rootMargin（default値：'0% 0%'）
    threshold: 0, //threshold（default値：0）
    viewIn: function(){
    //画面に入った時に実行したい処理（default値：class「inviewed」をadd）
    $(this.target).addClass('abcd');
    },
    viewOut: function(){
    //画面から出た時に実行したい処理（default値：class「inviewed」をremove）
    $(this.target).removeClass('abcd');
    },
    once: false //viewInが実行された後に監視を終了するか（default値：true）
});
*/
(function(){
    //「.inviewed」をaddClassするだけ
    const $body = $("body");
    const js_inview_addclass = new inview('.js_inview', {margin: '-20% 0%'});
    const top_statement = new inview('.top-statement__inner', {margin: '-50% 0%'});
    const b_day_sch = new inview('.b-day-sch', {margin: '-50% 0%'});
    const b_flow_addclass = new inview('.b-flow', {margin: '-45% 0%'});
    const p_about__statement = new inview('.p-about__statement', {margin: '-5% 0%',once: false});
    const b_day_ors__text = new inview('.b-day-ors__text', {margin: '-50% 0%'});
    const scene_trigger = new inview('.js-scene-trigger', {
      margin: '-50% 0%',
      viewIn: function(){
        $body.attr("data-scene",$(this.target).attr("data-scene"));
      },
      viewOut: function(){},
      once: false
    });
    const chat_trigger = new inview('.js-chat-trigger', {
      margin: '-50% 0%',
      viewIn: function(){
        $(this.target).parents(".l-chat").attr("data-scene",$(this.target).attr("data-scene"));
      },
      viewOut: function(){},
      once: false
    });
    const kv_trigger = new inview('.kv-trigger', {
      margin: '0% 0%',
      viewIn: function(){
        $body.addClass("kv-view");
      },
      viewOut: function(){
        $body.removeClass("kv-view");
      },
      once: false
    });
    const p_welfare_section = new inview('.p-welfare__section', {
      margin: '-50% 0%',
      viewIn: function(){
        $body.attr("data-sec",$(this.target).attr("id"));
      },
      // viewOut: function(){},
      once: false
    });
    const chat_fv_img = new inview('.chat-fv-img', {
      margin: '-50% 0%',
      viewIn: function(){
        $body.attr("data-fv",$(this.target).attr("data-fv"));
      },
      // viewOut: function(){},
      once: false
    });
    const chat_section = new inview('.p-chat__section', {
      viewIn: function(){
        $(this.target).parents('.l-chat').addClass('sectionview');
      },
      viewOut: function(){
        $(this.target).parents('.l-chat').removeClass('sectionview')
      },
      once: false
    });

    
    
    // const section = new inview('.section', {
    //   margin: '-50% 0%',
    //   viewIn: function(){
    //       if($("body").hasClass("scroll-bottom")){
    //         $(this.target).addClass('is_view');
    //       }
    //     },
    //     viewOut: function(){
    //       if(!$("body").hasClass("scroll-bottom")){
    //         $(this.target).removeClass('is_view');
    //       }
    //     },
    //     once: false
    // });
})();


