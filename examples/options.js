var Files = require('../');

function files(options) {
  var config = new Files();
  config.expand(options);
  return config.cache;
}

console.log(files({
  src: 'lib/*.js',
  dest: 'dist/'
}));
console.log(files({
  src: 'lib/*.js',
  dest: 'dist/',
  options: {
    expand: true
  }
}));
console.log(files({
  src: '*.js',
  dest: 'dist/',
  cwd: 'lib'
}));
console.log(files({
  src: '*.js',
  dest: 'dist/',
  cwd: 'lib',
  expand: true
}));
console.log(files({
  src: '*.js',
  dest: 'dist/',
  cwd: 'lib',
  expand: true,
  flatten: true
}));
console.log(files({
  src: 'lib/*.js',
  dest: 'dist/',
  flatten: true
}));
console.log(files({
  src: 'lib/*.js',
  dest: 'dist/',
  options: {
    expand: true,
    flatten: true
  }
}));

// console.log(files({src: 'lib/*.js', dest: 'dist/', ext: true}));
// console.log(files({src: 'lib/*.js', dest: 'dist/', extDot: 'first'}));
// console.log(files({src: 'lib/*.js', dest: 'dist/', rename: true}));
// console.log(files({src: 'lib/*.js', dest: 'dist/', filter: true}));
