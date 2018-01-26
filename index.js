let fs = require('fs-extra');
let path = require('path');
let transformTools = require('browserify-transform-tools');

function copyFile(parentFile, requiredFile, outDir) {
    let baseDir = path.dirname(parentFile);
    let fullFilePath = path.resolve(baseDir, requiredFile);
    let filePath = path.relative(baseDir, fullFilePath);
    let fullFinalPath = path.join(outDir, filePath);
    let relativeFinalPath = path.relative(baseDir, fullFinalPath);

    if(fs.existsSync(fullFilePath)) {
        fs.copySync(fullFilePath, fullFinalPath);
    }

    return "'" + relativeFinalPath.replace(/\\/g, '/') + "'";
}

function transformFn(args, opts, callback) {
    if (!opts.config) throw 'Required parameters must be informed';

    let file = args[0];
    let validFilesRegex = opts.config.test;
    let outDir = opts.config.outDir;
    let customProcess = opts.config.customProcess;
    outDir = outDir ? path.resolve(outDir) : outDir;
    
    if (typeof(validFilesRegex) === 'string') validFilesRegex = new RegExp(validFilesRegex);
    if (!(validFilesRegex instanceof RegExp)) throw '\'test\' must be a RegExp or a string';
    if(!validFilesRegex.test(file)) return callback();

    if(!customProcess) {
        let finalPath = copyFile(opts.file, file, outDir);
        return callback(null, "'" + finalPath + "'");
    } else {
        if (typeof(customProcess) !== 'function') throw '\'customProcess\' must be a function';

        let finalPath = customProcess(opts.file, file, outDir);
        return callback(null, finalPath);
    }
}

module.exports = transformTools.makeRequireTransform('file-pathify', {evaluateArguments: true, jsFilesOnly: true}, transformFn);
