const gulp = require('gulp');
const header = require('gulp-header');
const pkg = require('./package.json');
const del = require('del');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const process = require('child_process');
//const ngc = require('gulp-ngc');

/*
Это замена неработающего в Angular7 плагина gulp-ngc.
По сути - немного измененный код из gulp-ngc.
*/
const through = require('through2');
const gutil = require('gulp-util');
const ngc = require('@angular/compiler-cli/src/main').main;


const headerTemplate = '// <%= pkg.name %> v<%= pkg.version %>\n';


gulp.task('release', ['clean-ngc'], function () {
    require('./agGridPropertiesCheck');
    gulp.src(['./dist/', '!./dist/**/*.metadata.json'])
        .pipe(header(headerTemplate, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
    return del(['aot/**', '!aot',
        'dist/**', '!dist',
        './main.metadata.json', './main.js*', './main.d.ts']);
});

/*
 * ngc compilation tasks
 */
gulp.task('clean-ngc', (callback) => {
    return runSequence('clean', 'ngc', callback);
});

gulp.task('ngc', (callback) => {
    return runSequence('ngc-src', 'ngc-main', callback);
});

gulp.task('ngc-src', (callback) => {
    return ngc(['./tsconfig-src.json'], callback);
});

gulp.task('ngc-main', (callback) => {
    return gulp
        .src('./exports.ts')
        .pipe(through.obj((file, encoding, callback) => {
            const code = ngc(['./tsconfig-main.json']);
            let err = code === 0
                ? null
                : new gutil.PluginError(
                    'gulp-ngc',
                    `${gutil.colors.red('Compilation error.')}\nSee details in the ngc output`,
                    {fileName: file.path});

            callback(err, file);
        }));
});

gulp.task('clean-build-main', ['build-main'], (callback) => {
    // post build cleanup
    return del([
        './aot', 'exports.js*', 'exports.d.ts', 'exports.metadata.json',
        './src/*.js*', './src/*.d.ts', './src/*.metadata.*'
    ], callback);
});

gulp.task('build-main', ['ngc-main'], (callback) => {
    gulp.src("./exports.js")
        .pipe(rename(('main.js')))
        .pipe(gulp.dest("./"));
    gulp.src("./exports.d.ts")
        .pipe(rename(('main.d.ts')))
        .pipe(gulp.dest("./"));
    return gulp.src("./exports.metadata.json")
        .pipe(rename(('main.metadata.json')))
        .pipe(gulp.dest("./"));
});


function ngcCompile(callback) {

    const ngcFlags = ['-p', './tsconfig-main.json'];

    // tslint:disable-next-line
    return new Promise((resolve, reject) => {

        const binaryPath = resolvePath('./node_modules/.bin/ngc');
        const childProcess = process.spawn(binaryPath, ngcFlags, {shell: true});
        console.log('dfdfdf');
        // Pipe stdout and stderr from the child process.
        childProcess.stdout.on('data', (data) => console.log(`${data}`));
        childProcess.stderr.on('data', (data) => console.error(chalk.default.red(`${data}`)));
        childProcess.on('exit', (exitCode) => {


            callback();
            // tslint:disable-next-line
            exitCode === 0 ? resolve() : reject(`ngc compilation failure`);
        });
    });
}
