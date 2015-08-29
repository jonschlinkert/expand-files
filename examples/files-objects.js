var files = require('../');

console.log(files({
  'foo/': 'test/fixtures/a.txt',
  'bar/': 'test/fixtures/b.txt'
}));
