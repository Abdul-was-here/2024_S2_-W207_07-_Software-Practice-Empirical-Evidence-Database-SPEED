module.exports = {
    roots: ['<rootDir>/pages/'], // 指定 pages 目录为项目根目录
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // 忽略不需要的目录
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // 配置 Jest 的测试环境
    testEnvironment: 'jsdom', // 使用 jsdom 模拟浏览器环境
  };
  