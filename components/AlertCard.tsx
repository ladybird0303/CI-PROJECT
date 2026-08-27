import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../constants/colors';

type AlertCardProps = {
  title: string;
  detail: string;
  accent: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  unread?: boolean;
  onDelete?: () => void;
};

export function AlertCard({ title, detail, accent, icon, unread = false, onDelete }: AlertCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}> 
          <MaterialCommunityIcons name={icon} size={20} color={accent} />
        </View>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {unread ? <Chip compact style={styles.badge} textStyle={styles.badgeText}>New</Chip> : null}
          </View>
          <Text style={styles.detail}>{detail}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    backgroundColor: palette.surface,
    elevation: 2,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  detail: {
    color: palette.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    color: palette.primary,
    fontSize: 10,
  },
});
