module.exports = {
    roots: ['<rootDir>/pages/'], // 使用 pages 目录作为根目录
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Jest 的环境设置
    testEnvironment: 'jsdom',
  };
  