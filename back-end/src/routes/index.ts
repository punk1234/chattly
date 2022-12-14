import path from "path";
import meRouter from "./me.route";
import rootRouter from "./root.route";
import authRouter from "./auth.route";
import { Application } from "express";
import { apiRequestValidator, notFoundHandler } from "../middlewares";

const API_SPEC_PATH: string = path.resolve(__dirname, "../../spec/api-spec.yml");

/**
 * @class RouteManager
 * @classdesc
 */
export default class RouteManager {
  /**
   * @method installRoutes
   * @static
   * @param {Application} app
   */
  static installRoutes(app: Application): void {
    app.use(rootRouter);
    app.use(apiRequestValidator(API_SPEC_PATH));
    app.use("/auth", authRouter);
    app.use("/me", meRouter);
    app.use(notFoundHandler);
  }
}
