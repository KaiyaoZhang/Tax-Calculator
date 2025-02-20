module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", //mock any css or scss file
  },
  testEnvironment: "jsdom", //specify the test env as jsdom
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], //load jest.setup.js file
};
