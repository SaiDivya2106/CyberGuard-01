import { useMemo } from "react";
import { motion } from "framer-motion";
import { sampleSms, sampleUrls, sampleFraud, smsDataset, urlDataset, fraudDataset } from "../lib/datasetUtils";

const DataExplorer = () => {
  const smsCount = smsDataset.length;
  const urlCount = urlDataset.length;
  const fraudCount = fraudDataset.length;

  const smsSample = useMemo(() => sampleSms(10), []);
  const urlSample = useMemo(() => sampleUrls(10), []);
  const fraudSample = useMemo(() => sampleFraud(10), []);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dataset Explorer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the training data that powers the message and link analysis features.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-shadow rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold">SMS &amp; Fraud Messages</h2>
          <p className="text-sm text-muted-foreground mb-2">Total entries: {smsCount + fraudCount}</p>
          <ul className="list-disc pl-5 text-xs">
            {smsSample.map((e, i) => (
              <li key={i}>
                <span className="font-mono">[{e.label}]</span> {e.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-shadow rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold">Malicious URLs</h2>
          <p className="text-sm text-muted-foreground mb-2">Total entries: {urlCount}</p>
          <ul className="list-disc pl-5 text-xs">
            {urlSample.map((e, i) => (
              <li key={i}>
                <span className={e.label === "bad" ? "text-destructive" : "text-success"}>{e.label}</span> {e.url}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-shadow rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold">Fraud Call Messages</h2>
          <p className="text-sm text-muted-foreground mb-2">Total entries: {fraudCount}</p>
          <ul className="list-disc pl-5 text-xs">
            {fraudSample.map((e, i) => (
              <li key={i}>
                <span className={e.label === "fraud" ? "text-destructive" : "text-success"}>{e.label}</span> {e.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default DataExplorer;
