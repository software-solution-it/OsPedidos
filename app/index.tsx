import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Animated, KeyboardAvoidingView, Platform, Image, Dimensions, Easing, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  
  // Referência para a animação de rotação
  const spinAnimation = useRef(null);
  // Referência para os inputs
  const passwordInputRef = useRef(null);

  // Função para iniciar a animação de rotação
  const startSpinAnimation = () => {
    spinValue.setValue(0); // Resetar o valor
    
    // Armazenar a referência da animação para poder cancelá-la depois
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    spinAnimation.current.start();
  };

  // Função para ocultar o teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Função para focar no próximo input
  const focusPasswordInput = () => {
    // Ocultar o círculo antes de focar no input
    setKeyboardVisible(true);
    
    // Pequeno atraso para garantir que a UI seja atualizada antes de focar
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }, 50);
  };

  React.useEffect(() => {
    // Animação de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Iniciar a animação de rotação
    startSpinAnimation();
    
    // Listeners do teclado
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        // Reiniciar a animação quando o teclado é fechado
        startSpinAnimation();
      }
    );

    return () => {
      // Limpar listeners e animações
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogin = () => {
    setPhoneError('');
    setPasswordError('');

    if (!phone) {
      setPhoneError('Por favor, insira seu telefone.');
      return;
    }

    if (!password) {
      setPasswordError('Por favor, insira sua senha.');
      return;
    }

    router.push('/(select)/select-cash');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {!isKeyboardVisible && (
          <View style={styles.circleContainer}>
            <Animated.View 
              style={[
                styles.largeSpinningCircle, 
                { 
                  transform: [
                    { rotate: spin },
                  ],
                }
              ]}
            >
              <LinearGradient
                colors={['#4A90E2', '#2A70C2']}
                style={styles.gradientCircle}
              >
                <View style={styles.innerCircleWhite}>
                  {/* Centro branco */}
                </View>
                <View style={styles.waveContainer}>
                  <View style={styles.waveLine} />
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}
        
        <View style={styles.background}>
          <LinearGradient
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.gradient}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={[
                  styles.header,
                  { marginBottom: responsiveSize(60, 0.5) }
                ]}>
                  <Image
                    source={require('../assets/images/logo.png')}
                    style={[
                      styles.logo,
                      { 
                        width: responsiveSize(130, 0.2),
                        height: responsiveSize(130, 0.2),
                      }
                    ]}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="(11) 99999-9999"
                      placeholderTextColor="#999"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onFocus={() => setKeyboardVisible(true)}
                      onSubmitEditing={focusPasswordInput}
                      blurOnSubmit={false}
                    />
                  </View>
                  {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Senha</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.input}
                      placeholder="••••"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      keyboardType="numeric"
                      maxLength={6}
                      returnKeyType="done"
                      onFocus={() => setKeyboardVisible(true)}
                      onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    { marginTop: responsiveSize(40, 0.5) }
                  ]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>ENTRAR</Text>
                  <Ionicons name="chevron-forward" size={24} color="#FFF" style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.forgotPasswordButton,
                    { marginTop: responsiveSize(30, 0.5) }
                  ]}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.06,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
    letterSpacing: 1,
  },
  inputWrapper: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    height: responsiveSize(50, 0.2),
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: isSmallScreen ? 14 : 16,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    height: responsiveSize(50, 0.2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  forgotPasswordButton: {
    marginTop: 30,
    alignSelf: 'center',
    padding: isSmallScreen ? 12 : 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 25,
    minWidth: responsiveSize(200, 0.3),
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: isSmallScreen ? 10 : 12,
    marginTop: 5,
  },
  largeSpinningCircle: {
    position: 'absolute',
    bottom: isSmallScreen ? -50 : -60,
    right: isSmallScreen ? -50 : -60,
    width: responsiveSize(180, 0.3),
    height: responsiveSize(180, 0.3),
    borderRadius: responsiveSize(90, 0.3),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleWhite: {
    width: '50%',
    height: '50%',
    borderRadius: responsiveSize(45, 0.3),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    width: '150%',
    height: isSmallScreen ? 15 : 20,
    overflow: 'hidden',
    transform: [{ rotate: '45deg' }],
  },
  waveLine: {
    width: '100%',
    height: isSmallScreen ? 15 : 20,
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallScreen ? 8 : 10,
    transform: [
      { scaleY: 0.5 },
      { translateY: isSmallScreen ? -2 : -3 }
    ],
  },
  circleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
    pointerEvents: 'none',
  },
});

export default LoginScreen; 