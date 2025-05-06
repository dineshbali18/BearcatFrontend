import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Image, StyleSheet, Animated, Text, Easing,
  TouchableOpacity, Alert, TextInput, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getwinner, placeBet, getHomeData } from '../../helper/Home';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');
const DRAW_DELAY = 270000;
const SPIN_DURATION = 85;

const LotteryWheel = () => {
  const images = [
    { id: 1, source: require('../../images/tiger.jpeg'), name: 'Tiger' },
    { id: 2, source: require('../../images/unicorn.jpeg'), name: 'Unicorn' },
    { id: 3, source: require('../../images/lion.jpeg'), name: 'Lion' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const [lotteryId, setLotteryId] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [phase, setPhase] = useState('loading');
  const [betAmount, setBetAmount] = useState('10');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [walletAmt, setWalletAmount] = useState(0);
  const [nextLotteryTime, setNextLotteryTime] = useState(null);
  const [timeUntilNextLottery, setTimeUntilNextLottery] = useState(0);
  const [serverOffset, setServerOffset] = useState(0);
  const [apiToken] = useState('your_api_token');

  const spinInterval = useRef(null);
  const winnerTimeout = useRef(null);
  const countdownInterval = useRef(null);
  const nextLotteryInterval = useRef(null);
  const winnerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    if (titleRef.current) {
      titleRef.current.bounceIn(800);
    }
  }, []);

  const fetchAndCacheHomeData = async () => {
    try {
      const cached = await AsyncStorage.getItem('home-data');
      if (cached) {
        const parsed = JSON.parse(cached);
        setLotteryId(parsed.lottery.lottery_id);
        setStartTime(parsed.lottery.starttime);
        setWalletAmount(parsed.wallet.wallet_balance);
      }

      const live = await getHomeData();
      if (live && live.lottery && live.wallet && live.server_time) {
        await AsyncStorage.setItem('home-data', JSON.stringify(live));
        setLotteryId(live.lottery.lottery_id);
        setStartTime(live.lottery.starttime);
        setWalletAmount(live.wallet.wallet_balance);

        const serverTime = new Date(live.server_time).getTime();
        const localTime = Date.now();
        const offset = serverTime - localTime;
        setServerOffset(offset);

        if (live.lottery.winner === -1) {
          startLottery(live.lottery, offset);
        } else {
          setWinnerIndex(live.lottery.winner - 1);
          setCurrentIndex(live.lottery.winner - 1);
          setPhase('winner');
          animateWinner();
          calculateNextLotteryTime(live.lottery.starttime, offset);
          setTimeout(fetchAndCacheHomeData, 2000);
        }
      } else {
        console.warn("live data is empty or incomplete:", live);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      setTimeout(fetchAndCacheHomeData, 2000);
    }
  };

  const startLottery = (lotteryData, offset = serverOffset) => {
    stopSpinning();
    setPhase('spinning');
    setWinnerIndex(-1);
    setSelectedIcon(null);

    const startTimestamp = new Date(lotteryData.starttime).getTime();
    const now = Date.now() + offset;
    const drawTime = startTimestamp + DRAW_DELAY;
    const timeUntilDraw = drawTime - now;

    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setCountdown(Math.max(0, Math.floor(timeUntilDraw / 1000)));
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(countdownInterval.current);
          handleWinner();
          return 0;
        }
        return newCount;
      });
    }, 1000);

    spinInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, SPIN_DURATION);

    if (winnerTimeout.current) clearTimeout(winnerTimeout.current);
    winnerTimeout.current = setTimeout(handleWinner, timeUntilDraw);
  };

  const calculateNextLotteryTime = (startTime, offset = serverOffset) => {
    const startTimestamp = new Date(startTime).getTime();
    const nextLotteryTimestamp = startTimestamp + DRAW_DELAY;
    const now = Date.now() + offset;
    const timeUntilNext = nextLotteryTimestamp - now;

    setNextLotteryTime(new Date(nextLotteryTimestamp));
    setTimeUntilNextLottery(Math.max(0, Math.floor(timeUntilNext / 1000)));

    if (nextLotteryInterval.current) clearInterval(nextLotteryInterval.current);
    nextLotteryInterval.current = setInterval(() => {
      setTimeUntilNextLottery(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(nextLotteryInterval.current);
          setTimeout(() => fetchAndCacheHomeData(), 2000);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  useEffect(() => {
    fetchAndCacheHomeData();
    return () => {
      stopSpinning();
      clearTimeout(winnerTimeout.current);
      clearInterval(countdownInterval.current);
      clearInterval(nextLotteryInterval.current);
    };
  }, []);

  const stopSpinning = () => {
    if (spinInterval.current) clearInterval(spinInterval.current);
  };

  const animateWinner = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(winnerAnim, { toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(winnerAnim, { toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    ).start();
  };

  const handleWinner = async () => {
    try {
      stopSpinning();
      const winnerData = await getwinner(lotteryId);
      if (winnerData?.winner !== undefined && winnerData.winner !== -1) {
        const winner = winnerData.winner - 1;
        setWinnerIndex(winner);
        setCurrentIndex(winner);
        setPhase('winner');
        animateWinner();
        calculateNextLotteryTime(startTime);
        setTimeout(() => fetchAndCacheHomeData(), 5000);
      } else {
        winnerTimeout.current = setTimeout(handleWinner, 100);
      }
    } catch (error) {
      console.error('Error fetching winner:', error);
      winnerTimeout.current = setTimeout(handleWinner, 100);
    }
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  const handlePlaceBet = async () => {
    if (!selectedIcon) return Alert.alert('Error', 'Please select an icon to bet on');
    if (!betAmount || isNaN(betAmount) || parseFloat(betAmount) <= 0)
      return Alert.alert('Error', 'Please enter a valid bet amount');

    try {
      const response = await placeBet({
        user_id: 1,
        lottery_id: lotteryId,
        bet_placed_icon: selectedIcon,
        amount: parseFloat(betAmount),
        api_token: apiToken,
      });

      if (response.status == 1) {
        Alert.alert('Success', `Your bet of $${betAmount} on ${images.find(img => img.id === selectedIcon).name} has been placed!`);
        fetchAndCacheHomeData(); // Update wallet
      } else {
        Alert.alert('Error', response.message || 'Failed to place bet');
      }
    } catch (err) {
      console.error('Bet error:', err);
      Alert.alert('Error', 'Failed to place bet');
    }
  };
  const formatDateTime = (date) => {
    if (!date) return '';
    const increased = new Date(date.getTime() + 60000);
    return increased.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
    <LinearGradient 
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animatable.Text 
          ref={titleRef}
          style={styles.title}
          animation="bounceIn"
          duration={1000}
        >
          JACK PICK
        </Animatable.Text>
        
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={styles.infoLabel}>Lottery ID :</Text>
          <Text style={styles.infoValue}>{lotteryId}</Text>
          </View>
          {phase === 'spinning' && (
            <Animatable.View 
              style={styles.countdownContainer}
              animation="pulse"
              iterationCount="infinite"
            >
              <Text style={styles.countdownLabel}>Drawing in</Text>
              <Text style={styles.countdown}>{formatTime(countdown)}</Text>
            </Animatable.View>
          )}
          
          {phase === 'winner' && (
            <Animatable.View animation="fadeIn">
              <View style={styles.winnerAnnouncement}>
                <Text style={styles.winnerText}>WINNER SELECTED!</Text>
              </View>
              <View style={styles.nextLotteryInfo}>
                <Text style={styles.nextLotteryLabel}>Next lottery:</Text>
                <Text style={styles.nextLotteryTime}>{formatDateTime(nextLotteryTime)}</Text>
                <Text style={styles.nextLotteryCountdown}>Starts in: {formatTime(timeUntilNextLottery)}</Text>
              </View>
            </Animatable.View>
          )}
          
          {phase === 'loading' && (
            <Animatable.View animation="fadeIn" style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading lottery...</Text>
            </Animatable.View>
          )}
        </View>
        
        <View style={styles.wheelContainer}>
          {images.map((img, index) => {
            const isWinner = winnerIndex === index;
            const isActive = currentIndex === index || phase !== 'spinning';
            const isSelected = selectedIcon === img.id;
            
            const scale = winnerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, isWinner ? 1.3 : 0.95],
            });
            
            const opacity = isActive ? 1 : 0.3;
            const borderWidth = isWinner ? 4 : (isSelected ? 4 : 0);
            const borderColor = isWinner ? '#f9ca24' : (isSelected ? '#00b894' : 'transparent');
            
            return (
              <TouchableOpacity 
                key={index}
                onPress={() => phase === 'spinning' && setSelectedIcon(img.id)}
                disabled={phase !== 'spinning'}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.imageContainer,
                    {
                      opacity,
                      transform: [{ scale }],
                      borderWidth,
                      borderColor,
                      shadowColor: isWinner ? '#f9ca24' : (isSelected ? '#00b894' : '#000'),
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isWinner ? 0.9 : (isSelected ? 0.6 : 0.2),
                      shadowRadius: isWinner ? 20 : (isSelected ? 10 : 5),
                    }
                  ]}
                >
                  <Image source={img.source} style={styles.image} />
                  {isWinner && (
                    <Animatable.View 
                      style={styles.winnerBadge}
                      animation="rubberBand"
                      iterationCount="infinite"
                    >
                      <Text style={styles.winnerBadgeText}>WINNER</Text>
                    </Animatable.View>
                  )}
                  {isSelected && (
                    <Animatable.View 
                      style={styles.selectedBadge}
                      animation="pulse"
                      iterationCount="infinite"
                    >
                      <Text style={styles.selectedBadgeText}>YOUR BET</Text>
                    </Animatable.View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {phase === 'spinning' && (
          <Animatable.View 
            style={styles.betContainer}
            animation="fadeInUp"
            duration={800}
          >
            <Text style={styles.betTitle}>Place Your Bet</Text>
          
            <View style={styles.betSection}>
              <Text style={styles.sectionTitle}>Select Icon</Text>
              <View style={styles.iconButtonsContainer}>
                {images.map((img) => (
                  <TouchableOpacity
                    key={img.id}
                    style={[
                      styles.iconButton,
                      selectedIcon === img.id && styles.selectedIconButton,
                      phase !== 'spinning' && styles.disabledIconButton
                    ]}
                    onPress={() => setSelectedIcon(img.id)}
                    disabled={phase !== 'spinning'}
                  >
                    <Image source={img.source} style={styles.iconImage} />
                    {selectedIcon === img.id && (
                      <View style={styles.iconSelectionIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          
            <View style={styles.betSection}>
              <Text style={styles.sectionTitle}>Bet Amount</Text>
              <View style={styles.betInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.betInput}
                  value={betAmount}
                  onChangeText={setBetAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#aaa"
                  selectionColor="#00b894"
                />
              </View>
            </View>
          
            <TouchableOpacity 
              style={[styles.betButton, (!selectedIcon || !betAmount) && styles.disabledButton]} 
              onPress={handlePlaceBet}
              disabled={!selectedIcon || !betAmount}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={!selectedIcon || !betAmount ? ['#95a5a6', '#7f8c8d'] : ['#00b894', '#55efc4']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.betButtonText}>
                  PLACE BET
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animated.View>
      </SafeAreaView>
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  content: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 0,
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.17)',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: '#aaa',
    marginBottom: 1,
    margin: 10,
  },
  infoValue: {
    fontSize: 20,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    marginBottom: 1,
    margin: 5,
  },
  countdownContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 30,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: '#fff',
    marginBottom: 5,
  },
  countdown: {
    fontSize: 24,
    fontFamily: 'Avenir-Black',
    color: '#fff',
  },
  winnerAnnouncement: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(46, 213, 115, 0.3)',
  },
  winnerText: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#2ed573',
    textAlign: 'center',
    letterSpacing: 1,
  },
  nextLotteryInfo: {
    alignItems: 'center',
  },
  nextLotteryLabel: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: '#aaa',
    marginBottom: 5,
  },
  nextLotteryTime: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    marginBottom: 5,
  },
  nextLotteryCountdown: {
    fontSize: 16,
    fontFamily: 'Avenir-Medium',
    color: '#f9ca24',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 15,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Avenir-Medium',
    color: '#3498db',
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    maxHeight: height * 0.3,
    marginBottom: 10,
  },
  imageContainer: {
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 8,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 12,
  },
  winnerBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#f9ca24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#f9ca24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  winnerBadgeText: {
    fontSize: 12,
    fontFamily: 'Avenir-Black',
    color: '#000',
    letterSpacing: 1,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#00b894',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    letterSpacing: 1,
  },
  betContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  betTitle: {
    fontSize: 20,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    fontWeight: 800,
  },
  betSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: '#aaa',
    marginBottom: 10,
    fontWeight: 900,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconButton: {
    borderColor: '#00b894',
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    transform: [{ scale: 1.1 }],
  },
  disabledIconButton: {
    opacity: 0.5,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconSelectionIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00b894',
    borderWidth: 2,
    borderColor: '#fff',
  },
  betInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    marginRight: 10,
  },
  betInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    height: '100%',
  },
  betButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  gradientButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betButtonText: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: '#fff',
    letterSpacing: 1,
    fontWeight: 900,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default LotteryWheel;