// placeholder mobile app that uses shared analysis logic
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { analyzeMessage } from '../../src/shared';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);

  const runAnalysis = () => {
    const r = analyzeMessage(text);
    setResult(r);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Paste suspicious message or URL:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Analyze" onPress={runAnalysis} />
      {result && (
        <View style={styles.result}>
          <Text>Risk Score: {result.riskScore}</Text>
          <Text>Classification: {result.classification}</Text>
          {result.spamProbability != null && (
            <Text>Spam probability: {(result.spamProbability*100).toFixed(1)}%</Text>
          )}
          {result.threats && result.threats.map((t: string, i: number) => (
            <Text key={i} style={styles.threat}>{t}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 8, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 8, minHeight: 80, marginBottom: 12 },
  result: { marginTop: 20 },
  threat: { fontSize: 12, color: 'red' },
});
