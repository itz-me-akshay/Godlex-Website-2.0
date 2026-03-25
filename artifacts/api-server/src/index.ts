import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 0;

if (port > 0) {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
} else {
  logger.info("Serverless mode: No PORT detected, the platform will manage the lifecycle.");
}

