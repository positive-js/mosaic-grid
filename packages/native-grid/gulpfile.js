const gulp = require('gulp');
const clean = require('gulp-clean');
const autoprefixer = require('autoprefixer');
const gulpTypescript = require('gulp-typescript');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const typescript = require('typescript');
const merge = require('merge2');
const header = require('gulp-header');
const named = require('vinyl-named');
const webpackStream = require('webpack-stream');
const filter = require('gulp-filter');
const replace = require('gulp-replace');
const rename = require('gulp-rename');


const pkg = require('./package.json');

const headerTemplate = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

const dtsHeaderTemplate = '';

gulp.task('default', ['webpack-run-all']);
gulp.task('release', ['webpack-run-all']);

gulp.task('webpack-run-all', ['webpack', 'webpack-minify', 'webpack-noStyle', 'webpack-minify-noStyle', 'tsc-main'], tscSrcTask);

gulp.task('webpack', ['tsc', 'scss'], webpackTask.bind(null, false, true));
gulp.task('webpack-minify', ['tsc', 'scss'], webpackTask.bind(null, true, true));
gulp.task('webpack-minify-noStyle', ['tsc', 'scss'], webpackTask.bind(null, true, false));
gulp.task('webpack-noStyle', ['tsc', 'scss'], webpackTask.bind(null, false, false));

gulp.task('tsc', ['tsc-src'], tscMainTask);
gulp.task('tsc-src', ['cleanDist'], tscSrcTask);
gulp.task('tsc-main', ['cleanMain'], tscMainTask);

gulp.task('scss', ['cleanDist'], scssTask);


gulp.task('cleanDist', cleanDist);
gulp.task('cleanMain', cleanMain);


function webpackTask(minify, styles) {

    const plugins = [];
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
    }
    const mainFile = styles ? './main-with-styles.js' : './main.js';

    let fileName = 'native-grid';
    fileName += minify ? '.min' : '';
    fileName += styles ? '' : '.noStyle';
    fileName += '.js';

    return gulp.src('src/entry.js')
        .pipe(webpackStream({
            mode: 'production',
            entry: {
                main: mainFile
            },
            output: {
                path: path.join(__dirname, "dist"),
                filename: fileName,
                library: ["agGrid"],
                libraryTarget: "umd"
            },
            //devtool: 'inline-source-map',
            module: {
                loaders: [
                    {test: /\.css$/, loader: "style-loader!css-loader"}
                ]
            },
            plugins: plugins
        }))
        .pipe(header(bundleTemplate, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
}

function cleanDist() {
    return gulp
        .src('dist', {read: false})
        .pipe(clean());
}

function cleanMain() {
    return gulp
        .src(['./main.d.ts', 'main.js'], {read: false})
        .pipe(clean());
}

function tscSrcTask() {
    const tsProject = gulpTypescript.createProject('./tsconfig.json', {typescript: typescript});

    const tsResult = gulp
        .src('src/**/*.ts')
        .pipe(tsProject());

    return merge([
        tsResult.dts
            .pipe(header(dtsHeaderTemplate, {pkg: pkg}))
            .pipe(gulp.dest('dist/lib')),
        tsResult.js
            .pipe(header(headerTemplate, {pkg: pkg}))
            .pipe(gulp.dest('dist/lib'))
    ]);
}

function tscMainTask() {
    const tsProject = gulpTypescript.createProject('./tsconfig-main.json', {typescript: typescript});

    const tsResult = gulp
        .src('./src/main.ts')
        .pipe(tsProject());

    return merge([
        tsResult.dts
            .pipe(replace("\"./", "\"./dist/lib/"))
            .pipe(header(dtsHeaderTemplate, {pkg: pkg}))
            .pipe(rename("main.d.ts"))
            .pipe(gulp.dest('./')),
        tsResult.js
            .pipe(replace("require(\"./", "require(\"./dist/lib/"))
            .pipe(header(headerTemplate, {pkg: pkg}))
            .pipe(rename("main.js"))
            .pipe(gulp.dest('./'))
    ]);
}

function scssTask() {
    const svgMinOptions = {
        plugins: [
            {cleanupAttrs: true},
            {removeDoctype: true},
            {removeComments: true},
            {removeMetadata: true},
            {removeTitle: true},
            {removeDesc: true},
            {removeEditorsNSData: true},
            {removeUselessStrokeAndFill: true},
            {cleanupIDs: true},
            {collapseGroups: true},
            {convertShapeToPath: true}
        ]
    };

    // Uncompressed
    return gulp.src(['styles/*.scss', '!styles/_*.scss'])
        .pipe(named())
        .pipe(webpackStream({
            mode: 'production',
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            //resolve-url-loader may be chained before sass-loader if necessary
                            use: [
                                {loader: 'css-loader', options: {minimize: false}},
                                'sass-loader',
                                {
                                    loader: 'postcss-loader',
                                    options: {syntax: 'postcss-scss', plugins: [autoprefixer()]}
                                },
                            ]
                        })
                    },
                    {
                        test: /\.(svg)$/,
                        use: [
                            'cache-loader',
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 8192
                                }
                            },
                            {
                                loader: 'image-webpack-loader',
                                options: {
                                    svgo: svgMinOptions
                                }
                            },
                            {
                                loader: 'svg-colorize-loader',
                                options: {
                                    color1: "#000000",
                                    color2: "#FFFFFF"
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new ExtractTextPlugin('[name].css')
            ]
        }))
        .pipe(filter("**/*.css"))
        .pipe(gulp.dest('dist/styles/'));
}
