Feature('Visual Regression');

Scenario('home page visual appearance upload screenshot', async ({ I }) => {
  I.amOnPage('?diff2');
  const res = await I.takeScreenshot('home-page');
});

