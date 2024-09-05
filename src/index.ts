import { Helper } from 'codeceptjs';
import fs from 'fs';
import { upload } from '@argos-ci/core';

interface ArgosHelperConfig {
  token: string;
  screenshotsDir?: string;
}

class ArgosCIHelper extends Helper {
  private readonly argosToken: string;
  private readonly screenshotsDir: string;
  private readonly branch: string;
  private buildId: string;

  constructor(config: ArgosHelperConfig) {
    super(config);
    this.argosToken = config.token;
    this.screenshotsDir = config.screenshotsDir || './output/screenshots';
    this.branch = process.env.GITHUB_REF || 'main';
    this.buildId = process.env.GITHUB_SHA || 'local-build';
  }

  async takeScreenshot(name: string): Promise<string> {
    const page = this.helpers.Puppeteer || this.helpers.Playwright;
    if (!page) {
      throw new Error('This helper requires Puppeteer or Playwright!');
    }

    const filePath = `${this.screenshotsDir}/${name}.png`;

    await page.saveScreenshot(filePath);
    console.log(`Screenshot saved: ${filePath}`);

    return filePath;
  }

  async uploadScreenshots(files: string[]): Promise<void> {
    console.log('Uploading screenshots to Argos-CI...');

    const result = await upload({
      branch: this.branch,
      // @ts-ignore
      build: this.buildId,
      token: this.argosToken,
      commit: process.env.GITHUB_SHA || 'local-commit',
      paths: files,
    });

    console.log('Argos-CI upload result:', result);
  }

  async _finishTest(): Promise<void> {
    const files = fs.readdirSync(this.screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .map(file => `${this.screenshotsDir}/${file}`);

    if (files.length > 0) {
      await this.uploadScreenshots(files);
    }
  }
}

export = ArgosCIHelper
