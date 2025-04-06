import gulp from 'gulp';
import browser from 'browser-sync';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import fs from 'fs';
import htmlbeautify from 'gulp-html-beautify';
import * as sass from 'sass'; // Recommended import for dart-sass
import gulpSass from 'gulp-sass';
const sassCompiler = gulpSass(sass);
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import optipng from 'imagemin-optipng';
import merge from 'merge-stream';
import gutil from 'gulp-util';
import ftp from 'vinyl-ftp';
import sftp from 'gulp-sftp';

const dirName = process.cwd().split('/').pop();
const bs = browser.create();

/*-- server --*/
export const server = (done) => {
    bs.init({
        notify: false,
        files: 'dest/**/*',
        server: {
            baseDir: 'dest',
            // routes: {
            //     '/sakaiyu': 'dest'
            // }
        },
        // startPath: '/'
    });
    done();
};

/*-- upload --*/
export const uploadFtp = () => {
    const json = JSON.parse(fs.readFileSync("./server.json"));
    const conn = ftp.create({
        host: json.host,
        user: json.user,
        password: json.pass,
        remotePath: json.remotePath,
        log: gutil.log
    });
    return gulp.src('dest/**/*')
               .pipe(conn.dest(json.remotePath));
};

// SFTP の設定例
const sftpConfig = {
    host: 'your_sftp_host',
    port: 22,
    user: 'your_sftp_user',
    password: 'your_sftp_password',
    remotePath: '/path/to/remote/directory/'
};

export const uploadSftp = () => {
    return gulp.src('dest/**/*')
        .pipe(sftp(sftpConfig));
};

export const ftpTask = gulp.series(uploadFtp, (done) => { // ← ここを ftpTask に変更
    console.log('↓TEST-UP URL↓\u001b[32m');
    console.log('https://quacareer.den-web.com/');
    console.log('\u001b[0m↑TEST-UP URL↑');
    done();
});

/*-- html --*/
export const html = () => {
    const htmlsetting = {
      "indent_size": 2,
      "indent_with_tabs": true,
      "indent_char": " ",
      "max_preserve_newlines": 0,
      "preserve_newlines": false,
      "indent_inner_html": false,
      "content_unformatted": ['style','script','noscript'],
      "extra_liners": [],
      "eol": '\n'
    };
    return gulp.src('dev/*.ejs')
        .pipe(ejs())
        .pipe(rename(function(path){
          const fileName = path.basename;
          const myAry = fileName.split('__');
          if(myAry.length > 1){
            const htmlName = myAry[myAry.length-1];
            let dir ='';
            for(let i=0; i<myAry.length-1; i++){
              dir += (i === 0 ? '' : '/') + myAry[i];
            }
            path.basename = htmlName;
            path.dirname = dir;
          } else {
            path.basename = fileName;
            path.dirname = '';
          }
          path.extname = ".html";
        }))
        .pipe(plumber())
        .pipe(htmlbeautify(htmlsetting))
        .pipe(gulp.dest('dest/'));
};

/*-- top-assets --*/
export const css = () => {
    return gulp.src('dev/assets/sass/style.scss')
        .pipe(plumber({
            errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(changed('dest/assets/css'))
        .pipe(sourcemaps.init())
        .pipe(sassCompiler()) // Use the renamed sass compiler
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 2 versions", "ie >= 11", "Android >= 4","ios_saf >= 8"],
            cascade: false
        }))
        // .pipe( mmq() ) // 必要であれば ES Modules 対応の代替を探す
        .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } })) // minify
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dest/assets/css'))
        .pipe(bs.stream());
};

export const img = () => {
    return gulp.src('dev/assets/img/**/*') // SVG と webp も含む
        .pipe(plumber())
        .pipe(changed('dest/assets/img'))
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            jpegtran({ progressive: true }),
            optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('dest/assets/img'));
};

export const js = () => {
    const vendorFiles = [
        'dev/assets/js/vendor/jquery-3.7.1.min.js',
        'dev/assets/js/vendor/swiper-bundle.min.js',
        'dev/assets/js/vendor/gsap.min.js',
        'dev/assets/js/vendor/ScrollTrigger.min.js',
        'dev/assets/js/vendor/simpleParallax.umd.js',
        'dev/assets/js/vendor/masonry.pkgd.min.js',
        'dev/assets/js/vendor/rellax.min.js',
    ];
    const normalFiles = [
        'dev/assets/js/inview.js',
        // 'dev/assets/js/mouseStalker.js',
        // 'dev/assets/js/scroll_direction.js',
        // 'dev/assets/js/global_navigation.js',
        // 'dev/assets/js/viewport.js',
        // 'dev/assets/js/video.js',
        // 'dev/assets/js/other.js',
        // 'dev/assets/js/interview.js',
        'dev/assets/js/script.js',
    ];

    const vendor = gulp.src(vendorFiles)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dest/assets/js'));

    const normal = gulp.src(normalFiles)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dest/assets/js'))
        .pipe(bs.stream());

    return merge(vendor, normal);
};

/*-- run --*/
export const watch = () => {
    gulp.watch('dev/**/*.scss', css);
    gulp.watch('dev/assets/img/**/*', img);
    gulp.watch('dev/**/*.js', js);
    gulp.watch('dev/**/*.ejs', html).on('change', bs.reload);
};

export const build = gulp.series(css, img, js, html);

export default gulp.series(build, server, watch);