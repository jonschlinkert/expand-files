'use strict';

exports.taskKeys = [
  'options'
];

exports.targetKeys = [
  'files',
  'src',
  'dest'
];

exports.options = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'filter',
  'flatten',
  'glob',
  'parent',
  'process',
  'rename',
  'srcBase',
  'statType',
  'transform'
];

exports.all = exports.taskKeys
  .concat(exports.targetKeys)
  .concat(exports.options);
