import { OpenAPIHono } from "@hono/zod-openapi";
import { type Transform } from "tsyringe/dist/typings/types";

export interface IBaseController {
  route(): OpenAPIHono;
}

export class HonoControllerTransformer
  implements Transform<IBaseController, OpenAPIHono>
{
  public transform(controller: IBaseController): OpenAPIHono {
    return controller.route();
  }
}
