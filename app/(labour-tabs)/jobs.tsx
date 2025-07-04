import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { MapPin, Calendar, Briefcase, MessageSquare, AlertCircle, Filter } from 'lucide-react-native';
import { apiClient } from '../../utils/api';
import { getCurrentLocation, requestLocationPermission } from '../../utils/location';
import { Job } from '../../types/job';
import { useRouter } from 'expo-router';
import RadiusFilterModal from '../../components/RadiusFilterModal';

export default function LabourJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [radius, setRadius] = useState(2);
  const [showRadiusModal, setShowRadiusModal] = useState(false);

  const fetchNearbyJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to find nearby jobs.',
          [{ text: 'OK' }]
        );
        setError('Location permission denied.');
        return;
      }

      const location = await getCurrentLocation();
      if (location) {
        const nearbyJobs = await apiClient.getNearbyJobs(location.latitude, location.longitude, radius);
        setJobs(nearbyJobs);
      } else {
        setError('Could not determine your location.');
        Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      Alert.alert('Error', 'Failed to fetch nearby jobs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    fetchNearbyJobs();
  }, [fetchNearbyJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNearbyJobs().finally(() => setRefreshing(false));
  }, [fetchNearbyJobs]);

  const handleMessagePress = (job: Job) => {
    // Navigate to chat screen with farmer info
    router.push(`/chat/${job.farmer_id}`);
    Alert.alert('Coming Soon', 'The chat functionality will be implemented in a future update.');
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setShowRadiusModal(false);
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Finding jobs near you...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <AlertCircle size={40} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNearbyJobs}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (jobs.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No jobs found within {radius}km of your location.</Text>
          <Text style={styles.emptySubText}>Try increasing the search radius or check back later.</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.jobsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#8B4513"]} />}
      >
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobWage}>₹{job.daily_wage}/day</Text>
            </View>
            <Text style={styles.jobDescription}>{job.description}</Text>

            <View style={styles.jobDetails}>
              <View style={styles.jobDetailItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.jobDetailText}>{job.distance?.toFixed(2) ?? '...'} km away</Text>
              </View>
              <View style={styles.jobDetailItem}>
                <Calendar size={14} color="#6B7280" />
                <Text style={styles.jobDetailText}>Starts: {new Date(job.start_date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.jobDetailItem}>
                <Briefcase size={14} color="#6B7280" />
                <Text style={styles.jobDetailText}>{job.number_of_labourers} Labourers</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.messageButton} onPress={() => handleMessagePress(job)}>
              <MessageSquare size={18} color="#FFFFFF" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Jobs</Text>
        <TouchableOpacity onPress={() => setShowRadiusModal(true)}>
          <Filter size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
      {renderContent()}
      <RadiusFilterModal
        isVisible={showRadiusModal}
        currentRadius={radius}
        onClose={() => setShowRadiusModal(false)}
        onApply={handleRadiusChange}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  radiusLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  jobsList: {
    flex: 1,
    padding: 24,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  jobWage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  jobDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});