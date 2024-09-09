import { Helper } from 'codeceptjs';
import fs from 'fs';
import { upload } from '@argos-ci/core';
import { execSync } from 'node:child_process';
import ArgosClient from './helpers/ArgosClient';

function getCommitHash(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.error('Failed to get commit hash:', error);
    return 'local-commit';
  }
}

function getLatestCommitFromMain(): string {
  try {
    return execSync('git rev-parse origin/main').toString().trim();
  } catch (error) {
    console.error('Failed to get the latest commit from main:', error);
    return '';
  }
}

function getCurrentBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    console.error('Error getting the current branch:', error);
    return 'main';
  }
}

interface ArgosHelperConfig {
  token: string;
  screenshotsDir?: string;
}

interface ArgosUploadResult {
  build: {
    id: string;
  };
  screenshots: {
    hash: string;
    name: string;
  }[];
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

  private getPageHelper() {
    const page = this.helpers.Puppeteer || this.helpers.Playwright;
    if (!page) {
      throw new Error('This helper requires Puppeteer or Playwright!');
    }
    return page;
  }

  async takeScreenshot(name: string): Promise<string> {
    const page = this.getPageHelper();
    const filePath = `${this.screenshotsDir}/${name}.png`;

    await page.saveScreenshot(filePath);
    console.log(`Screenshot saved: ${filePath}`);

    return filePath;
  }

  async uploadScreenshots(files: string[]): Promise<void> {
    console.log('Uploading screenshots to Argos-CI with commit:', this.commitHash);

    try {
      const result: ArgosUploadResult = await upload({
        referenceBranch: 'ref/heads/main',
        referenceCommit: getLatestCommitFromMain(),
        buildName: this.buildId,
        files,
        branch: this.branch,
        // @ts-ignore
        build: this.buildId,
        token: this.argosToken,
        commit: process.env.GITHUB_SHA || this.commitHash,
      });

      console.log('Upload result:', result);
      await this.updateArgosBuild(result);
    } catch (error) {
      console.error('Error uploading screenshots to Argos-CI:', error);
      throw new Error('Screenshot upload failed');
    }
  }

  private async updateArgosBuild(result: ArgosUploadResult): Promise<void> {
    const { build, screenshots } = result;
    const authToken = this.argosToken;
    const buildId = build.id;
    const payload = {
      screenshots: screenshots.map(({ hash, name }) => ({
        key: hash,
        name: name,
      })),
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
      console.error('Error updating Argos build:', error.message);
      throw new Error(`Build update failed: ${error.message}`);
    }
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

export = ArgosCIHelper;
