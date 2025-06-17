export {};

declare global {
  interface Window {
    http: {
      request: (config: any) => Promise<any>;
      setCookie: (config: string, cookie: string) => Promise<any>;
      getCookie: (config: string) => Promise<any>;
    };
  }
}
