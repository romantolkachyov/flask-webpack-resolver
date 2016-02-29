var path = require('path');
var shelljs = require('shelljs');

var modPathMap = {};

var getResolveFlask = function(exts) {
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
                // return tryToFindExtension(index + 1);
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

var FlaskResolverPlugin = function(exts) {
    this.exts = exts || ['css', 'js', 'scss', 'less'];
    var app_object = 'app:app'
    var command = "python -c \"import json;from app import app; print '-*- START -*-'; print json.dumps({name: b.static_folder for name, b in app.blueprints.items()});\"";

    var res = shelljs.exec(command, {
        silent: true
    }).output;
    var start_pos = res.search('-*- START -*-\n');

    modPathMap = JSON.parse(res.substr(start_pos + 14));
};

FlaskResolverPlugin.prototype.apply = function(resolver) {
  resolver.plugin('module', getResolveFlask(this.exts));
};

module.exports = FlaskResolverPlugin;