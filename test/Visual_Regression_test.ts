Feature('Visual Regression Testing');

Scenario('Test home page visual appearance', async ({ I }) => {
  I.amOnPage('https://www.google.com/');
  await I.takeScreenshot('home-page');
});

