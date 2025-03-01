import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const router = useRouter();
  const confirmPasswordRef = useRef<TextInput>(null);
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleNewPasswordChange = (text: string) => {
    // Aceitar apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Limitar a 12 dígitos
    if (numericText.length <= 12) {
      setNewPassword(numericText);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    // Aceitar apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Limitar a 12 dígitos
    if (numericText.length <= 12) {
      setConfirmPassword(numericText);
    }
  };

  const handleResetPassword = () => {
    setHasAttemptedSubmit(true);
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (newPassword.length < 4) {
      setNewPasswordError('A senha deve ter entre 4 e 12 dígitos.');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
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
      router.push('/');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const focusConfirmPassword = () => {
    confirmPasswordRef.current?.focus();
  };

  // Função para verificar se os campos estão válidos
  const areFieldsValid = () => {
    return newPassword.length >= 4 && 
           confirmPassword === newPassword && 
           newPasswordError === '' && 
           confirmPasswordError === '';
  };

  // Reiniciar a validação quando o valor dos inputs mudar
  useEffect(() => {
    if (hasAttemptedSubmit) {
      if (newPassword.length < 4) {
        setNewPasswordError('A senha deve ter entre 4 e 12 dígitos.');
      } else {
        setNewPasswordError('');
      }
      
      if (confirmPassword !== '' && newPassword !== confirmPassword) {
        setConfirmPasswordError('As senhas não coincidem.');
      } else {
        setConfirmPasswordError('');
      }
    }
  }, [newPassword, confirmPassword, hasAttemptedSubmit]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A2E65', '#0D47A1']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <Animated.View 
              style={[
                styles.content, 
                { opacity: fadeAnim },
                { transform: [{ translateX: errorShakeAnim }] }
              ]}
            >
              <Text style={styles.title}>Redefinir Senha</Text>
              <Text style={styles.subtitle}>
                Crie uma nova senha numérica entre 4 e 12 dígitos.
              </Text>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nova Senha (Apenas Números)</Text>
                <View style={[
                  styles.inputContainer,
                  newPasswordError && hasAttemptedSubmit && styles.inputContainerError
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite 4 a 12 números"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={newPassword}
                    onChangeText={handleNewPasswordChange}
                    secureTextEntry={!showNewPassword}
                    returnKeyType="next"
                    onSubmitEditing={focusConfirmPassword}
                    editable={!isLoading}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
                {newPasswordError && hasAttemptedSubmit ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                    <Text style={styles.errorText}>{newPasswordError}</Text>
                  </View>
                ) : null}
              </View>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirmar Senha (Apenas Números)</Text>
                <View style={[
                  styles.inputContainer,
                  confirmPasswordError && hasAttemptedSubmit && styles.inputContainerError
                ]}>
                  <TextInput
                    ref={confirmPasswordRef}
                    style={styles.input}
                    placeholder="Repita a senha numérica"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                    editable={!isLoading}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError && hasAttemptedSubmit ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  </View>
                ) : null}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.resetButton,
                  { marginTop: responsiveSize(40, 0.5) },
                  isLoading && styles.buttonDisabled
                ]} 
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.resetButtonText}>REDEFINIR SENHA</Text>
                    <Ionicons name="chevron-forward" size={24} color="#FFF" style={styles.arrowIcon} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
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
    paddingHorizontal: width * 0.08,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: responsiveSize(32, 0.3),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: responsiveSize(16, 0.2),
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
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
  resetButton: {
    backgroundColor: '#1565C0',
    borderRadius: 25,
    height: responsiveSize(60, 0.2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(21, 101, 192, 0.7)',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default ResetPasswordScreen;