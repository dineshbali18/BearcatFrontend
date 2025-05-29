import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const CustomAlert = ({ visible, title, message, onClose, type = 'info' }) => {
  if (!visible) return null;

  const gradientColors = {
    success: ['#A259FF', '#FF6EC7'],
    error: ['#FF416C', '#FF4B2B'],
    info: ['#4A00E0', '#8E2DE2'],
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={50} style={styles.blurContainer}>
          <LinearGradient
            colors={gradientColors[type]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.alertContainer}
          >
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
            
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.closeButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '80%',
  },
  alertContainer: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  alertMessage: {
    fontSize: 16,
    fontFamily: 'JosefinSans-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeButton: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '60%',
    elevation: 5,
  },
  gradientButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#A259FF',
  },
});

export default CustomAlert;