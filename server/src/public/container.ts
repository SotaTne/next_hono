import { container } from "tsyringe";
export function createChildContainer() {
  return container.createChildContainer();
}
export { container };
