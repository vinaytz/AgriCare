import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { apiClient } from '../utils/api';
import { getCurrentLocation, requestLocationPermission } from '../utils/location';
import { X, MapPin, Calendar, Users, Briefcase } from 'lucide-react-native';

export default function CreateJobModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    number_of_labourers: '',
    required_skills: '',
    daily_wage: '',
    perks: '',
    start_date: '',
    end_date: '',
  });

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState<string>('');

  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to create jobs. This helps labourers find jobs near them.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: requestLocation },
          ]
        );
        return;
      }

      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
      } else {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: requestLocation },
          ]
        );
      }
    } catch (error) {
      console.error('Location request error:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);
    

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.length > 30) {
      newErrors.title = 'Job title must be 30 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.number_of_labourers.trim()) {
      newErrors.number_of_labourers = 'Number of labourers is required';
    } else if (isNaN(Number(formData.number_of_labourers)) || Number(formData.number_of_labourers) < 1) {
      newErrors.number_of_labourers = 'Please enter a valid number of labourers';
    }

    if (!formData.daily_wage.trim()) {
      newErrors.daily_wage = 'Daily wage is required';
    } else if (isNaN(Number(formData.daily_wage)) || Number(formData.daily_wage) < 0) {
      newErrors.daily_wage = 'Please enter a valid daily wage';
    }

    if (!formData.start_date.trim()) {
      newErrors.start_date = 'Start date is required';
    }

    if (!location) {
      newErrors.location = 'Location is required. Please allow location access.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateJob = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    
    try {
      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        number_of_labourers: Number(formData.number_of_labourers),
        required_skills: formData.required_skills.trim() 
          ? formData.required_skills.split(',').map(skill => skill.trim()).filter(skill => skill)
          : undefined,
        latitude: location!.latitude,
        longitude: location!.longitude,
        daily_wage: Number(formData.daily_wage),
        perks: formData.perks.trim() 
          ? formData.perks.split(',').map(perk => perk.trim()).filter(perk => perk)
          : undefined,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date.trim() ? new Date(formData.end_date).toISOString() : undefined,
      };

      await apiClient.createJob(jobData);
      
      Alert.alert(
        'Success',
        'Job created successfully! Labourers in your area will now be able to see and apply for this job.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Create job error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job. Please try again.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Job</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {apiError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{apiError}</Text>
          </View>
        ) : null}

        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#22C55E" />
            <Text style={styles.locationTitle}>Job Location</Text>
          </View>
          {locationLoading ? (
            <Text style={styles.locationText}>Getting your location...</Text>
          ) : location ? (
            <Text style={styles.locationText}>
              Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          ) : (
            <TouchableOpacity style={styles.locationButton} onPress={requestLocation}>
              <Text style={styles.locationButtonText}>Enable Location Access</Text>
            </TouchableOpacity>
          )}
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Job Details</Text>
          </View>

          <Input
            label="Job Title"
            placeholder="e.g., Wheat Harvesting"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            error={errors.title}
          />

          <Input
            label="Description"
            placeholder="Describe the work to be done..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            error={errors.description}
          />

          <Input
            label="Required Skills (comma separated)"
            placeholder="e.g., Harvesting, Irrigation, Tractor Operation"
            value={formData.required_skills}
            onChangeText={(text) => setFormData({ ...formData, required_skills: text })}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Requirements</Text>
          </View>

          <Input
            label="Number of Labourers"
            placeholder="e.g., 5"
            value={formData.number_of_labourers}
            onChangeText={(text) => setFormData({ ...formData, number_of_labourers: text })}
            keyboardType="numeric"
            error={errors.number_of_labourers}
          />

          <Input
            label="Daily Wage (₹)"
            placeholder="e.g., 500"
            value={formData.daily_wage}
            onChangeText={(text) => setFormData({ ...formData, daily_wage: text })}
            keyboardType="numeric"
            error={errors.daily_wage}
          />

          <Input
            label="Perks (comma separated)"
            placeholder="e.g., Free meals, Transportation, Bonus"
            value={formData.perks}
            onChangeText={(text) => setFormData({ ...formData, perks: text })}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Schedule</Text>
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>Start Date *</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.start_date}
              onChangeText={(text) => handleDateChange('start_date', text)}
              error={errors.start_date}
            />
            {/* TODO: Integrate a date picker here */}
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>End Date (Optional)</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.end_date}
              onChangeText={(text) => handleDateChange('end_date', text)}
            />
            {/* TODO: Integrate a date picker here */}
          </View>
        </View>

        <Button
          title="Create Job"
          onPress={handleCreateJob}
          loading={loading}
          disabled={!location || locationLoading}
          size="large"
          style={styles.createButton}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
  locationSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  createButton: {
    width: '100%',
    marginBottom: 32,
  },
});