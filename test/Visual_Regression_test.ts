Feature('Visual Regression Testing');

Scenario('Test home page visual appearance', async ({ I }) => {
  I.amOnPage('/');
  await I.takeScreenshot('home-page');
});

