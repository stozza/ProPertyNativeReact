import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { CURRENCY_OPTIONS } from '../config';

export default function SettingsScreen({ settings, theme, onSave }) {
  const [currency, setCurrency] = useState(settings.currency);
  const [darkTheme, setDarkTheme] = useState(settings.darkTheme);
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl);

  const save = () => {
    if (!apiBaseUrl.trim()) {
      Alert.alert('Validation', 'Please provide API base URL');
      return;
    }
    onSave({ currency, darkTheme, apiBaseUrl: apiBaseUrl.trim() });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.label, { color: theme.muted }]}>Default Currency</Text>
      <View style={styles.row}>
        {CURRENCY_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.currencyBtn,
              { borderColor: theme.border, backgroundColor: currency === option ? theme.button : theme.cardSoft },
            ]}
            onPress={() => setCurrency(option)}
          >
            <Text style={{ color: currency === option ? theme.buttonText : theme.text }}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.toggleRow}>
        <Text style={{ color: theme.text, fontWeight: '600' }}>Dark Theme</Text>
        <Switch value={darkTheme} onValueChange={setDarkTheme} />
      </View>

      <Text style={[styles.label, { color: theme.muted }]}>API Base URL (LAN for iPhone)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        value={apiBaseUrl}
        onChangeText={setApiBaseUrl}
        placeholder="http://192.168.1.10:3000"
        placeholderTextColor={theme.muted}
      />

      <Pressable style={[styles.saveBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={save}>
        <Text style={{ color: theme.buttonText, fontWeight: '700' }}>Save Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  currencyBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  saveBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
