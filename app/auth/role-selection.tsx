import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { Tractor, HardHat } from 'lucide-react-native';

export default function RoleSelection() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleRoleSelect = (role: 'farmer' | 'labour') => {
    router.push({
      pathname: '/auth/signup',
      params: { role },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.roleSelection')}</Text>
        
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('farmer')}
          >
            <View style={styles.roleIcon}>
              <Tractor size={48} color="#22C55E" />
            </View>
            <Text style={styles.roleText}>{t('auth.farmer')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('labour')}
          >
            <View style={styles.roleIcon}>
              <HardHat size={48} color="#8B4513" />
            </View>
            <Text style={styles.roleText}>{t('auth.labour')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 48,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  roleIcon: {
    marginBottom: 16,
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});