import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import C from "./constants";
import { IAppOptions } from "./interfaces";
import { errorHandler } from "./middlewares";
import { BadRequestError } from "./exceptions";
import { Logger, LoggerStream } from "./helpers";

/**
 * @class App
 */
export abstract class App {
  readonly engine: Application;
  protected readonly port: number;
  readonly inProduction: boolean;
  protected options: IAppOptions;
  protected connection: any;

  constructor(engine: Application, port: number, options?: IAppOptions) {
    this.engine = engine;
    this.port = port;
    this.options = options || {};
    this.inProduction = process.env.NODE_ENV === C.Environment.PRODUCTION;
  }

  protected abstract setupDependencies(): Promise<void>;

  protected abstract installRoutes(): void;

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

    this.installRoutes();

    this.engine.use(errorHandler(errorOption?.includeStackTrace || !this.inProduction));
  }

  async initialize() {
    await this.setupDependencies();
    this.configure();
  }

  run(): void {
    this.connection = this.engine.listen(this.port, () => {
      Logger.info(`App now running on port ${this.port}`);
    });
  }

  close() {
    this.connection?.close();
  }
}
