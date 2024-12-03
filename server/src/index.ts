import "reflect-metadata";

import { Router } from "@server/src/controller/router";
import { container } from "@server/src/public/container";

const instance = container.resolve(Router);

export default instance.route();
