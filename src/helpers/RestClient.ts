import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

class RestClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create a new axios instance
    this.axiosInstance = axios.create();
  }

  // POST request
  async makePostRequest<T>(url: string, payload: T, headers: AxiosRequestHeaders): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, payload, { headers });
      return response.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  // PUT request
  async makePutRequest<T>(url: string, payload: T, headers: AxiosRequestHeaders): Promise<any> {
    try {
      const response = await this.axiosInstance.put(url, payload, { headers });
      return response.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  // GET request
  async makeGetRequest(url: string, headers: AxiosRequestHeaders): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  // DELETE request
  async makeDeleteRequest(url: string, headers: AxiosRequestHeaders): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(url, { headers });
      return response.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default RestClient;
