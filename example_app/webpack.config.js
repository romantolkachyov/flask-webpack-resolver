var path = require('path');

var webpack = require('webpack');

var FlaskResolverPlugin = require('flask-webpack-resolver');

module.exports = {
    debug: true,
    entry: {
        app: "./static/app.js",
    },
    plugins: [
        new webpack.ResolverPlugin([
            new FlaskResolverPlugin('app:init_app')
        ])
    ],
    output: {
        path: path.join(__dirname, 'static', 'build'),
        publicPath: "/static/",
        filename: "[name].js"
    },
    devtool: "inline-source-map" // or "source-map"
};