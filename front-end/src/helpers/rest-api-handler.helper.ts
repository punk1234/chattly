import axios, { AxiosInstance, Method } from "axios";
import { appStorage, LocalStorage } from "./local-storage.helper";
import config from "../config";

class ApiHandler {

  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    // MAYBE INCLUDE SOME NECESSARY HEADERS HERE
    this.instance = axios.create({ baseURL });
  }

  async send(method: HttpMethod, apiUrlPath: string, payload?: Record<string, any>, authData?: object): Promise<any> {
    try {
      const response = await this.instance.request({
        url: apiUrlPath,
        method,
        data: payload || undefined,
        headers: authData
      });
      
      return [true, response.data];
    } catch(err: any) {
      console.log(err);
      if(!err.response) {
        // LOOKING LIKE SERVICE UNAVAILABLE
        console.log("SERVICE UNAVAILABLE");
        return [, { "message": "SERVICE UNAVAILABLE!!!" }];
      }

      if(err.response.status === 400 && err.response.data?.data?.errors) {
        // const message = err.response.data?.data?.errors.map((item: any) => {
        //   return `<div>${item.message}</div>`;
        // }).join("");

        return [, { message: err.response.data?.data?.errors[0].message }];
      }

      console.log(err.response.data?.message);
      console.log(err.response.data?.error);

      return [, err.response.data];
    }
  }

  sendWithAuthToken(method: HttpMethod, apiUrlPath: string, payload?: Record<string, any>): Promise<any> {
    return this.send(
      method,
      apiUrlPath,
      payload,
      { "Authorization": `Bearer ${appStorage.get(LocalStorage.AUTH_TOKEN_KEY)}` } 
    );
  }

//   private async sendWithAuthToken(method: HttpMethod, apiUrlPath: string, payload: Record<string, any>, authToken: string): Promise<string> {
//     const response = this.instance.request({
//       url: apiUrlPath,
//       method,
//       data: payload,
//       headers: { "Authorization": `Bearer ${authToken}` }
//     });
//   }
}

type HttpMethod = Method;

export const apiHandler = new ApiHandler(config.CHATTLY_API_BASE_URL);