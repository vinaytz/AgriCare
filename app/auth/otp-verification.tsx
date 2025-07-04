import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { apiClient } from '../../utils/api';
import { ArrowLeft } from 'lucide-react-native';

export default function OTPVerification() {
  const router = useRouter();
  const { email, phone, role } = useLocalSearchParams<{
    email?: string;
    phone?: string;
    role: 'farmer' | 'labour';
  }>();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert(t('common.error'), 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      let response;
      
      if (email) {
        response = await apiClient.verifyEmailOTP(email, otp);
      } else if (phone) {
        // For phone verification, we would need to handle Firebase auth
        // For now, we'll simulate it
        response = await apiClient.verifyPhoneOTP('dummy_firebase_token');
      }

      if (response?.token) {
        const user = {
          name: 'User', // This would come from the token
          email: email,
          phone: phone,
          role: role,
        };
        
        await login(response.token, user);
        
        // Navigate to appropriate dashboard
        if (role === 'farmer') {
          router.replace('/(farmer-tabs)');
        } else {
          router.replace('/(labour-tabs)');
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      if (email) {
        await apiClient.sendEmailOTP(email);
      }
      
      setTimer(60);
      setCanResend(false);
      Alert.alert(t('common.success'), 'OTP sent successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('auth.otpTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.otpSection}>
          <Text style={styles.subtitle}>
            {t('auth.otpSubtitle')} {email || phone}
          </Text>

          <Input
            placeholder={t('auth.otpPlaceholder')}
            value={otp}
            onChangeText={setOTP}
            keyboardType="numeric"
            style={styles.otpInput}
            maxLength={6}
          />

          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={!canResend}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendText,
              !canResend && styles.resendTextDisabled
            ]}>
              {canResend ? t('auth.resendOtp') : `${t('auth.resendOtp')} (${timer}s)`}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={t('common.verify')}
          onPress={handleVerifyOTP}
          loading={loading}
          size="large"
          style={styles.verifyButton}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  otpSection: {
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  verifyButton: {
    width: '100%',
  },
});