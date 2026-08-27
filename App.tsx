import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { LayoutDashboard, BarChart3, Zap, ShieldAlert, Settings } from 'lucide-react-native';
import { EnergyProvider } from './src/context/EnergyContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { RelayControlScreen } from './src/screens/RelayControlScreen';
import { SecurityAlertsScreen } from './src/screens/SecurityAlertsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type TabType = 'dashboard' | 'analytics' | 'relays' | 'alerts' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'relays':
        return <RelayControlScreen />;
      case 'alerts':
        return <SecurityAlertsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <EnergyProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        {/* Active Screen View */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('dashboard')}
            activeOpacity={0.7}
          >
            <LayoutDashboard size={20} color={activeTab === 'dashboard' ? '#3B82F6' : '#64748B'} />
            <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('analytics')}
            activeOpacity={0.7}
          >
            <BarChart3 size={20} color={activeTab === 'analytics' ? '#10B981' : '#64748B'} />
            <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>
              Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('relays')}
            activeOpacity={0.7}
          >
            <Zap size={20} color={activeTab === 'relays' ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.navText, activeTab === 'relays' && styles.navTextActive]}>
              Relays
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('alerts')}
            activeOpacity={0.7}
          >
            <ShieldAlert size={20} color={activeTab === 'alerts' ? '#EF4444' : '#64748B'} />
            <Text style={[styles.navText, activeTab === 'alerts' && styles.navTextActive]}>
              Alerts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Settings size={20} color={activeTab === 'settings' ? '#8B5CF6' : '#64748B'} />
            <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </EnergyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    elevation: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  navTextActive: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
});
