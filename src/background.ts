import Browser from "webextension-polyfill";
import { initTracker } from "./tracker";
import { logger } from "./compositions/logger";

logger.log("Start background script");

Browser.runtime.onInstalled.addListener((details) => {
  logger.log("Extension installed:", details);
});

initTracker();