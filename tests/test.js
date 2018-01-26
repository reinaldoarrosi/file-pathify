let path = require('path');
let transformTools = require('browserify-transform-tools');
let filePathify = require('../index.js');
let content = "var teste = require('./assets/images/img.png')";
let config = {
    test: /\.(png|mp4)$/,
    outDir: './tests/dist'
};

transformTools.runTransform(filePathify, path.resolve('./tests/dummy.js'), {content: content, config: config}, function(err, output) {
    console.log(output);
});