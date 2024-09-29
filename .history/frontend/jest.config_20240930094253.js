module.exports = {
    roots: ['<rootDir>'], // 让 Jest 在根目录下查找
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'], // 修改为指向 __tests__ 目录
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // 使用 babel-jest 来转换 JS/JSX 文件
    },
    moduleNameMapper: {
      '\\.module\\.css$': 'identity-obj-proxy',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  };
  