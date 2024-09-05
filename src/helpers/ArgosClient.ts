import RestClient from './RestClient';

interface Screenshot {
  key: string;
  name: string;
}

interface TestReportMetadata {
  status: string;
}

interface BuildMetadata {
  testReport: TestReportMetadata;
}

interface ArgosBuildPayload {
  screenshots: Screenshot[];
  metadata: BuildMetadata;
}

class ArgosClient {
  private restClient: RestClient;
  private baseUrl: string;
  private authToken: string;

  constructor(authToken: string) {
    this.restClient = new RestClient();
    this.baseUrl = 'https://api.argos-ci.com/v2/builds';
    this.authToken = authToken;
  }

  // Update the build with screenshots and metadata
  async updateBuild(buildId: string, payload: ArgosBuildPayload): Promise<any> {
    const url = `${this.baseUrl}/${buildId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.authToken}`,
    };

    try {
      // @ts-ignore
      const response = await this.restClient.makePutRequest(url, payload, headers);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to update Argos build: ${error.message}`);
    }
  }
}

export default ArgosClient;
