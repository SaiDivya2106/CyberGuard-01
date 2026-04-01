// datasetRaw.ts
// This module is only used in browser/bundler environments. Vite's raw loader
// will convert each import into a string containing the file contents. Node
// (ts-node) will never import this file, so the `?raw` syntax is harmless here.

// eslint-disable-next-line import/no-unresolved
import sms from "../../datasets/SMSSpamCollection?raw";
// eslint-disable-next-line import/no-unresolved
import url from "../../datasets/Malicious_URLs.csv?raw";
// eslint-disable-next-line import/no-unresolved
import fraud from "../../datasets/fraud_call.file?raw";

export const smsRaw = sms as string;
export const urlRaw = url as string;
export const fraudRaw = fraud as string;
