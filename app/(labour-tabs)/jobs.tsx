import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, MapPin, Clock, Calendar, Star } from 'lucide-react-native';

export default function LabourJobs() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('available');

  const tabs = ['available', 'applied', 'ongoing', 'completed'];

  const jobs = [
    {
      id: 1,
      title: 'Wheat Harvesting',
      farmer: 'Rajesh Kumar',
      location: 'Ludhiana, Punjab',
      payment: '₹150/hr',
      duration: '3 days',
      postedTime: '2 hours ago',
      status: 'available',
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
      status: 'applied',
      description: 'Rice planting work required. Experience with rice cultivation preferred.',
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Irrigation Setup',
      farmer: 'Amit Sharma',
      location: 'Jalandhar, Punjab',
      payment: '₹100/hr',
      duration: '2 days',
      postedTime: '1 day ago',
      status: 'ongoing',
      description: 'Setting up new irrigation system. Technical knowledge required.',
      rating: 4.9,
    },
    {
      id: 4,
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

  const filteredJobs = selectedTab === 'available' 
    ? jobs.filter(job => job.status === 'available')
    : jobs.filter(job => job.status === selectedTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22C55E';
      case 'applied': return '#3B82F6';
      case 'ongoing': return '#F59E0B';
      case 'completed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.labour.jobs')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {filteredJobs.map((job) => (
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
                  {job.status === 'available' ? 'Apply' :
                   job.status === 'applied' ? 'Applied' :
                   job.status === 'ongoing' ? 'In Progress' :
                   'View Details'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  filterButton: {
    padding: 8,
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
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
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
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobPayment: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
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