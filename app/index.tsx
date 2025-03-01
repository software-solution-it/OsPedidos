import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Animated, KeyboardAvoidingView, Platform, Image, Dimensions, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mask as masker, unMask } from 'react-native-mask-text';

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const forgotPasswordOpacity = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  
  // Referência para os inputs
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  // Função para ocultar o teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Função para focar no campo de senha
  const focusPasswordInput = () => {
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }, 50);
  };

  const handlePhoneChange = (text: string) => {
    const maskedText = masker(text, '(99) 99999-9999');
    setPhone(maskedText);
  };

  const handlePasswordChange = (text: string) => {
    // Aceitar apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    setPassword(numericText);
  };

  const shakeError = () => {
    // Resetar o valor da animação
    errorShakeAnim.setValue(0);
    
    // Criar uma sequência de animações para o efeito de shake
    Animated.sequence([
      Animated.timing(errorShakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const handleLogin = () => {
    setPhoneError('');
    setPasswordError('');
    
    let hasError = false;

    if (!phone) {
      setPhoneError('Por favor, insira seu número de telefone.');
      hasError = true;
    }

    const unmaskedPhone = unMask(phone);
    if (unmaskedPhone.length !== 11) {
      setPhoneError('Por favor, insira um número de telefone válido.');
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Por favor, insira sua senha.');
      hasError = true;
    }
    
    if (hasError) {
      shakeError();
      return;
    }
    
    setIsLoading(true);
    
    // Simulando um tempo de carregamento
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(select)/select-cash');
    }, 1500);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const areFieldsValid = () => {
    return phone !== '' && password !== '' && phoneError === '' && passwordError === '';
  };

  useEffect(() => {
    setPhoneError('');
    setPasswordError('');
  }, [phone, password]);

  // Função para preparar a UI antes de focar em um input
  const prepareForKeyboard = () => {
    // Animar a opacidade para 0 imediatamente
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(forgotPasswordOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      setKeyboardVisible(true);
    });
  };

  // Efeito para iniciar a animação de fade in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Listeners para o teclado
    const keyboardWillShowListener = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', () => {
          // No iOS, o estado já deve ter sido atualizado pelo onFocus do input
        })
      : Keyboard.addListener('keyboardDidShow', () => {
          // No Android, o estado já deve ter sido atualizado pelo onFocus do input
        });
    
    const keyboardWillHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => {
          // Animar a opacidade de volta para 1 quando o teclado começar a desaparecer
          setKeyboardVisible(false);
          Animated.parallel([
            Animated.timing(logoOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(forgotPasswordOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start();
        })
      : Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
          // No Android, animar após o teclado desaparecer
          Animated.parallel([
            Animated.timing(logoOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(forgotPasswordOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start();
        });
    
    // Cleanup
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1A4B8B', '#2A70C2']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={[
              styles.contentContainer,
              isKeyboardVisible && styles.keyboardVisibleContainer
            ]}>
              <Animated.View 
                style={[
                  styles.logoSection,
                  { opacity: logoOpacity, height: isKeyboardVisible ? 0 : height * 0.35 }
                ]}
              >
                <View style={styles.logoContainer}>
                  <View style={styles.logoBackground}>
                    <Image
                      source={require('../assets/images/logo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.formContainer,
                  { opacity: fadeAnim, transform: [{ translateX: errorShakeAnim }] }
                ]}
              >
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <View style={[
                    styles.inputContainer,
                    phoneError ? styles.inputContainerError : null
                  ]}>
                    <TextInput
                      ref={phoneInputRef}
                      style={styles.input}
                      placeholder="(99) 99999-9999"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onFocus={prepareForKeyboard}
                      onSubmitEditing={focusPasswordInput}
                      blurOnSubmit={false}
                      editable={!isLoading}
                    />
                  </View>
                  {phoneError ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                      <Text style={styles.errorText}>{phoneError}</Text>
                    </View>
                  ) : null}
                </View>
                
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Senha (Apenas Números)</Text>
                  <View style={[
                    styles.inputContainer,
                    passwordError ? styles.inputContainerError : null
                  ]}>
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.input}
                      placeholder="Digite sua senha numérica"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                      onFocus={prepareForKeyboard}
                      onSubmitEditing={handleLogin}
                      editable={!isLoading}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                      <Text style={styles.errorText}>{passwordError}</Text>
                    </View>
                  ) : null}
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>ENTRAR</Text>
                      <Ionicons name="chevron-forward" size={24} color="#FFF" style={styles.arrowIcon} />
                    </>
                  )}
                </TouchableOpacity>
                
                <Animated.View style={{ opacity: forgotPasswordOpacity, height: isKeyboardVisible ? 0 : 'auto' }}>
                  <TouchableOpacity
                    style={[styles.forgotPasswordButton, isKeyboardVisible && { height: 0, marginTop: 0, padding: 0 }]}
                    onPress={handleForgotPassword}
                    disabled={isLoading || isKeyboardVisible}
                  >
                    <Text style={styles.forgotPasswordText}>ESQUECI MINHA SENHA</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    paddingBottom: height * 0.10,
  },
  keyboardVisibleContainer: {
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? height * 0.1 : height * 0.05,
    paddingBottom: Platform.OS === 'ios' ? height * 0.1 : height * 0.05,
  },
  logoSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: responsiveSize(150, 0.3),
    height: responsiveSize(150, 0.3),
    borderRadius: responsiveSize(75, 0.3),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: responsiveSize(100, 0.3),
    height: responsiveSize(100, 0.3),
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: height * 0.025,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  inputLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    height: responsiveSize(50, 0.2),
  },
  inputContainerError: {
    borderBottomColor: '#FF6B6B',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 14 : 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: isSmallScreen ? 10 : 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    height: responsiveSize(60, 0.2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  forgotPasswordButton: {
    marginTop: 25,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveSize(50, 0.2),
    overflow: 'hidden',
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
});

export default LoginScreen;