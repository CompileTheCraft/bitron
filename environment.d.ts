declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      PREFIX: string;
      OWNERID: string;
      COOWNERID: string;
      DEVGUILDID: string;
      DEVCHANNELID: string;
      ERRORCHANNELID: string;
      BUGREPORTCHANNELID: string;
      FEATUREREQUESTCHANNELID: string;
      GIPHYAPIKEY: string;
      DATABASE_URL: string;
    }
  }
}

export {};
