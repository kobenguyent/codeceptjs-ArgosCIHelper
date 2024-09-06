[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/peternguyentr?country.x=DE&locale.x=en_US)
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/peternguyew)

[![Covered by Argos Visual Testing](https://argos-ci.com/badge.svg)](https://app.argos-ci.com/kobenguyent/codeceptjs-ArgosCIHelper/reference)

# codeceptjs-ArgosCIHelper

CodeceptJS ArgosCIHelper helper.

## The philosophy of Argos
Argos handles its own 'commit status' or 'check' updates. When you approve screenshots, the status is automatically updated by Argos. 
Visual comparison does not take place during tests; it occurs separately within the Argos process.

![ArgosCI pipeline](https://github.com/user-attachments/assets/78fd7fd6-78b1-4940-9820-8690c68350cd)

![Approved changes](https://github.com/user-attachments/assets/f20396ab-4712-4d6c-aeab-8b99cdb4e087)

![Pipelines all green](https://github.com/user-attachments/assets/58734768-e5ae-4605-b13b-0c5a7f7acab6)


NPM package: <https://www.npmjs.com/package/codeceptjs-ArgosCIHelper>

## Installation

`npm i codeceptjs-ArgosCIHelper --save-dev`

## Configuration

This helper should be added in your codeceptjs config file: `codecept.conf.*`

Example:

```js
{
...
   helpers: {
     ArgosCIHelper: {
      require: 'codeceptjs-ArgosCIHelper',
      token: process.env.ARGOS_TOKEN,
      screenshotsDir: './output/screenshots',
    },
    }
   }
...
}
```

## Usage
- If there is no auto complete for `I` actor, try running `npx codeceptjs def`

```js
Feature('Visual Regression Testing');

Scenario('Test home page visual appearance', async ({ I }) => {
  I.amOnPage('/');
  await I.takeScreenshot('home-page');
});
```

Output

```bash
CodeceptJS v3.6.5 #StandWithUkraine
Using test root "/Users/t/Desktop/projects/ArgosCIHelper/test"
Helpers: Playwright, ArgosCIHelper
Plugins: screenshotOnFail, tryTo, retryFailedStep, retryTo, eachElement

Visual Regression Testing --
    [1]  Starting recording promises
    Timeouts: 
 › [Session] Starting singleton browser session
  Test home page visual appearance
    I am on page "/"
    I take screenshot "home-page"
    › Screenshot is saving to /Users/t/Desktop/projects/ArgosCIHelper/test/output/screenshots/home-page.png
Screenshot saved: ./output/screenshots/home-page.png
  ✔ OK in 1683ms


  OK  | 1 passed   // 10s
```
