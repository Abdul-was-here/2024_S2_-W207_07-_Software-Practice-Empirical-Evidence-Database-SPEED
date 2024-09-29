module.exports = {
    roots: ['<rootDir>/pages/'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // 使用 babel-jest 来转换 JS/JSX 文件
    },
    moduleNameMapper: {
      // 模拟 CSS 模块
      '\\.module\\.css$': 'identity-obj-proxy',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // 模拟其他样式文件
    },
  };
  