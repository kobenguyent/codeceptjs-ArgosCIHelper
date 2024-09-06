import { Helper } from 'codeceptjs';
import fs from 'fs';
import { upload,  } from '@argos-ci/core';
import { execSync } from 'node:child_process';
import ArgosClient from './helpers/ArgosClient';

function getCommitHash(): string {
  try {
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    return commitHash;
  } catch (error) {
    console.error('Failed to get commit hash:', error);
    return 'local-commit'; // Default value if not in a Git repository
  }
}

interface ArgosHelperConfig {
  token: string;
  screenshotsDir?: string;
}

class ArgosCIHelper extends Helper {
  private argosToken: string;
  private screenshotsDir: string;
  private branch: string;
  private buildId: string;
  private commitHash: string;

  constructor(config: ArgosHelperConfig) {
    super(config);
    this.commitHash = getCommitHash();
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
    console.log('Uploading screenshots to Argos-CI with commit:', this.commitHash);

    // @ts-ignore
    return await upload({
      branch: this.branch,
      referenceBranch: this.branch,
      buildName: this.buildId,
      token: this.argosToken,
      commit: this.commitHash,
      files: files,
    });
  }

  async _finishTest(): Promise<void> {
    const files = fs.readdirSync(this.screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .map(file => `${this.screenshotsDir}/${file}`);

    if (files.length > 0) {
      const result = await this.uploadScreenshots(files);
      console.log('Argos-CI upload result:', result);

      const authToken = this.argosToken
      // @ts-ignore
      const buildId = result.build.id
      // @ts-ignore
      const screenshotInfo = result.screenshots[0]

      const payload = {
        screenshots: [
          {
            key: screenshotInfo.hash,
            name: screenshotInfo.name,
          },
        ],
        metadata: {
          testReport: {
            status: 'passed',
          },
        },
      };

      const argosClient = new ArgosClient(authToken);

      try {
        const response = await argosClient.updateBuild(buildId, payload);
        console.log('Build updated successfully:', response);
      } catch (error: any) {
        console.error('Error updating build:', error.message);
        throw Error(error.message)
      }
    }
  }
}

export = ArgosCIHelper
