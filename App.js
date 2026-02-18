import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import PropertiesScreen from './src/screens/PropertiesScreen';
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import TenancyEditorScreen from './src/screens/TenancyEditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UpcomingEventsScreen from './src/screens/UpcomingEventsScreen';
import PropertyEditorScreen from './src/screens/PropertyEditorScreen';
import { getUpcomingEvents } from './src/utils/propertyUtils';
import {
  addProperty,
  addTenancy,
  deleteProperty,
  deleteTenancy,
  fetchProperties,
  updateProperty,
  updateTenancy,
} from './src/api/propertiesApi';
import { DEFAULT_API_BASE_URL } from './src/config';

const Stack = createNativeStackNavigator();

const getInitialApiBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (!hostUri) return DEFAULT_API_BASE_URL;

  const host = hostUri.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return DEFAULT_API_BASE_URL;
  }

  return `http://${host}:3000`;
};

const getTheme = (darkTheme) => {
  if (!darkTheme) {
    return {
      background: '#F4F7FB',
      card: '#FFFFFF',
      cardSoft: '#F7FAFF',
      text: '#0B2B45',
      muted: '#4A657A',
      border: '#B8C7D8',
      button: '#1F6FB2',
      buttonText: '#FFFFFF',
      success: '#2B8A3E',
      warning: '#A24800',
      error: '#C92A2A',
      input: '#FFFFFF',
    };
  }

  return {
    background: '#121A23',
    card: '#1C2733',
    cardSoft: '#223142',
    text: '#EAF2FA',
    muted: '#AAC0D4',
    border: '#36516B',
    button: '#2E79BD',
    buttonText: '#F4F9FF',
    success: '#66D08B',
    warning: '#F6A861',
    error: '#FF7B7B',
    input: '#1A2430',
  };
};

export default function App() {
  const [properties, setProperties] = useState([]);
  const [settings, setSettings] = useState({
    currency: 'GBP',
    darkTheme: false,
    apiBaseUrl: getInitialApiBaseUrl(),
  });

  const theme = useMemo(() => getTheme(settings.darkTheme), [settings.darkTheme]);

  const loadProperties = useCallback(async () => {
    try {
      const data = await fetchProperties(settings.apiBaseUrl);
      setProperties(data);
    } catch (error) {
      Alert.alert('Connection Error', `Unable to load properties.\n${error.message}\n\nTip: in Settings, set API Base URL to your LAN IP (e.g. http://192.168.1.10:3000).`);
    }
  }, [settings.apiBaseUrl]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const upsertLocalTenancy = (propertyId, tenancy) => {
    setProperties((prev) => prev.map((property) => {
      if (property.propertyId !== propertyId) return property;

      const list = property.tenancies || [];
      const existingIndex = list.findIndex((item) => item.tenancyId === tenancy.tenancyId);
      if (existingIndex >= 0) {
        const copy = [...list];
        copy[existingIndex] = tenancy;
        return { ...property, tenancies: copy };
      }

      return { ...property, tenancies: [...list, tenancy] };
    }));
  };

  const removeLocalTenancy = (propertyId, tenancyId) => {
    setProperties((prev) => prev.map((property) => {
      if (property.propertyId !== propertyId) return property;
      return {
        ...property,
        tenancies: (property.tenancies || []).filter((item) => item.tenancyId !== tenancyId),
      };
    }));
  };

  const upsertLocalProperty = (propertyPayload) => {
    setProperties((prev) => {
      const index = prev.findIndex((item) => item.propertyId === propertyPayload.propertyId);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...propertyPayload };
        return copy;
      }
      return [...prev, { ...propertyPayload, tenancies: propertyPayload.tenancies || [] }];
    });
  };

  const removeLocalProperty = (propertyId) => {
    setProperties((prev) => prev.filter((item) => item.propertyId !== propertyId));
  };

  return (
    <NavigationContainer>
      <StatusBar style={settings.darkTheme ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="Properties"
          options={{ title: 'ProPerty Mobile' }}
        >
          {({ navigation }) => (
            <PropertiesScreen
              properties={properties}
              currency={settings.currency}
              theme={theme}
              onRefresh={loadProperties}
              onAddProperty={() => navigation.navigate('Property Editor')}
              onOpenSettings={() => navigation.navigate('Settings')}
              onOpenUpcoming={() => navigation.navigate('Upcoming End Dates')}
              onOpenProperty={(property) => navigation.navigate('Property Details', { propertyId: property.propertyId })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Property Details">
          {({ route, navigation }) => {
            const property = properties.find((item) => item.propertyId === route.params?.propertyId);

            return (
              <PropertyDetailsScreen
                property={property}
                currency={settings.currency}
                theme={theme}
                onEditProperty={() => navigation.navigate('Property Editor', { propertyId: property?.propertyId })}
                onAddTenancy={() => navigation.navigate('Tenancy Editor', { propertyId: property?.propertyId })}
                onEditTenancy={(tenancy) => navigation.navigate('Tenancy Editor', { propertyId: property?.propertyId, tenancyId: tenancy.tenancyId })}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="Property Editor">
          {({ route, navigation }) => {
            const property = properties.find((item) => item.propertyId === route.params?.propertyId);

            return (
              <PropertyEditorScreen
                property={property}
                theme={theme}
                onSave={async (payload) => {
                  try {
                    if (property?.propertyId) {
                      const saved = await updateProperty(settings.apiBaseUrl, property.propertyId, payload);
                      upsertLocalProperty(saved);
                    } else {
                      const created = await addProperty(settings.apiBaseUrl, payload);
                      upsertLocalProperty(created);
                    }
                    navigation.goBack();
                  } catch (error) {
                    Alert.alert('Save Failed', error.message);
                  }
                }}
                onDelete={async () => {
                  if (!property?.propertyId) return;
                  try {
                    await deleteProperty(settings.apiBaseUrl, property.propertyId);
                    removeLocalProperty(property.propertyId);
                    navigation.navigate('Properties');
                  } catch (error) {
                    Alert.alert('Delete Failed', error.message);
                  }
                }}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="Tenancy Editor">
          {({ route, navigation }) => {
            const property = properties.find((item) => item.propertyId === route.params?.propertyId);
            const tenancy = (property?.tenancies || []).find((item) => item.tenancyId === route.params?.tenancyId);

            return (
              <TenancyEditorScreen
                tenancy={tenancy}
                theme={theme}
                onSave={async (payload) => {
                  try {
                    if (tenancy?.tenancyId) {
                      const saved = await updateTenancy(settings.apiBaseUrl, property.propertyId, tenancy.tenancyId, payload);
                      upsertLocalTenancy(property.propertyId, saved);
                    } else {
                      const created = await addTenancy(settings.apiBaseUrl, property.propertyId, payload);
                      upsertLocalTenancy(property.propertyId, created);
                    }
                    navigation.goBack();
                  } catch (error) {
                    Alert.alert('Save Failed', error.message);
                  }
                }}
                onDelete={async () => {
                  if (!tenancy?.tenancyId) return;
                  try {
                    await deleteTenancy(settings.apiBaseUrl, property.propertyId, tenancy.tenancyId);
                    removeLocalTenancy(property.propertyId, tenancy.tenancyId);
                    navigation.goBack();
                  } catch (error) {
                    Alert.alert('Delete Failed', error.message);
                  }
                }}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {({ navigation }) => (
            <SettingsScreen
              settings={settings}
              theme={theme}
              onTestConnection={async (apiBaseUrl) => {
                try {
                  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/properties`);
                  if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                  }
                  Alert.alert('Connection OK', `Connected to ${apiBaseUrl}`);
                } catch (error) {
                  Alert.alert(
                    'Connection Failed',
                    `Could not reach ${apiBaseUrl}.\n\n` +
                      'Check that backend is running and your phone/PC are on the same Wi-Fi.\n\n' +
                      `Details: ${error.message}`,
                  );
                }
              }}
              onSave={(next) => {
                setSettings(next);
                navigation.goBack();
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Upcoming End Dates">
          {() => (
            <UpcomingEventsScreen
              events={getUpcomingEvents(properties)}
              theme={theme}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
