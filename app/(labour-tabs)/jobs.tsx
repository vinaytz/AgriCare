import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiClient } from '../../utils/api';
import { getCurrentLocation, requestLocationPermission, calculateDistance } from '../../utils/location';
import { Job } from '../../types/job';
import { Search, Filter, MapPin, Clock, Calendar, Star, Users, MessageCircle, Settings } from 'lucide-react-native';

export default function LabourJobs() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('nearby');
  const [selectedRadius, setSelectedRadius] = useState(2);
  const [showRadiusSelector, setShowRadiusSelector] = useState(false);
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const tabs = ['nearby', 'applied', 'ongoing', 'completed'];
  const radiusOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Mock data for other tabs
  const mockJobs = [
    {
      id: 1,
      title: 'Wheat Harvesting',
      farmer: 'Rajesh Kumar',
      location: 'Ludhiana, Punjab',
      payment: '₹150/hr',
      duration: '3 days',
      postedTime: '2 hours ago',
      status: 'applied',
      description: 'Need experienced labour for wheat harvesting. Must have experience with modern harvesting equipment.',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Rice Plantation',
      farmer: 'Priya Singh',
      location: 'Amritsar, Punjab',
      payment: '₹120/hr',
      duration: '5 days',
      postedTime: '4 hours ago',
      status: 'ongoing',
      description: 'Rice planting work required. Experience with rice cultivation preferred.',
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Crop Weeding',
      farmer: 'Sunita Kaur',
      location: 'Patiala, Punjab',
      payment: '₹80/hr',
      duration: '4 days',
      postedTime: '3 days ago',
      status: 'completed',
      description: 'Weeding work completed successfully. Great experience working with this farmer.',
      rating: 4.7,
    },
  ];

  useEffect(() => {
    if (selectedTab === 'nearby') {
      loadNearbyJobs();
    }
  }, [selectedTab, selectedRadius]);

  const loadNearbyJobs = async () => {
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
        selectedRadius
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
  };

  const handleMessageFarmer = (job: any) => {
    Alert.alert(
      'Message Farmer',
      `Send a message to the farmer about "${job.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nearby': return '#8B4513';
      case 'applied': return '#3B82F6';
      case 'ongoing': return '#F59E0B';
      case 'completed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const filteredJobs = selectedTab === 'nearby' 
    ? nearbyJobs 
    : mockJobs.filter(job => job.status === selectedTab);

  const renderNearbyJob = (job: Job) => (
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
  );

  const renderMockJob = (job: any) => (
    <TouchableOpacity key={job.id} style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(job.status) }
        ]}>
          <Text style={styles.statusText}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.farmerInfo}>
        <Text style={styles.farmerName}>by {job.farmer}</Text>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.rating}>{job.rating}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetailItem}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.duration}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.postedTime}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.jobPayment}>{job.payment}</Text>
        <TouchableOpacity style={[
          styles.actionButton,
          { backgroundColor: getStatusColor(job.status) }
        ]}>
          <Text style={styles.actionText}>
            {job.status === 'applied' ? 'Applied' :
             job.status === 'ongoing' ? 'In Progress' :
             'View Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.labour.jobs')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#374151" />
          </TouchableOpacity>
          {selectedTab === 'nearby' && (
            <TouchableOpacity 
              style={styles.radiusButton}
              onPress={() => setShowRadiusSelector(!showRadiusSelector)}
            >
              <Settings size={24} color="#374151" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectedTab === 'nearby' && showRadiusSelector && (
        <View style={styles.radiusSelector}>
          <Text style={styles.radiusSelectorTitle}>Search Radius: {selectedRadius}km</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.radiusOptions}
          >
            {radiusOptions.map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.radiusOption,
                  selectedRadius === radius && styles.radiusOptionActive,
                ]}
                onPress={() => {
                  setSelectedRadius(radius);
                  setShowRadiusSelector(false);
                }}
              >
                <Text style={[
                  styles.radiusOptionText,
                  selectedRadius === radius && styles.radiusOptionTextActive,
                ]}>
                  {radius}km
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive,
            ]}>
              {tab === 'nearby' ? 'Find Jobs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {selectedTab === 'nearby' ? (
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading nearby jobs...</Text>
            </View>
          ) : filteredJobs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No jobs found within {selectedRadius}km</Text>
              <Text style={styles.emptySubtext}>Try increasing the search radius or check back later</Text>
            </View>
          ) : (
            filteredJobs.map(renderNearbyJob)
          )
        ) : (
          filteredJobs.map(renderMockJob)
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    padding: 8,
  },
  radiusButton: {
    padding: 8,
  },
  radiusSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  radiusSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  radiusOptions: {
    flexDirection: 'row',
  },
  radiusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radiusOptionActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  radiusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  radiusOptionTextActive: {
    color: '#FFFFFF',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  tabButtonActive: {
    backgroundColor: '#8B4513',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 24,
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
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  farmerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
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
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});