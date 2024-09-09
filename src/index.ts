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
    return 'local-commit';
  }
}

function getLatestCommitFromMain(): string {
  try {
    const commitHash = execSync('git rev-parse origin/main').toString().trim();
    return commitHash;
  } catch (error) {
    console.error('Failed to get the latest commit from main:', error);
    return '';
  }
}

function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    return branch;
  } catch (error) {
    console.error('Error getting the current branch:', error);
    return 'main';
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
    this.branch = process.env.GITHUB_REF || getCurrentBranch();
    this.buildId = process.env.GITHUB_SHA || this.commitHash;
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
      referenceBranch: 'main',
      referenceCommit: getLatestCommitFromMain(),
      buildName: this.buildId,
      files: files,
      branch: this.branch,
      // @ts-ignore
      build: this.buildId,
      token: this.argosToken,
      commit: process.env.GITHUB_SHA || this.commitHash,
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
