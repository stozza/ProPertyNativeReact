import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCurrencySymbol } from '../config';
import { calculateMonthlyIncome } from '../utils/propertyUtils';

export default function PropertyCard({ property, currency, theme, onPress }) {
  const monthlyIncome = calculateMonthlyIncome(property.tenancies).toFixed(2);

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: theme.text }]}>{property.name}</Text>
        <Text style={[styles.state, { color: theme.muted }]}>{property.state || 'Unknown'}</Text>
      </View>
      <Text style={[styles.meta, { color: theme.muted }]}>{property.address}</Text>
      <Text style={[styles.income, { color: theme.text }]}>
        Monthly Income: {getCurrencySymbol(currency)}{monthlyIncome}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  state: {
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
  },
  income: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});
