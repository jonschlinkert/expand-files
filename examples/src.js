var files = require('../');

console.log(files('*.js'));
//=>  [ { src: [ 'index.js' ], dest: '' } ]

console.log(files('*.js', 'foo'));
//=>  [ { src: [ 'index.js' ], dest: 'foo' } ]

console.log(files('*.js', 'foo', {expand: true}));
//=>  [ { src: [ 'index.js' ], dest: 'foo/index.js' } ]

console.log(files(['*.js', '*.md'], 'foo', {expand: true}));
//=> [ { src: [ 'index.js' ], dest: 'foo/index.js' },
//     { src: [ 'README.md' ], dest: 'foo/README.md' } ]

console.log(files(['*.js', '*.md'], 'foo', {expand: true}));
//=> [ { src: [ 'index.js' ], dest: 'foo/index.js' },
//     { src: [ 'README.md' ], dest: 'foo/README.md' } ]
