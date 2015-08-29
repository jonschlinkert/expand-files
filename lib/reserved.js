'use strict';

exports.taskKeys = [
  'options',
  'taskname'
];

exports.targetKeys = [
  'targetname',
  'files',
  'src',
  'dest'
];

exports.optsKeys = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'flatten',
  'rename',
  'process',
  'srcBase'
];

exports.all = exports.taskKeys
  .concat(exports.targetKeys)
  .concat(exports.optsKeys);
