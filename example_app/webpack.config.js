var path = require('path');

var webpack = require('webpack');

var FlaskResolverPlugin = require('webpack-flask-loader')

module.exports = {
    debug: true,
    entry: {
        app: "./static/app.js",
    },
    plugins: [
        new webpack.ResolverPlugin([
            new FlaskResolverPlugin()
        ])
    ],
    output: {
        path: path.join(__dirname, 'static', 'build'),
        publicPath: "/static/",
        filename: "[name].js"
    },
    devtool: "inline-source-map", // or "source-map"
};