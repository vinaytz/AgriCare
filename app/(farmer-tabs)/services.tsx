import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Plus, Calendar, MapPin, Star } from 'lucide-react-native';

export default function FarmerServices() {
  const { t } = useLanguage();

  const services = [
    {
      id: 1,
      title: 'Tractor Services',
      provider: 'Agri Equipment Co.',
      rating: 4.8,
      price: '₹500/hour',
      location: 'Ludhiana, Punjab',
      availability: 'Available',
      image: 'https://images.pexels.com/photos/87651/tractor-agriculture-field-farming-87651.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Seed Supply',
      provider: 'Premium Seeds Ltd.',
      rating: 4.6,
      price: '₹800/bag',
      location: 'Amritsar, Punjab',
      availability: 'Available',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Fertilizer Supply',
      provider: 'Crop Care Solutions',
      rating: 4.7,
      price: '₹1200/bag',
      location: 'Jalandhar, Punjab',
      availability: 'Limited',
      image: 'https://images.pexels.com/photos/4917210/pexels-photo-4917210.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      title: 'Irrigation Setup',
      provider: 'Water Works Punjab',
      rating: 4.9,
      price: '₹2000/setup',
      location: 'Patiala, Punjab',
      availability: 'Available',
      image: 'https://images.pexels.com/photos/4917212/pexels-photo-4917212.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return '#22C55E';
      case 'Limited': return '#F59E0B';
      case 'Unavailable': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.farmer.services')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceImageContainer}>
              <View style={styles.serviceImage}>
                <Text style={styles.serviceImageText}>IMG</Text>
              </View>
            </View>
            
            <View style={styles.serviceContent}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={[
                  styles.availabilityBadge,
                  { backgroundColor: getAvailabilityColor(service.availability) }
                ]}>
                  <Text style={styles.availabilityText}>{service.availability}</Text>
                </View>
              </View>

              <Text style={styles.serviceProvider}>{service.provider}</Text>

              <View style={styles.serviceDetails}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{service.rating}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.location}>{service.location}</Text>
                </View>
              </View>

              <View style={styles.serviceFooter}>
                <Text style={styles.price}>{service.price}</Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  addButton: {
    padding: 8,
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  serviceCard: {
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
  serviceImageContainer: {
    marginBottom: 12,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImageText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  serviceContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceProvider: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
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
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  bookText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});