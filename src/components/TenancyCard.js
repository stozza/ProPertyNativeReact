import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TenancyCard({ tenancy, theme, onPress }) {
  return (
    <Pressable style={[styles.card, { backgroundColor: theme.cardSoft, borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: theme.text }]}>{tenancy.type}</Text>
        <Text style={[styles.status, { color: tenancy.status === 'Contracted' ? theme.success : theme.warning }]}>
          {tenancy.status}
        </Text>
      </View>
      {tenancy.tenantName ? <Text style={[styles.meta, { color: theme.muted }]}>{tenancy.tenantName}</Text> : null}
      <Text style={[styles.meta, { color: theme.muted }]}>Cost: {tenancy.monthlyCost || 0}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
  },
});
