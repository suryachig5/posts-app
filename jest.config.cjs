module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  moduleNameMapper: {
    '\\.module\\.scss$': '<rootDir>/src/test/styleModuleMock.cjs',
    '[.]scss$': '<rootDir>/src/test/styleMock.cjs',
    '^@fontsource-variable/': '<rootDir>/src/test/styleMock.cjs',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
}
