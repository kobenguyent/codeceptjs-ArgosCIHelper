Feature('Visual Regression Testing');

Scenario('Test home page visual appearance', async ({ I }) => {
  I.amOnPage('/');
  const res = await I.takeScreenshot('home-page');
});

