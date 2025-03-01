import React, { useState, useRef, useEffect } from 'react';
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

const VerificationCodeScreen = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [invalidFields, setInvalidFields] = useState<boolean[]>([false, false, false, false]);
  const router = useRouter();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Atualizar campos inválidos
    if (hasAttemptedSubmit) {
      const newInvalidFields = [...invalidFields];
      newInvalidFields[index] = text === '';
      setInvalidFields(newInvalidFields);
    }

    if (text && index < 3) {
      // Mover para o próximo campo de entrada
      inputRefs.current[index + 1]?.focus();
    } else if (text === '' && index > 0) {
      // Voltar para o campo anterior se o dígito for apagado
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteCode = (text: string) => {
    const newCode = text.split('').slice(0, 4);
    setCode(newCode);
    
    // Preencher o array com vazios se necessário
    while (newCode.length < 4) {
      newCode.push('');
    }
    
    // Atualizar campos inválidos
    if (hasAttemptedSubmit) {
      const newInvalidFields = newCode.map(digit => digit === '');
      setInvalidFields(newInvalidFields);
    }
    
    newCode.forEach((digit, index) => {
      if (index < 3 && digit) {
        inputRefs.current[index + 1]?.focus();
      }
    });
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

  const handleVerifyCode = () => {
    setHasAttemptedSubmit(true);
    
    const emptyFields = code.map(digit => digit === '');
    setInvalidFields(emptyFields);
    
    if (emptyFields.some(isEmpty => isEmpty)) {
      setCodeError('Todos os campos devem ser preenchidos');
      shakeError();
      return;
    }
    
    setCodeError('');
    setIsLoading(true);
    
    // Simulando um tempo de carregamento
    setTimeout(() => {
      // Simulando uma verificação de código inválido (para demonstração)
      const isCodeValid = Math.random() > 0.3; // 70% de chance de sucesso
      
      if (isCodeValid) {
        setIsLoading(false);
        router.push('/(auth)/reset-password');
      } else {
        setIsLoading(false);
        setCodeError('Código inválido. Por favor, verifique e tente novamente.');
        shakeError();
      }
    }, 1500);
  };

  const handleResendCode = () => {
    setIsResending(true);
    
    // Simulando o reenvio do código
    setTimeout(() => {
      setIsResending(false);
      // Limpar os campos para o novo código
      setCode(['', '', '', '']);
      setInvalidFields([false, false, false, false]);
      setHasAttemptedSubmit(false);
      setCodeError('');
      
      // Focar no primeiro campo
      inputRefs.current[0]?.focus();
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  // Função para verificar se os campos estão válidos
  const isCodeValid = () => {
    return code.every((digit) => digit !== '') && codeError === '';
  };

  // Reiniciar a validação quando o valor dos inputs mudar
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      setCodeError('');
    }
  }, [code]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0D47A1', '#1976D2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            disabled={isLoading || isResending}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <Text style={styles.title}>Verificação de Código</Text>
              <Text style={styles.subtitle}>
                Insira o código de 4 dígitos que você recebeu por SMS.
              </Text>
              
              <Animated.View 
                style={[
                  styles.codeWrapper,
                  { transform: [{ translateX: errorShakeAnim }] }
                ]}
              >
                {code.map((digit, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.inputContainer,
                      invalidFields[index] && styles.inputContainerError
                    ]}
                  >
                    <TextInput
                      style={styles.codeInput}
                      value={digit}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={(e) => {
                        if (e.nativeEvent.key === 'v' && (e.nativeEvent as any).shiftKey) {
                          handlePasteCode((e.nativeEvent as any).text);
                        }
                      }}
                      maxLength={1}
                      keyboardType="numeric"
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      editable={!isLoading && !isResending}
                    />
                  </View>
                ))}
              </Animated.View>
              
              {codeError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{codeError}</Text>
                </View>
              ) : null}
              
              <TouchableOpacity 
                style={[
                  styles.verifyButton,
                  { marginTop: responsiveSize(40, 0.5) },
                  (isLoading || isResending) && styles.buttonDisabled
                ]} 
                onPress={handleVerifyCode}
                disabled={isLoading || isResending}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.verifyButtonText}>VERIFICAR CÓDIGO</Text>
                    <Ionicons name="chevron-forward" size={24} color="#FFF" style={styles.arrowIcon} />
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.resendCodeButton,
                  (isLoading || isResending) && styles.buttonDisabled
                ]}
                onPress={handleResendCode}
                disabled={isLoading || isResending}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.resendCodeText}>REENVIAR CÓDIGO</Text>
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
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    width: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerError: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  codeInput: {
    width: '100%',
    height: responsiveSize(60, 0.2),
    color: '#FFFFFF',
    fontSize: responsiveSize(24, 0.2),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: isSmallScreen ? 12 : 14,
    marginLeft: 5,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#2196F3',
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
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  resendCodeButton: {
    marginTop: 25,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveSize(50, 0.2),
  },
  resendCodeText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
});

export default VerificationCodeScreen; 