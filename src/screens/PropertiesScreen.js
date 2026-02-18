import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import PropertyCard from '../components/PropertyCard';

export default function PropertiesScreen({ properties, currency, theme, onOpenProperty, onOpenSettings, onOpenUpcoming, onRefresh, onAddProperty }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onAddProperty}>
          <Text style={{ color: theme.buttonText }}>Add Property</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onOpenSettings}>
          <Text style={{ color: theme.buttonText }}>Settings</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onOpenUpcoming}>
          <Text style={{ color: theme.buttonText }}>Upcoming End Dates</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.button, borderColor: theme.border }]} onPress={onRefresh}>
          <Text style={{ color: theme.buttonText }}>Refresh</Text>
        </Pressable>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => String(item.propertyId)}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            currency={currency}
            theme={theme}
            onPress={() => onOpenProperty(item)}
          />
        )}
        ListEmptyComponent={<Text style={{ color: theme.muted }}>No properties found.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listContent: {
    paddingBottom: 40,
  },
});
