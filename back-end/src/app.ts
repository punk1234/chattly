import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import C from "./constants";
import config from "./config";
import { errorHandler } from "./middlewares";
import { BadRequestError } from "./exceptions";
import { Logger, LoggerStream } from "./helpers";
import { IAppOptions, IDatabaseConnector } from "./interfaces";
import MongoDbConnector from "./database/connectors/mongodb.connector";

/**
 * @class App
 */
export default class App {
  readonly engine: Application;
  readonly port: number;
  readonly inProduction: boolean;

  options: IAppOptions;
  connection: any;

  protected mongoConnector!: IDatabaseConnector;

  /**
   * @constructor
   *
   * @param {Application} engine
   * @param {number} port
   * @param {IAppOptions} options
   */
  constructor(engine: Application, port: number, options?: IAppOptions) {
    this.engine = engine;
    this.port = port;
    this.options = options || {};
    this.inProduction = process.env.NODE_ENV === C.Environment.PRODUCTION;
  }

  /**
   * @method setupDependencies
   * @async
   */
  private async setupDependencies(): Promise<void> {
    this.mongoConnector = new MongoDbConnector(mongoose);
    await this.mongoConnector.connect(config.MONGODB_URL);
  }

  /**
   * @method checkDependencies
   * @instance
   */
  checkDependencies(): void {
    if (!MongoDbConnector.getClient()) {
        throw new Error("Initialize DB!!!");
      }
  }

  /**
   * @method configure
   */
  protected configure(): void {
    const {
      urlEncodeExtended = true,
      requestSizeLimit = "20mb",
      compression: compressionOption,
      cors: corsOption,
      errors: errorOption,
    } = this.options;

    this.engine.use(helmet());
    this.engine.use(helmet.hidePoweredBy());
    this.engine.use(cookieParser());
    this.engine.use(cors(corsOption));
    this.engine.use(compression(compressionOption));
    this.engine.use(express.json({ limit: requestSizeLimit }));

    this.engine.use((err: any, _req: any, _res: any, next: any) => {
      if (err instanceof SyntaxError && "body" in err) {
        throw new BadRequestError("Invalid request body");
      }

      next();
    });

    this.engine.use(express.urlencoded({ limit: requestSizeLimit, extended: urlEncodeExtended }));
    this.engine.use(morgan("combined", { stream: LoggerStream }));

    // REPLACE WITH RouterManager.installRoutes METHOD
    // this.installRoutes();

    this.engine.use(errorHandler(errorOption?.includeStackTrace || !this.inProduction));
  }

  /**
   * @initialize
   */
  async initialize(): Promise<void> {
    await this.setupDependencies();

    this.configure();
  }

  /**
   * @method run
   */
  run(): void {
    this.connection = this.engine.listen(this.port, () => {
      Logger.info(`App now running on port ${this.port}`);
    });
  }

  /**
   * @method close
   */
  close(): void {
    this.connection?.close();
  }
}
