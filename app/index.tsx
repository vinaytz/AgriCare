import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';

export default function Index() {
  const router = useRouter();
  const { user, token, isLoading, hasSeenLanguageSelector } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!hasSeenLanguageSelector) {
        router.replace('/language-selector');
      } else if (user && token) {
        // User is authenticated, redirect to appropriate dashboard
        if (user.role === 'farmer') {
          router.replace('/(farmer-tabs)');
        } else {
          router.replace('/(labour-tabs)');
        }
      } else {
        // User is not authenticated, redirect to auth flow
        router.replace('/auth/role-selection');
      }
    }
  }, [isLoading, hasSeenLanguageSelector, user, token, router]);

  return <LoadingScreen />;
}