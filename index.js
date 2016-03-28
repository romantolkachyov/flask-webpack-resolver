var path = require('path');
var shelljs = require('shelljs');

var modPathMap = {};

var getResolveFlask = function(flask_app) {
    return function(request, callback) {
        request.request; // string with module name

        var captured = (request.request.substr(0, 5) === 'flask');
        var ignored = false;

        if(captured && !ignored) {
            var context = this;
            var blueprint_name = request.request.split('/')[0].split('.')[1];
            var mod_path = modPathMap[blueprint_name];
            var testFilename = mod_path + '/';
            context.fileSystem.stat(testFilename, function(err, stats) {
                if (err) {
                    console.log('file does not exists', testFilename);
                    return;
                }

                var resultFilename = testFilename;
                var newRequest = request.request.split('/')
                var type = 'directory';
                if (newRequest.length > 1) {
                    newRequest = newRequest[1];
                    type = 'file';
                } else {
                    newRequest = '';
                    type = 'directory';
                }
                var request2 = {
                    path: resultFilename,
                    query: request.query,
                    request: newRequest
                };
                context.doResolve(type, request2, callback);
            });
        } else {
            callback();
        }
    };
};

var FlaskResolverPlugin = function(flask_app) {
    this.flask_app = flask_app || 'app:app'
    var mod_and_obj = flask_app.split(':');
    var app_object = 'app:app'
    var command = "python -c \"import json, types;from " + mod_and_obj[0] + " import " + mod_and_obj[1] + " as myapp; myapp = myapp() if isinstance(myapp, types.FunctionType) else myapp; print('-*- START -*-'); print(json.dumps({name: b.static_folder for name, b in myapp.blueprints.items()}));\"";
    var res = shelljs.exec(command, {
        silent: true
    }).output;
    var start_pos = res.search('-*- START -*-\n');

    modPathMap = JSON.parse(res.substr(start_pos + 14));
};

FlaskResolverPlugin.prototype.apply = function(resolver) {
  resolver.plugin('module', getResolveFlask(this.flask_app));
};

module.exports = FlaskResolverPlugin;