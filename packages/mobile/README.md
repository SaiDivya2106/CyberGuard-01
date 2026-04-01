# Mobile Client (React Native / Expo)

This directory is intended to house a mobile application that consumes the
shared threat‑analysis logic and optionally talks to the local server API.

The quickest way to get started is with Expo:

```bash
cd packages/mobile
npx expo init .
# choose the "blank (TypeScript)" template

# install any dependencies required to import from the web project
npm install ../..  # or add a proper workspace reference
```

Then edit `App.tsx` (shown below) to call the shared functions or hit the
`/analyze` endpoint exposed by the local server.

## Example App.tsx

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { analyzeMessage } from '../../src/shared';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);

  const runAnalysis = () => {
    const r = analyzeMessage(text);
    setResult(r);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter SMS/URL:</Text>
      <TextInput value={text} onChangeText={setText} style={{ borderWidth: 1, marginVertical: 10 }} />
      <Button title="Analyze" onPress={runAnalysis} />
      {result && (
        <View style={{ marginTop: 20 }}>
          <Text>Risk: {result.riskScore}</Text>
          <Text>Classifier says: {result.classification}</Text>
        </View>
      )}
    </View>
  );
}
```

### Real‑time device integration

After bootstrapping the Expo project, you can add packages like
`expo-sms` (Android only) or `react-native-sms-listener` to intercept incoming
messages, and then call the `analyzeMessage` function or POST to the server.

For listener examples see:
- https://github.com/tkporter/react-native-sms-listener
- https://docs.expo.dev/versions/latest/sdk/sms/

Logs and results can be forwarded to the main dashboard via the backend’s
WebSocket or Supabase Realtime channel.
