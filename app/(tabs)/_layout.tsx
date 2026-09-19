import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { palette } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line-variant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="relay"
        options={{
          title: 'Relay',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="power-socket-uk" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="theft"
        options={{
          title: 'Theft',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-alert" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="billing"
        options={{
          title: 'Billing',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="currency-bdt" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
