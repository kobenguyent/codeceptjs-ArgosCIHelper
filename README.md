[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/peternguyentr?country.x=DE&locale.x=en_US)
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/peternguyew)

# codeceptjs-ArgosCIHelper

CodeceptJS ArgosCIHelper helper.

NPM package: <https://www.npmjs.com/package/codeceptjs-ArgosCIHelper>

## Installation

`npm i codeceptjs-ArgosCIHelper --save-dev`

## Configuration

This helper should be added in your codeceptjs config file: `codecept.conf.*`

Example:

```
{
...
   helpers: {
     ArgosCIHelper: {
      require: 'codeceptjs-ArgosCIHelper',
    }
   }
...
}
```

## Usage
- If there is no auto complete for `I` actor, try running `npx codeceptjs def`

```
Feature('Visual Regression Testing');

Scenario('Test home page visual appearance', async ({ I }) => {
  I.amOnPage('/');
  await I.takeScreenshot('home-page');
});
```

Output

```
CodeceptJS v3.6.5 #StandWithUkraine
Using test root "/Users/thanh.nguyen/Desktop/projects/ArgosCIHelper/test"
Helpers: Playwright, ArgosCIHelper
Plugins: screenshotOnFail, tryTo, retryFailedStep, retryTo, eachElement

Visual Regression Testing --
    [1]  Starting recording promises
    Timeouts: 
 › [Session] Starting singleton browser session
  Test home page visual appearance
    I am on page "/"
    I take screenshot "home-page"
    › Screenshot is saving to /Users/thanh.nguyen/Desktop/projects/ArgosCIHelper/test/output/screenshots/home-page.png
Screenshot saved: ./output/screenshots/home-page.png
  ✔ OK in 1683ms


  OK  | 1 passed   // 10s
Uploading screenshots to Argos-CI...

```
