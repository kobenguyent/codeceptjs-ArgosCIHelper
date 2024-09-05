import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
setHeadlessWhen(process.env.HEADLESS);

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
      token: process.env.ARGOS_TOKEN,
      screenshotsDir: './output/screenshots',
    },
  },
  include: {
    I: './steps_file'
  },
  name: 'test'
}
