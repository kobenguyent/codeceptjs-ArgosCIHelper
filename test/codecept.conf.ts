import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://applitools.com/helloworld',
      show: false
    },
    ArgosCIHelper: {
      require: '../src/index.ts',
      token: process.env.ARGOS_TOKEN, // Argos-CI API Token
      screenshotsDir: './output/screenshots', // Optional screenshot directory
    },
  },
  include: {
    I: './steps_file'
  },
  name: 'test'
}
