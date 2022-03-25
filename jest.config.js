module.exports = {
  rootDir: './__tests__/integration',
  testSequencer: '../sequencer.js',
  setupFilesAfterEnv: ['../setup.js'],
  testRegex: './*\\.test\\.js$',
  testTimeout: 300000,
};
