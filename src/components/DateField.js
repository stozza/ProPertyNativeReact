import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../config';

export default function DateField({ label, value, onChange, theme }) {
  const [open, setOpen] = useState(false);

  const pickerValue = useMemo(() => {
    const parsed = value ? new Date(value) : new Date();
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <Pressable style={[styles.button, { backgroundColor: theme.input, borderColor: theme.border }]} onPress={() => setOpen(true)}>
        <Text style={{ color: theme.text }}>{value ? formatDate(value) : 'Select date'}</Text>
      </Pressable>

      {open ? (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setOpen(false);
            if (event.type === 'dismissed' || !selectedDate) return;
            onChange(formatDate(selectedDate.toISOString()));
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
