module.exports = {
    mode: 'production',
    entry: './main-with-styles.js',
    output: {
        path: __dirname + '/dist',
        library: ['agGrid'],
        libraryTarget: 'umd',
        filename: 'native-grid.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};
