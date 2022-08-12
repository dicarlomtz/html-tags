import { controller } from "../controllers/orchestratorController.js";

export const cli = () => {
  controller(process.argv[2]);
};
