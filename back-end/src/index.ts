import App from "./app";
import express from "express";
import config from "./config";

/********************************************************
 * APPLICATION MAIN
 ********************************************************/

const main = async () => {
  const app = new App(express(), Number(config.PORT));
  await app.initialize();

  app.checkDependencies();
  app.run();
};

/********************************************************
 * RUN APPLICATION
 ********************************************************/

main().catch(console.log);
