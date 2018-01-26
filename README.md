# file-pathify #
Browserify alternative to Webpack's 'file-loader'

## Installation ##
`npm install file-pathify`

or

`yarn add file-pathify`

## Basic usage ##
Given the sample.js file
```javascript
var img1 = require('./assets/images/img1.png');
var movie1 = require('./assets/files/movie1.mp4');

// ...
```
And this browserify configuration
```javascript
bundle.transform('file-pathify', { outDir: 'dist', test: /\.(png|mp4)$/ })
```
The resulting sample.js file, after transformation will be
```javascript
var img1 = 'dist/assets/images/img1.png';
var movie1 = 'dist/assets/files/movie1.mp4';

// ...
```
Also, files "assets/images/img1.png" and "assets/files/movie1.mp4" will be copied to "dist/assets/images/img1.png" and "dist/assets/files/movie1.mp4", respectively.

## Options ##

| Option        | Description                                                         | Type                                                                        |
|---------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------|
| test          | Only files that match this criteria will be copied and transformed. | RegExp or string                                                            |
| outDir        | Output directory where files will be copied.                        | string                                                                      |
| customProcess | Function that overrides the default behavior.                       | Function(parentFile: string, requiredFile: string, outDir: string) : string |

## Using "customProcess" ##

When "customProcess" is passed it will be used to override the default behavior of the transform. This means that YOU are responsible for copying files to the apropriate location and also for calculating and returning the final path of the file.

This function receives 3 parameters: the path of the file being transformed, the path being required and the outDir parameter.

```javascript
function myCustomProcess(parentFile, requiredFile, outDir) {
    var fullRequiredFile = path.resolve(path.dirname(parentFile), requiredFile);
    var destFile = path.join('some/other/path', requiredFile);

    fs.copySync(fullRequiredFile, destFile);

    return destFile;
}

bundle.transform('file-pathify', { outDir: 'dist', test: /\.(png|mp4)$/, customProcess: myCustomProcess });
```