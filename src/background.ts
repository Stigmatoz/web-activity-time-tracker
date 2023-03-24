import browser from "webextension-polyfill";

console.log("Start background script");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});
