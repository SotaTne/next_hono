import { Router } from "@server/src/adapter/controller/router";
import { container } from "tsyringe";

const instance = container.resolve(Router);

export default instance.route();
