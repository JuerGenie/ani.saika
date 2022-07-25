import log, { levels } from "loglevel";
import { reg, apply } from "loglevel-plugin-prefix";

// log.setLevel(log.levels.DEBUG);
reg(log);

export function getLogger(name: string, level: log.LogLevelDesc = levels.INFO) {
  const logger = apply(log.getLogger(name), {
    template: "[%l][%n]",
  });
  logger.setLevel(level);
  return logger;
}
