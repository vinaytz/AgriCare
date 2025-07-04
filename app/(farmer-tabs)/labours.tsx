import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, Star, MapPin, Phone, MessageCircle } from 'lucide-react-native';

export default function FarmerLabours() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'available', 'working', 'completed'];
  
  const labours = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      skills: ['Harvesting', 'Irrigation'],
      rating: 4.8,
      experience: '5 years',
      location: 'Ludhiana, Punjab',
      status: 'available',
      hourlyRate: '₹150',
      avatar: 'RK',
    },
    {
      id: 2,
      name: 'Priya Singh',
      skills: ['Planting', 'Weeding'],
      rating: 4.6,
      experience: '3 years',
      location: 'Amritsar, Punjab',
      status: 'working',
      hourlyRate: '₹120',
      avatar: 'PS',
    },
    {
      id: 3,
      name: 'Amit Sharma',
      skills: ['Tractor Operation', 'Harvesting'],
      rating: 4.9,
      experience: '8 years',
      location: 'Jalandhar, Punjab',
      status: 'available',
      hourlyRate: '₹200',
      avatar: 'AS',
    },
  ];

  const filteredLabours = selectedCategory === 'all' 
    ? labours 
    : labours.filter(labour => labour.status === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22C55E';
      case 'working': return '#3B82F6';
      case 'completed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.farmer.labours')}</Text>
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
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.labourList} showsVerticalScrollIndicator={false}>
        {filteredLabours.map((labour) => (
          <View key={labour.id} style={styles.labourCard}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{labour.avatar}</Text>
              </View>
              <View style={styles.labourInfo}>
                <Text style={styles.labourName}>{labour.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{labour.rating}</Text>
                  <Text style={styles.experience}>• {labour.experience}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.location}>{labour.location}</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(labour.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {labour.status.charAt(0).toUpperCase() + labour.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.hourlyRate}>{labour.hourlyRate}/hr</Text>
              </View>
            </View>

            <View style={styles.skillsContainer}>
              {labour.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#22C55E" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#3B82F6" />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.hireButton]}>
                <Text style={styles.hireText}>Hire</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  labourList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  labourCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  labourInfo: {
    flex: 1,
  },
  labourName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hourlyRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  hireButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  hireText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});