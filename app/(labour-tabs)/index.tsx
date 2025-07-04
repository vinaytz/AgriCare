import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Bell, Search, TrendingUp, Clock, MapPin } from 'lucide-react-native';

export default function LabourHome() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const stats = [
    { title: 'Jobs Applied', value: '8', color: '#8B4513' },
    { title: 'Jobs Completed', value: '25', color: '#22C55E' },
    { title: 'This Month', value: '₹15,000', color: '#F59E0B' },
  ];

  const nearbyJobs = [
    {
      id: 1,
      title: 'Wheat Harvesting',
      farmer: 'Rajesh Kumar',
      location: 'Ludhiana, Punjab',
      payment: '₹150/hr',
      duration: '3 days',
      postedTime: '2 hours ago',
    },
    {
      id: 2,
      title: 'Rice Plantation',
      farmer: 'Priya Singh',
      location: 'Amritsar, Punjab',
      payment: '₹120/hr',
      duration: '5 days',
      postedTime: '4 hours ago',
    },
    {
      id: 3,
      title: 'Irrigation Setup',
      farmer: 'Amit Sharma',
      location: 'Jalandhar, Punjab',
      payment: '₹100/hr',
      duration: '2 days',
      postedTime: '1 day ago',
    },
  ];

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
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#6B7280" />
            <Text style={styles.searchText}>Search for jobs near you</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nearbyJobs}>
          <Text style={styles.sectionTitle}>Nearby Jobs</Text>
          {nearbyJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobPayment}>{job.payment}</Text>
              </View>
              
              <Text style={styles.jobFarmer}>by {job.farmer}</Text>
              
              <View style={styles.jobDetails}>
                <View style={styles.jobDetailItem}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.location}</Text>
                </View>
                <View style={styles.jobDetailItem}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.duration}</Text>
                </View>
              </View>
              
              <View style={styles.jobFooter}>
                <Text style={styles.postedTime}>{job.postedTime}</Text>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  jobPayment: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  jobFarmer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6B7280',
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
  applyButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  applyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});