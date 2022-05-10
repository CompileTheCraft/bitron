class ConfigProvider {
  public token: string = process.env.TOKEN!;
  public prefix: string = process.env.PREFIX!;
  public ownerID: string = process.env.OWNERID!;
  public coOwnerID: string = process.env.COOWNERID!;
  public devGuildID: string = process.env.DEVGUILDID!;
  public devChannelID: string = process.env.DEVCHANNELID!;
  public errorChannelID: string = process.env.ERRORCHANNELID!;
  public bugReportChannelID: string = process.env.BUGREPORTCHANNELID!;
  public featureRequestChannelID: string = process.env.FEATUREREQUESTCHANNELID!;
  public giphyApi: string = process.env.GIPHYAPIKEY!;
  public databaseUrl: string = process.env.DATABASE_URL!;
}

export default ConfigProvider;
