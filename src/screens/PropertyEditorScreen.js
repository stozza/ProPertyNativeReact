import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const STATE_OPTIONS = ['Red', 'Amber', 'Green'];

export default function PropertyEditorScreen({ property, theme, onSave, onDelete }) {
  const isEditing = Boolean(property?.propertyId);
  const [form, setForm] = useState({
    name: property?.name || '',
    address: property?.address || '',
    type: property?.type || '',
    value: property?.value ? String(property.value) : '',
    state: property?.state || 'Red',
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Please enter property name');
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      Alert.alert('Validation', 'Please enter a valid property value');
      return;
    }

    onSave({
      ...property,
      name: form.name.trim(),
      address: form.address.trim(),
      type: form.type.trim(),
      value: form.value,
      state: form.state,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color: theme.muted }]}>Property Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        value={form.name}
        onChangeText={(value) => updateField('name', value)}
        placeholder="Bramble"
        placeholderTextColor={theme.muted}
      />

      <Text style={[styles.label, { color: theme.muted }]}>Address</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        value={form.address}
        onChangeText={(value) => updateField('address', value)}
        placeholder="Address"
        placeholderTextColor={theme.muted}
      />

      <Text style={[styles.label, { color: theme.muted }]}>Type</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        value={form.type}
        onChangeText={(value) => updateField('type', value)}
        placeholder="House"
        placeholderTextColor={theme.muted}
      />

      <Text style={[styles.label, { color: theme.muted }]}>Value</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        keyboardType="decimal-pad"
        value={form.value}
        onChangeText={(value) => updateField('value', value)}
        placeholder="300000"
        placeholderTextColor={theme.muted}
      />

      <Text style={[styles.label, { color: theme.muted }]}>State</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {STATE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.stateBtn,
              { borderColor: theme.border, backgroundColor: form.state === option ? theme.button : theme.cardSoft },
            ]}
            onPress={() => updateField('state', option)}
          >
            <Text style={{ color: form.state === option ? theme.buttonText : theme.text }}>{option}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable style={[styles.saveBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={save}>
        <Text style={{ color: theme.buttonText, fontWeight: '700' }}>{isEditing ? 'Save Property' : 'Add Property'}</Text>
      </Pressable>

      {isEditing ? (
        <Pressable style={[styles.deleteBtn, { borderColor: theme.error }]} onPress={onDelete}>
          <Text style={{ color: theme.error, fontWeight: '700' }}>Delete Property</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 24,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  row: {
    marginBottom: 16,
  },
  stateBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  saveBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
});
