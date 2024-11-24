var gulp         = require('gulp');
var browser      = require('browser-sync');
var plumber      = require("gulp-plumber");
var watch        = require("gulp-watch");
var ejs          = require('gulp-ejs');
var rename       = require("gulp-rename");
var concat       = require("gulp-concat");
var fs           = require('fs');
var htmlbeautify = require("gulp-html-beautify");

var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var changed      = require('gulp-changed');

var gutil        = require('gulp-util');
var ftp          = require('gulp-ftp');
var sftp         = require('gulp-sftp');

var gifsicle     = require('imagemin-gifsicle');
var jpegtran     = require('imagemin-jpegtran');
var optipng      = require('imagemin-optipng');

var merge = require('event-stream').merge;

var dirName = process.cwd().split('/').pop();


// var babel = require("gulp-babel");
// var mmq = require( 'gulp-merge-media-queries' );



gulp.task('server', function() {
    // browser({server: {
    //     baseDir: 'dest'
    // }});
    browser({
        notify: false,
        files: 'dest',
        server: {
            baseDir: 'dest',
            // routes: {
            //     '/sakaiyu': 'dest'
            // }
        },
        // startPath: '/'
    });
});


/*-- upload --*/
gulp.task('upload', function () {
    var json = JSON.parse(fs.readFileSync("./server.json"));
    return gulp.src('dest/**/*')
               .pipe(ftp({
                    host       : json.host,
                    user       : json.user,
                    pass       : json.pass,
                    remotePath : json.remotePath
               })).pipe(gutil.noop());
});
gulp.task('ftp', ['upload'],function(){
    console.log('↓TEST-UP URL↓\u001b[32m');
    console.log('https://quacareer.den-web.com/');
    console.log('\u001b[0m↑TEST-UP URL↑');
});


/*-- html --*/
gulp.task('html', function(){
    var htmlsetting = {
      "indent_size": 2,
      "indent_with_tabs": true,
      "indent_char": " ",
      "max_preserve_newlines": 0,
      "preserve_newlines": false,
      "indent_inner_html": false,
      "content_unformatted": ['style','script','noscript'],
      "extra_liners": [],
    }
    return gulp.src('dev/*.ejs')
    .pipe(ejs())
    .pipe(rename(function(path){
      var fileName = path.basename;
      var myAry = fileName.split('__');
      if(myAry.length > 1){
        var lastValue = myAry[myAry.length-1];
        var htmlName = myAry[myAry.length-1];
        var dir ='';
        for(var i=0; i<myAry.length-1; i++){
          if(i == 0){
            dir = dir + myAry[i];
          }else{
            dir = dir + '/' + myAry[i];
          }
        }
      }else{
        var htmlName = myAry[myAry.length-1];
        var dir ='';
      }
      path.basename = htmlName;
      path.dirname = dir;
      path.extname = ".html";
    }))
    .pipe(plumber())
    .pipe(htmlbeautify(htmlsetting))
    .pipe( gulp.dest('dest/') );
});


/*-- top-assets --*/
gulp.task('css', function(){
  var normal = gulp.src('dev/assets/sass/style.scss')
    .pipe(plumber({
        errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(changed('dest/assets/css'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ["last 2 versions", "ie >= 11", "Android >= 4","ios_saf >= 8"],
        cascade: false
    }))
    // .pipe( mmq() )
    .pipe(minifyCss({advanced:false})) // minify
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dest/assets/css'));
});

gulp.task('img', function() {
  var jpg = gulp.src('dev/assets/img/*.jpg')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(jpegtran()())
             .pipe(gulp.dest('dest/assets/img'));
  var png = gulp.src('dev/assets/img/*.png')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(optipng()())
             .pipe(gulp.dest('dest/assets/img'));
  var gif = gulp.src('dev/assets/img/*.gif')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(gifsicle()())
             .pipe(gulp.dest('dest/assets/img'));
  var svg = gulp.src('dev/assets/img/*.svg')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(gulp.dest('dest/assets/img'));
  var webp = gulp.src('dev/assets/img/**/*.webp')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(gulp.dest('dest/assets/img'));
  var favicon = gulp.src('dev/assets/img/*.ico')
             .pipe(plumber())
             .pipe(changed('dest/assets/img'))
             .pipe(gulp.dest('dest/assets/img'));
  return merge(jpg,png,gif,svg,webp,favicon);
});

// gulp.task('svg', function(){
//     return gulp.src('dev/assets/svg/*.svg')
//                .pipe(plumber())
//                .pipe(changed('dest/assets/img'))
//                .pipe(gulp.dest('dest/assets/img'));
// });

// gulp.task('video', function(){
//     return gulp.src('dev/assets/video/*.mp4')
//                .pipe(plumber())
//                .pipe(changed('dest/assets/video'))
//                .pipe(gulp.dest('dest/assets/video'));
// });
// gulp.task('audio', function(){
//     return gulp.src('dev/assets/audio/*.mp3')
//                .pipe(plumber())
//                .pipe(changed('dest/assets/audio'))
//                .pipe(gulp.dest('dest/assets/audio'));
// });

gulp.task('js', function(){
  var vendor = gulp.src([
      'dev/assets/js/vendor/jquery-3.7.1.min.js',
      'dev/assets/js/vendor/swiper-bundle.min.js',
      'dev/assets/js/vendor/gsap.min.js',
      'dev/assets/js/vendor/ScrollTrigger.min.js',
      'dev/assets/js/vendor/simpleParallax.umd.js',
      'dev/assets/js/vendor/masonry.pkgd.min.js',
      // 'dev/assets/js/vendor/lightbox.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe( gulp.dest('dest/assets/js') );
  var normal = gulp.src([
      'dev/assets/js/inview.js',
      // 'dev/assets/js/scroll_direction.js',
      'dev/assets/js/mouseStalker.js',
      // 'dev/assets/js/global_navigation.js',
      // 'dev/assets/js/viewport.js',
      // 'dev/assets/js/video.js',
      // 'dev/assets/js/other.js',
      // 'dev/assets/js/interview.js',
      'dev/assets/js/script.js',
    ])
    // .pipe(babel())
    .pipe(concat('script.js'))
    .pipe( gulp.dest('dest/assets/js') );
    return merge(vendor,normal);
});



/*-- run --*/
gulp.task('watch', function() {
    watch([
        'dev/**/*.scss',
        'dev/assets/img/*',
        // 'dev/assets/svg/*',
        // 'dev/assets/video/*',
        // 'dev/assets/audio/*',
        'dev/**/*.js',
        'dev/**/*.ejs'
    ], function(event){gulp.start("build");});
});

// gulp.task('build', ['css','img','js','svg','html','video','audio'],function(){
//   browser.reload();
// });
gulp.task('build', ['css','img','js','html'],function(){
  browser.reload();
});

gulp.task('default', ['build','watch','server']);
