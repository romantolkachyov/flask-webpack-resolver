# flask-webpack-resolver

Flask resolver plugin for webpack.

This plugin allows you to `require` static files (styles, scripts, templates e.t.c.) from your Flask blueprints installed on app (also in case if they are installed in site-packages).

# Installation

You can install plugin from npm:

    npm install --save-dev flask-webpack-resolver

Require module in your config:

    var FlaskResolverPlugin = require('flask-webpack-resolver')

Now you can add plugin to config:

    plugins: [
        new webpack.ResolverPlugin([
            new FlaskResolverPlugin('app:app')
        ])
    ]

Plugin will find flask app from string passed as a first plugin argument. String must contain python module name and object name separated by `:`. For example, `app:app` will produce `from app import app` import.

You also can specify any factory function for your wich will be called with no arguments and result will be used as app instance.

# Usage

After you connect blueprints to the app you can reference it content like this:

    require('flask.blueprint_name/scripts/test.js');

or if your blueprints static contains `index.js` file you can obtain filename part:

    require('flask.blueprint_name');

Look at example_app for details.