import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Image, StyleSheet, Animated, Text, Easing,
  TouchableOpacity, Alert, TextInput, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWinner, placeBet, getHomeData, getWalletAmount } from '../../helper/Home';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
const LOTTERY_DURATION = 300000; // 5 minutes in milliseconds
const BETTING_CLOSE_TIME = 240000; // Close betting at 4:00 (4 minutes)
const WINNER_CHECK_START = 270000; // Start checking for winner at 4:30 (270 seconds)
const WINNER_CHECK_INTERVAL = 2000; // Check for winner every 2 seconds
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
  const [bettingOpen, setBettingOpen] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [isAnimatingWinner, setIsAnimatingWinner] = useState(false);
  const [headerRefreshKey, setHeaderRefreshKey] = useState(0);
  const user_id = useSelector((state)=>state.user.userID)
  const token = useSelector((state)=>state.user.token)
  const spinInterval = useRef(null);
  const winnerTimeout = useRef(null);
  const countdownInterval = useRef(null);
  const nextLotteryInterval = useRef(null);
  const winnerCheckInterval = useRef(null);
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
      }

      const live = await getHomeData(token);
      if (live && live.lottery && live.server_time) {
        await AsyncStorage.setItem('home-data', JSON.stringify(live));
        setLotteryId(live.lottery.lottery_id);
        setStartTime(live.lottery.starttime);

        const serverTime = new Date(live.server_time).getTime();
        const localTime = Date.now();
        const offset = serverTime - localTime;
        setServerOffset(offset);

        const actualWinner = typeof live.lottery.winner === 'number' ? live.lottery.winner : -1;

        if (actualWinner === -1) {
          startLottery(live.lottery, offset);
        } else if (actualWinner > 0) {
          handleWinner(actualWinner);
          calculateNextLotteryTime(live.lottery.starttime, offset);
        } else {
          console.warn("Unexpected winner value in live data:", live.lottery.winner);
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
    // Reset all states for new lottery
    setWinnerIndex(-1);
    setWinnerName('');
    setIsAnimatingWinner(false);
    winnerAnim.setValue(0);
    stopSpinning();
    clearIntervals();

    const startTimestamp = new Date(lotteryData.starttime).getTime();
    const now = Date.now() + offset;
    const bettingCloseTime = startTimestamp + BETTING_CLOSE_TIME;
    const winnerCheckTime = startTimestamp + WINNER_CHECK_START;
    const drawTime = startTimestamp + LOTTERY_DURATION;

    // Set initial phase based on current time
    if (now < bettingCloseTime) {
      setPhase('spinning');
      setBettingOpen(true);
    } else if (now < winnerCheckTime) {
      setPhase('spinning');
      setBettingOpen(false);
    } else {
      setPhase('waiting-for-winner');
      setBettingOpen(false);
      startCheckingWinner(lotteryData.lottery_id);
    }

    // Set countdown to betting close or draw time
    const initialCountdown = now < bettingCloseTime 
      ? Math.max(0, Math.floor((bettingCloseTime - now) / 1000))
      : Math.max(0, Math.floor((drawTime - now) / 1000));
    
    setCountdown(initialCountdown);

    // Start countdown timer
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          if (bettingOpen) {
            // Betting just closed
            setBettingOpen(false);
            const timeUntilDraw = Math.max(0, Math.floor((drawTime - (Date.now() + offset)) / 1000));
            return timeUntilDraw;
          } else {
            // Draw time reached
            clearInterval(countdownInterval.current);
            return 0;
          }
        }
        return newCount;
      });
    }, 1000);

    // Start spinning
    spinInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, SPIN_DURATION);

    // Schedule winner check at 4:30
    const timeUntilWinnerCheck = winnerCheckTime - now;
    if (timeUntilWinnerCheck > 0) {
      winnerTimeout.current = setTimeout(() => {
        startCheckingWinner(lotteryData.lottery_id);
      }, timeUntilWinnerCheck);
    } else if (now < drawTime) {
      // If we're past 4:30 but before 5:00, check immediately
      startCheckingWinner(lotteryData.lottery_id);
    }

    // Calculate next lottery time
    calculateNextLotteryTime(lotteryData.starttime, offset);
  };

  const startCheckingWinner = (lotteryId) => {
    setPhase('waiting-for-winner');
    
    if (winnerCheckInterval.current) clearInterval(winnerCheckInterval.current);
    
    const checkWinner = async () => {
      try {
        const winnerData = await getWinner(lotteryId,token);
        console.log('Winner check response:', winnerData);
        
        // Handle both object and direct number responses
        const winner = winnerData?.winner || winnerData;
        
        if (typeof winner === 'number' && winner > 0) {
          // Valid winner found (1, 2, or 3)
          clearInterval(winnerCheckInterval.current);
          handleWinner(winner);
        } else if (winner === -1 || winner === null || winner === undefined) {
          // Winner not yet available
          console.log('Winner not yet determined...');
        } else {
          console.warn('Unexpected winner data format:', winnerData);
        }
      } catch (error) {
        console.error('Error checking winner:', error);
      }
    };
    
    // Initial check
    checkWinner();
    
    // Set up interval for subsequent checks
    winnerCheckInterval.current = setInterval(checkWinner, WINNER_CHECK_INTERVAL);
  };
  
  const handleWinner = (winnerId) => {
    // Ensure winnerId is a number between 1-3
    const validWinnerId = Math.max(1, Math.min(3, parseInt(winnerId)));
    const winnerIndex = validWinnerId - 1;
    
    setWinnerIndex(winnerIndex);
    setCurrentIndex(winnerIndex);
    setWinnerName(images[winnerIndex].name);
    setPhase('winner');
    setBettingOpen(false);
    animateWinner();
    setHeaderRefreshKey(prev => prev + 1);
  };
  const animateWinner = () => {
    setIsAnimatingWinner(true);
    winnerAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(winnerAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(winnerAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
      ])
    ).start();
  };

  const calculateNextLotteryTime = (startTime, offset = serverOffset) => {
    const startTimestamp = new Date(startTime).getTime();
    const nextLotteryTimestamp = startTimestamp + LOTTERY_DURATION;
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

  const clearIntervals = () => {
    stopSpinning();
    clearTimeout(winnerTimeout.current);
    clearInterval(countdownInterval.current);
    clearInterval(winnerCheckInterval.current);
    clearInterval(nextLotteryInterval.current);
    winnerAnim.setValue(0);
  };

  useEffect(() => {
    fetchAndCacheHomeData();
    getAmount();
    return () => {
      clearIntervals();
    };
  }, []);

  const getAmount = async()=>{
    const data = await getWalletAmount(token);
    console.log("!!!!!",data)
    setWalletAmount(data?.wallet_balance)
  }



  const stopSpinning = () => {
    if (spinInterval.current) clearInterval(spinInterval.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlaceBet = async () => {
    if (!selectedIcon) return Alert.alert('Error', 'Please select an icon to bet on');
    if (!betAmount || isNaN(betAmount)) return Alert.alert('Error', 'Please enter a valid bet amount');
    
    const amount = parseFloat(betAmount);
    if (amount <= 30) return Alert.alert('Error', 'Bet amount must be greater than 30');
    if (amount > walletAmt) return Alert.alert('Error', 'Insufficient funds');

    try {
      const response = await placeBet({
        user_id: user_id,
        lottery_id: lotteryId,
        bet_placed_icon: selectedIcon,
        amount: amount,
        api_token: apiToken,
      },token);

      if (response.status == 1) {
        Alert.alert('Success', `Your bet of $${amount} on ${images.find(img => img.id === selectedIcon).name} has been placed!`);
        fetchAndCacheHomeData();
        setHeaderRefreshKey(headerRefreshKey+1);
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCountdownLabel = () => {
    if (phase === 'spinning') {
      return bettingOpen ? 'Bets closing in' : 'Winner Processing';
    }
    return '';
  };

  return (
    <LinearGradient 
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header refreshTrigger={headerRefreshKey} />
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
              <Text style={styles.infoLabel}>Lottery ID:</Text>
              <Text style={styles.infoValue}>{lotteryId}</Text>
            </View>
            
            {phase === 'spinning' && (
              <Animatable.View 
                style={[
                  styles.countdownContainer,
                  { backgroundColor: bettingOpen ? 'rgba(231, 76, 60, 0.2)' : 'rgba(241, 196, 15, 0.2)' }
                ]}
                animation="pulse"
                iterationCount="infinite"
              >
                <Text style={styles.countdownLabel}>{getCountdownLabel()}</Text>
                <Text style={styles.countdown}>{formatTime(countdown)}</Text>
                {!bettingOpen && (
                  <Text style={styles.bettingClosedText}>BETTING CLOSED</Text>
                )}
              </Animatable.View>
            )}
            
            {phase === 'waiting-for-winner' && (
              <Animatable.View animation="fadeIn">
                <View style={styles.winnerAnnouncement}>
                  <Text style={styles.winnerText}>DRAW COMPLETE - DETERMINING WINNER...</Text>
                </View>
              </Animatable.View>
            )}
            
            {phase === 'winner' && (
              <Animatable.View animation="fadeIn">
                <View style={styles.winnerAnnouncement}>
                  <Text style={styles.winnerText}>WINNER: {winnerName.toUpperCase()}!</Text>
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
              
              const scale = isWinner && isAnimatingWinner 
                ? winnerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  })
                : 1;
              
              const opacity = isActive ? 1 : 0.3;
              const borderWidth = isWinner && isAnimatingWinner ? 4 : (isSelected ? 4 : 0);
              const borderColor = isWinner && isAnimatingWinner ? '#f9ca24' : (isSelected ? '#00b894' : 'transparent');
              
              return (
                <TouchableOpacity 
                  key={index}
                  onPress={() => bettingOpen && setSelectedIcon(img.id)}
                  disabled={!bettingOpen}
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
                        animation={isAnimatingWinner ? "rubberBand" : undefined}
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
          
          {(phase === 'spinning' && bettingOpen) && (
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
                        !bettingOpen && styles.disabledIconButton
                      ]}
                      onPress={() => setSelectedIcon(img.id)}
                      disabled={!bettingOpen}
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
                  <Text style={styles.currencySymbol}>₹</Text>
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

          {(phase === 'spinning' && !bettingOpen) && (
            <Animatable.View 
              style={styles.betClosedContainer}
              animation="fadeInUp"
              duration={800}
            >
              <Text style={styles.betClosedText}>BETTING IS NOW CLOSED</Text>
              <Text style={styles.betClosedSubtext}>Winner will be announced shortly</Text>
            </Animatable.View>
          )}

          {phase === 'waiting-for-winner' && (
            <Animatable.View 
              style={styles.betClosedContainer}
              animation="fadeInUp"
              duration={800}
            >
              <Text style={styles.betClosedText}>DETERMINING WINNER...</Text>
              <Text style={styles.betClosedSubtext}>Please wait while we calculate the results</Text>
            </Animatable.View>
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
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
  bettingClosedText: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: '#f9ca24',
    marginTop: 5,
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
  betClosedContainer: {
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
    alignItems: 'center',
  },
  betClosedText: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#f9ca24',
    textAlign: 'center',
    marginBottom: 5,
  },
  betClosedSubtext: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: '#fff',
    textAlign: 'center',
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