import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateField from '../components/DateField';

export default function TenancyEditorScreen({ tenancy, theme, onSave, onDelete }) {
  const isEditing = Boolean(tenancy?.tenancyId);

  const [form, setForm] = useState(() => ({
    type: tenancy?.type || '',
    status: tenancy?.status || 'Available',
    tenantName: tenancy?.tenantName || '',
    contactNumber: tenancy?.contactNumber || '',
    contractStartDate: tenancy?.contractStartDate || '',
    contractDuration: tenancy?.contractDuration ? String(tenancy.contractDuration) : '',
    monthlyCost: tenancy?.monthlyCost ? String(tenancy.monthlyCost) : '',
    paymentDateValue: tenancy?.paymentDate ? String(tenancy.paymentDate) : '',
    paymentDatePicker: tenancy?.paymentDate ? `2026-01-${String(tenancy.paymentDate).padStart(2, '0')}` : '',
  }));

  const contractEndDate = useMemo(() => {
    if (!form.contractStartDate || !form.contractDuration) return '';
    const start = new Date(form.contractStartDate);
    const months = parseInt(form.contractDuration, 10);
    if (Number.isNaN(start.getTime()) || Number.isNaN(months)) return '';
    const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
    return end.toISOString().split('T')[0];
  }, [form.contractStartDate, form.contractDuration]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    if (!form.type.trim()) {
      Alert.alert('Validation', 'Please enter tenancy type');
      return;
    }

    if (!form.monthlyCost || Number(form.monthlyCost) <= 0) {
      Alert.alert('Validation', 'Please enter a valid monthly cost');
      return;
    }

    if (form.status === 'Contracted') {
      if (!form.tenantName.trim()) {
        Alert.alert('Validation', 'Please enter tenant name');
        return;
      }
      if (!form.contactNumber.trim()) {
        Alert.alert('Validation', 'Please enter contact number');
        return;
      }
      if (!form.contractStartDate) {
        Alert.alert('Validation', 'Please select a contract start date');
        return;
      }
      if (!form.contractDuration || Number(form.contractDuration) <= 0) {
        Alert.alert('Validation', 'Please enter contract duration in months');
        return;
      }
    }

    onSave({
      ...tenancy,
      type: form.type.trim(),
      status: form.status,
      tenantName: form.status === 'Contracted' ? form.tenantName.trim() : '',
      contactNumber: form.status === 'Contracted' ? form.contactNumber.trim() : '',
      contractStartDate: form.status === 'Contracted' ? form.contractStartDate : '',
      contractDuration: form.status === 'Contracted' ? form.contractDuration : '',
      monthlyCost: form.monthlyCost,
      paymentDate: form.paymentDateValue,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color: theme.muted }]}>Type</Text>
      <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} value={form.type} onChangeText={(value) => updateField('type', value)} placeholder="Room 1" placeholderTextColor={theme.muted} />

      <Text style={[styles.label, { color: theme.muted }]}>Status</Text>
      <View style={styles.statusRow}>
        {['Available', 'Contracted'].map((status) => (
          <Pressable
            key={status}
            style={[
              styles.statusBtn,
              { borderColor: theme.border, backgroundColor: form.status === status ? theme.button : theme.cardSoft },
            ]}
            onPress={() => updateField('status', status)}
          >
            <Text style={{ color: form.status === status ? theme.buttonText : theme.text }}>{status}</Text>
          </Pressable>
        ))}
      </View>

      {form.status === 'Contracted' ? (
        <>
          <Text style={[styles.label, { color: theme.muted }]}>Tenant Name</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} value={form.tenantName} onChangeText={(value) => updateField('tenantName', value)} placeholder="Tenant name" placeholderTextColor={theme.muted} />

          <Text style={[styles.label, { color: theme.muted }]}>Contact Number</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} value={form.contactNumber} onChangeText={(value) => updateField('contactNumber', value)} placeholder="Contact number" placeholderTextColor={theme.muted} />

          <DateField label="Contract Start Date" value={form.contractStartDate} onChange={(value) => updateField('contractStartDate', value)} theme={theme} />

          <Text style={[styles.label, { color: theme.muted }]}>Contract Duration (months)</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} keyboardType="number-pad" value={form.contractDuration} onChangeText={(value) => updateField('contractDuration', value)} placeholder="12" placeholderTextColor={theme.muted} />

          {contractEndDate ? <Text style={[styles.meta, { color: theme.text }]}>Contract End Date: {contractEndDate}</Text> : null}
        </>
      ) : null}

      <Text style={[styles.label, { color: theme.muted }]}>Monthly Cost</Text>
      <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} keyboardType="decimal-pad" value={form.monthlyCost} onChangeText={(value) => updateField('monthlyCost', value)} placeholder="650" placeholderTextColor={theme.muted} />

      <DateField
        label="Payment Date"
        value={form.paymentDatePicker}
        onChange={(value) => {
          updateField('paymentDatePicker', value);
          const date = new Date(value);
          updateField('paymentDateValue', Number.isNaN(date.getTime()) ? '' : String(date.getDate()));
        }}
        theme={theme}
      />
      {form.paymentDateValue ? <Text style={[styles.meta, { color: theme.muted }]}>Payment day saved as: {form.paymentDateValue}</Text> : null}

      <Pressable style={[styles.saveBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={save}>
        <Text style={{ color: theme.buttonText, fontWeight: '700' }}>{isEditing ? 'Save Tenancy' : 'Add Tenancy'}</Text>
      </Pressable>

      {isEditing ? (
        <Pressable style={[styles.deleteBtn, { borderColor: theme.error }]} onPress={onDelete}>
          <Text style={{ color: theme.error, fontWeight: '700' }}>Delete Tenancy</Text>
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
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  meta: {
    marginBottom: 10,
  },
  saveBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
});
