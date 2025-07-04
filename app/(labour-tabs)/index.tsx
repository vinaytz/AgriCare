import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';
import { getCurrentLocation, requestLocationPermission, calculateDistance } from '../../utils/location';
import { Job } from '../../types/job';
import { User, Bell, Search, Clock, MapPin, MessageCircle, Users } from 'lucide-react-native';

export default function LabourHome() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const stats = [
    { title: 'Jobs Applied', value: '8', color: '#8B4513' },
    { title: 'Jobs Completed', value: '25', color: '#22C55E' },
    { title: 'This Month', value: '₹15,000', color: '#F59E0B' },
  ];

  const loadNearbyJobs = useCallback(async () => {
    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to see nearby jobs.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: loadNearbyJobs },
          ]
        );
        return;
      }

      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('Error', 'Unable to get your location. Please try again.');
        return;
      }

      setLocation(currentLocation);

      const jobs = await apiClient.getNearbyJobs(
        currentLocation.latitude,
        currentLocation.longitude,
        2 // 2km radius
      );

      // Calculate distance for each job
      const jobsWithDistance = jobs.map(job => ({
        ...job,
        distance: calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          job.latitude,
          job.longitude
        ),
      }));

      // Sort by distance
      jobsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setNearbyJobs(jobsWithDistance);
    } catch (error) {
      console.error('Load nearby jobs error:', error);
      Alert.alert('Error', 'Failed to load nearby jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNearbyJobs();
  }, [loadNearbyJobs]);
    

  const handleMessageFarmer = (job: Job) => {
    // Navigate to chat or show message interface
    Alert.alert(
      'Message Farmer',
      `Send a message to the farmer about "${job.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => {
          // TODO: Implement messaging functionality
          Alert.alert('Success', 'Message sent to farmer!');
        }},
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('dashboard.welcome')}</Text>
          <Text style={styles.username}>{user?.name || 'Labour'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <User size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchButton} onPress={loadNearbyJobs}>
            <Search size={20} color="#6B7280" />
            <Text style={styles.searchText}>
              {loading ? 'Searching for jobs...' : 'Refresh nearby jobs'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nearbyJobs}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            {location && (
              <Text style={styles.locationText}>
                Within 2km of your location
              </Text>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading nearby jobs...</Text>
            </View>
          ) : nearbyJobs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No jobs found nearby</Text>
              <Text style={styles.emptySubtext}>Try refreshing or check back later</Text>
            </View>
          ) : (
            nearbyJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobPayment}>₹{job.daily_wage}/day</Text>
                </View>
                
                <Text style={styles.jobDescription} numberOfLines={2}>
                  {job.description}
                </Text>
                
                <View style={styles.jobDetails}>
                  <View style={styles.jobDetailItem}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>{job.number_of_labourers} needed</Text>
                  </View>
                  <View style={styles.jobDetailItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>
                      {job.distance ? `${job.distance}km away` : 'Nearby'}
                    </Text>
                  </View>
                  <View style={styles.jobDetailItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>
                      Starts {formatDate(job.start_date)}
                    </Text>
                  </View>
                </View>

                {job.required_skills && job.required_skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {job.required_skills.slice(0, 3).map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {job.required_skills.length > 3 && (
                      <Text style={styles.moreSkills}>+{job.required_skills.length - 3} more</Text>
                    )}
                  </View>
                )}

                {job.perks && job.perks.length > 0 && (
                  <View style={styles.perksContainer}>
                    <Text style={styles.perksLabel}>Perks:</Text>
                    <Text style={styles.perksText}>{job.perks.join(', ')}</Text>
                  </View>
                )}
                
                <View style={styles.jobFooter}>
                  <Text style={styles.postedTime}>
                    {job.farmer_name ? `by ${job.farmer_name}` : 'Posted recently'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => handleMessageFarmer(job)}
                  >
                    <MessageCircle size={16} color="#FFFFFF" />
                    <Text style={styles.messageText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    padding: 8,
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    fontSize: 16,
    color: '#6B7280',
  },
  nearbyJobs: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  jobPayment: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  perksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  perksLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginRight: 6,
  },
  perksText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  messageText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});