import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCurrencySymbol } from '../config';
import TenancyCard from '../components/TenancyCard';
import { calculateMonthlyIncome } from '../utils/propertyUtils';

export default function PropertyDetailsScreen({ property, currency, theme, onAddTenancy, onEditTenancy, onEditProperty }) {
  if (!property) {
    return (
      <View style={[styles.emptyWrap, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Property not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.name, { color: theme.text }]}>{property.name}</Text>
        <Text style={[styles.meta, { color: theme.muted }]}>{property.address}</Text>
        <Text style={[styles.meta, { color: theme.text }]}>Type: {property.type}</Text>
        <Text style={[styles.meta, { color: theme.text }]}>State: {property.state}</Text>
        <Text style={[styles.meta, { color: theme.text }]}>Value: {getCurrencySymbol(currency)}{property.value || 0}</Text>
        <Text style={[styles.meta, { color: theme.text }]}>Monthly Income: {getCurrencySymbol(currency)}{calculateMonthlyIncome(property.tenancies).toFixed(2)}</Text>
      </View>

      <View style={styles.tenancyHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tenancies</Text>
        <View style={styles.actionsRow}>
          {typeof onEditProperty === 'function' ? (
            <Pressable style={[styles.addBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onEditProperty}>
              <Text style={{ color: theme.buttonText }}>Edit Property</Text>
            </Pressable>
          ) : null}
          <Pressable style={[styles.addBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onAddTenancy}>
            <Text style={{ color: theme.buttonText }}>Add Tenancy</Text>
          </Pressable>
        </View>
      </View>

      {(property.tenancies || []).map((tenancy) => (
        <TenancyCard
          key={String(tenancy.tenancyId)}
          tenancy={tenancy}
          theme={theme}
          onPress={() => onEditTenancy(tenancy)}
        />
      ))}

      {(!property.tenancies || property.tenancies.length === 0) ? (
        <Text style={{ color: theme.muted }}>No tenancies found.</Text>
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
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
  },
  tenancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
