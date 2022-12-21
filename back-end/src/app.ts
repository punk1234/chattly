import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import compression from "compression";
import { IncomingMessage } from "http";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { AddressInfo, WebSocket, WebSocketServer, RawData } from "ws";

import C from "./constants";
import config from "./config";
import RouteManager from "./routes";
import { errorHandler } from "./middlewares";
import { BadRequestError } from "./exceptions";
import { Logger, LoggerStream } from "./helpers";
import { IAppOptions, IDatabaseConnector } from "./interfaces";
import MongoDbConnector from "./database/connectors/mongodb.connector";
import { webSocketManager } from "./services/managers/web-socket.manager";

/**
 * @class App
 */
export default class App {
  readonly engine: Application;
  readonly port: number;
  readonly inProduction: boolean;

  options: IAppOptions;
  connection: any;
  webSocketServer: WebSocketServer;

  protected mongoConnector!: IDatabaseConnector;

  /**
   * @constructor
   *
   * @param {Application} engine
   * @param {number} port
   * @param {number} webSocketPort
   * @param {IAppOptions} options
   */
  constructor(engine: Application, port: number, webSocketPort: number, options?: IAppOptions) {
    this.engine = engine;
    this.port = port;
    this.options = options || {};
    this.inProduction = process.env.NODE_ENV === C.Environment.PRODUCTION;

    this.webSocketServer = new WebSocketServer({ port: webSocketPort });
    Logger.info(
      `WebSocket running on port ${(this.webSocketServer.address() as AddressInfo).port}`,
    );
  }

  /**
   * @method setupDependencies
   * @async
   * @instance
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
   * @instance
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

    this.enableWebSocket();

    RouteManager.installRoutes(this.engine);

    this.engine.use(errorHandler(errorOption?.includeStackTrace || !this.inProduction));
  }

  /**
   * @method enableWebSocket
   * @instance
   */
  private enableWebSocket(): void {
    this.webSocketServer.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      // MAYBE USE `if(!req.url) { ws.terminate() or ws.close() }`
      
      const USERNAME: string = (req.url as string).substr(1);
      // PROBABLY CHECK THAT USER WITH USERNAME EXISTS!!!

      webSocketManager.addConnection(USERNAME, ws);

      ws.on("message", function message(data: RawData) {
        console.log("[Message Received] " + data.toString());
      });
    });
  }

  /**
   * @initialize
   * @async
   * @instance
   */
  async initialize(): Promise<void> {
    await this.setupDependencies();

    this.configure();
  }

  /**
   * @method run
   * @instance
   */
  run(): void {
    this.connection = this.engine.listen(this.port, () => {
      Logger.info(`App now running on port ${this.port}`);
    });
  }

  /**
   * @method close
   * @instance
   */
  close(): void {
    this.connection?.close();
  }
}
