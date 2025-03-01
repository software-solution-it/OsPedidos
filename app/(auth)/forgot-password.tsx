import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform, ScrollView, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { mask as masker, unMask } from 'react-native-mask-text';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

const ForgotPasswordScreen = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    // Animação de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendCode = () => {
    setPhoneError('');

    if (!phone) {
      setPhoneError('Por favor, insira seu número de telefone.');
      return; 
    }

    const unmaskedPhone = unMask(phone);
    if (unmaskedPhone.length !== 11) {
      setPhoneError('Por favor, insira um número de telefone válido.');
      return;
    }

    setIsLoading(true);
    
    // Simulando um tempo de carregamento
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(auth)/verification-code');
    }, 1500);
  };

  const handlePhoneChange = (text: string) => {
    const maskedText = masker(text, '(99) 99999-9999');
    setPhone(maskedText);
  };

  const handleBack = () => {
    router.back();
  };

  // Função para verificar se os campos estão válidos
  const isFieldValid = () => {
    return phone !== '' && phoneError === '';
  };

  // Reiniciar a validação quando o valor do input mudar
  useEffect(() => {
    setPhoneError('');
  }, [phone]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1A4B8B', '#2A70C2']}
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
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.subtitle}>
                Insira seu número de telefone para receber um código de verificação.
              </Text>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    editable={!isLoading}
                  />
                </View>
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  { marginTop: responsiveSize(40, 0.5) },
                  isLoading && styles.buttonDisabled
                ]} 
                onPress={handleSendCode}
                disabled={!isFieldValid() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.sendButtonText}>ENVIAR CÓDIGO</Text>
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
    paddingBottom: 50, // Ajuste para compensar o botão de voltar no topo
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
  input: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 14 : 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: isSmallScreen ? 10 : 12,
    marginTop: 5,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    height: responsiveSize(50, 0.2),
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
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default ForgotPasswordScreen; 