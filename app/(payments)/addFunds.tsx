import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Icons from "phosphor-react-native";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FundsManager() {
  const [mode, setMode] = useState<'add' | 'verify' | 'withdraw'>('add');
  const [amount, setAmount] = useState('0');
  const [upiId, setUpiId] = useState('dineshbali45@ibl');
  const [upiName, setUpiName] = useState('');
  const [upiRef, setUpiRef] = useState('');
  const router = useRouter();
  const showToast = (msg: string) => Alert.alert('Status', msg);

  const handleSubmit = async () => {
    if (!amount.trim() || !upiId.trim() || (mode === 'withdraw' && !upiName.trim())) {
      if (mode === 'verify' && (!upiRef.trim() || !amount.trim())) {
        return showToast('Please enter UPI Ref and Amount');
      }
      return showToast('Please fill in all required fields.');
    }

    try {
      if (mode === 'withdraw') {
        const res = await fetch('https://dummyapi.io/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upiId, upiName, amount }),
        });
        showToast('Withdraw request sent!');
      } else if (mode === 'verify') {
        const res = await fetch('https://dummyapi.io/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upiRef, amount }),
        });
        showToast('Verification submitted!');
      } else {
        setMode('verify')
      }
    } catch (err) {
      showToast('Network error. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backIconWrapper} onPress={() => router.replace('/(tabs)/home')}>
    <Icons.ArrowLeft color="#fff" size={24} />
  </TouchableOpacity>
      <Text style={styles.title}>
        {mode === 'add' ? 'ADD FUNDS' : mode === 'withdraw' ? 'WITHDRAW FUNDS' : 'VERIFY PAYMENT'}
      </Text>

      <View style={styles.switchContainer}>
        {['add', 'verify', 'withdraw'].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m as any)}
            style={[styles.switchButton, mode === m && styles.activeSwitch]}
          >
            <Text style={styles.switchText}>{m.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        {mode !== 'verify' && (
          <>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
            />

            {/* <Text style={styles.label}>
              {mode === 'add' ? 'Your UPI ID' : 'Recipient UPI ID'}
            </Text>
            <TextInput
              placeholder="example@upi"
              placeholderTextColor="#aaa"
              value={upiId}
              onChangeText={setUpiId}
              style={styles.input}
            /> */}

            {mode === 'withdraw' && (
              <>
                <Text style={styles.label}>Account Holder Name</Text>
                <TextInput
                  placeholder="Your Name"
                  placeholderTextColor="#aaa"
                  value={upiName}
                  onChangeText={setUpiName}
                  style={styles.input}
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  placeholder="Your Phone Number"
                  placeholderTextColor="#aaa"
                  value={upiName}
                  onChangeText={setUpiName}
                  style={styles.input}
                />
                <Text style={styles.label}>Upi id</Text>
                <TextInput
                  placeholder="Your Upi Id"
                  placeholderTextColor="#aaa"
                  value={upiName}
                  onChangeText={setUpiName}
                  style={styles.input}
                />
              </>
              
            )}

            {mode === 'add' && amount.trim() && upiId.trim() && (
              <View style={styles.qrWrapper}>
                <QRCode value={`upi://pay?pa=${upiId}&am=${amount}`} size={180} />
                <Text style={{color:'white',margin:10,fontWeight:900}}>Make payment using the QR code and click on completed payment</Text>
              </View>
            )}
          </>
        )}

        {mode === 'verify' && (
          <>
            <Text style={styles.label}>UTR Reference No.</Text>
            <TextInput
              placeholder="UPI1234567890"
              placeholderTextColor="#aaa"
              value={upiRef}
              onChangeText={setUpiRef}
              style={styles.input}
            />
            <Text style={{color:'white',margin:10,fontWeight:600}}>Check in your Payment App you will find the number with UTR: XXXXXXXXXXXXX</Text>
            <Text style={styles.label}>Amount Paid</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <LinearGradient
          colors={['#00b894', '#55efc4']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>
            {mode === 'add'
              ? 'Completed Payment'
              : mode === 'withdraw'
              ? 'Submit Withdrawal'
              : 'Verify Payment'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeSwitch: {
    backgroundColor: '#00b894',
  },
  switchText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    color: '#fff',
    fontSize: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    textAlign: 'center',
  },
  qrWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '90%',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  backIconWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },  
});
