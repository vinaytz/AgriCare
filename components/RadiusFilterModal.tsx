import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { X } from 'lucide-react-native';

interface RadiusFilterModalProps {
  isVisible: boolean;
  currentRadius: number;
  onClose: () => void;
  onApply: (newRadius: number) => void;
}

export default function RadiusFilterModal({
  isVisible,
  currentRadius,
  onClose,
  onApply,
}: RadiusFilterModalProps) {
  const [selectedRadius, setSelectedRadius] = useState(currentRadius);

  useEffect(() => {
    setSelectedRadius(currentRadius);
  }, [currentRadius]);

  const handleApply = () => {
    onApply(selectedRadius);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Search Radius</Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.radiusLabel}>Radius: {selectedRadius} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={selectedRadius}
              onValueChange={setSelectedRadius}
              minimumTrackTintColor="#8B4513"
              maximumTrackTintColor="#000000"
            />
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  radiusLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#1F2937',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
