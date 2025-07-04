import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { setHasSeenLanguageSelector } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const handleContinue = async () => {
    if (selectedLanguage !== language) {
      await setLanguage(selectedLanguage);
    }
    await setHasSeenLanguageSelector(true);
    router.replace('/auth/role-selection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
        
        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                selectedLanguage === lang.code && styles.languageItemSelected,
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={[
                styles.languageText,
                selectedLanguage === lang.code && styles.languageTextSelected,
              ]}>
                {lang.nativeName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={t('common.continue')}
          onPress={handleContinue}
          size="large"
          style={styles.continueButton}
        />
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  languageList: {
    marginBottom: 48,
  },
  languageItem: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  languageItemSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  languageTextSelected: {
    color: '#22C55E',
  },
  continueButton: {
    width: '100%',
  },
});