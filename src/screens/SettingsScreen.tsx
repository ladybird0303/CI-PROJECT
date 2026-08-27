import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Settings as SettingsIcon, DollarSign, Phone, Wifi, Cpu, Save } from 'lucide-react-native';
import { Header } from '../components/Header';
import { useEnergy } from '../context/EnergyContext';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, hardware } = useEnergy();

  const [unitPrice, setUnitPrice] = useState(settings.unitPriceBDT.toString());
  const [budgetBDT, setBudgetBDT] = useState(settings.monthlyBudgetBDT.toString());
  const [budgetKWh, setBudgetKWh] = useState(settings.monthlyBudgetKWh.toString());
  const [phone, setPhone] = useState(settings.emergencyPhoneNumber);
  const [autoRelay, setAutoRelay] = useState(settings.autoRelayCutoffOnTheft);
  const [smsEnabled, setSmsEnabled] = useState(settings.smsAlertEnabled);

  const handleSave = () => {
    updateSettings({
      unitPriceBDT: parseFloat(unitPrice) || 8.5,
      monthlyBudgetBDT: parseFloat(budgetBDT) || 2500,
      monthlyBudgetKWh: parseFloat(budgetKWh) || 300,
      emergencyPhoneNumber: phone,
      autoRelayCutoffOnTheft: autoRelay,
      smsAlertEnabled: smsEnabled,
    });

    Alert.alert('Settings Saved', 'IoT Smart Energy Meter settings have been successfully updated.');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tariff & Billing Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <DollarSign size={18} color="#F59E0B" />
            <Text style={styles.cardTitle}>TARIFF & BILLING CONFIGURATION</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Electricity Tariff Rate (BDT ৳ per kWh)</Text>
            <TextInput
              style={styles.textInput}
              value={unitPrice}
              onChangeText={setUnitPrice}
              keyboardType="numeric"
              placeholder="e.g. 8.50"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Monthly Budget (BDT ৳)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetBDT}
                onChangeText={setBudgetBDT}
                keyboardType="numeric"
                placeholder="2500"
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Monthly Target (kWh)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetKWh}
                onChangeText={setBudgetKWh}
                keyboardType="numeric"
                placeholder="300"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>
        </View>

        {/* Security & Automation Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Phone size={18} color="#10B981" />
            <Text style={styles.cardTitle}>EMERGENCY SMS & AUTOMATION RULES</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Emergency Alert Phone Number (GSM SIM800L)</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+880 1712-345678"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Auto Relay Circuit Cutoff</Text>
              <Text style={styles.switchSub}>
                Automatically trip 4-Channel Relays when physical tamper or theft is detected.
              </Text>
            </View>
            <Switch
              value={autoRelay}
              onValueChange={setAutoRelay}
              trackColor={{ false: '#334155', true: '#10B981' }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>GSM Emergency SMS Notifications</Text>
              <Text style={styles.switchSub}>
                Send instantaneous SMS text alert via SIM800L module upon theft trigger.
              </Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: '#334155', true: '#3B82F6' }}
            />
          </View>
        </View>

        {/* Hardware Specifications Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Cpu size={18} color="#8B5CF6" />
            <Text style={styles.cardTitle}>HARDWARE ARCHITECTURE SPECIFICATIONS</Text>
          </View>

          <View style={styles.specList}>
            <View style={styles.specItem}>
              <Text style={styles.specKey}>Microcontroller</Text>
              <Text style={styles.specVal}>Arduino UNO R3 (ATmega328P @ 16 MHz)</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specKey}>Wi-Fi Cloud Sync</Text>
              <Text style={styles.specVal}>ESP8266 ESP-01 (IP: {settings.esp8266IpAddress})</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specKey}>Cellular Module</Text>
              <Text style={styles.specVal}>SIM800L Quad-Band Micro GSM</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specKey}>Signal Isolation</Text>
              <Text style={styles.specVal}>PC817 Optocoupler IC (High Voltage Safe)</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specKey}>On-Site Display</Text>
              <Text style={styles.specVal}>16x2 Character LCD with I2C Adapter</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specKey}>Circuit Breaker</Text>
              <Text style={styles.specVal}>4-Channel 5V Relay Module</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Save size={18} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>SAVE CONFIGURATION</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  switchSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    paddingRight: 10,
  },
  specList: {
    gap: 8,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  specVal: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
