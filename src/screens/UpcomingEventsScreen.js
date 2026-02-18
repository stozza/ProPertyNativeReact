import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function UpcomingEventsScreen({ events, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.propertyName}-${item.tenancyType}-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.cardSoft, borderColor: theme.border }]}> 
            <Text style={[styles.title, { color: theme.text }]}>{item.propertyName} - {item.tenancyType}</Text>
            <Text style={{ color: theme.muted }}>Tenant: {item.tenantName}</Text>
            <Text style={{ color: theme.text, marginTop: 4, fontWeight: '700' }}>End Date: {item.endDateFormatted}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: theme.muted }}>No active contracts found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
});
