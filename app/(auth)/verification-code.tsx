import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Text as NativeText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const VerificationCodeScreen = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const router = useRouter();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

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
    newCode.forEach((digit, index) => {
      if (index < 3 && digit) {
        inputRefs.current[index + 1]?.focus();
      }
    });
  };

  const handleVerifyCode = () => {
    setCodeError('');

    if (code.every((digit) => digit !== '')) {
      // Aqui você pode adicionar a lógica para verificar o código
      router.push('/(auth)/reset-password');
    } else {
      setCodeError('Por favor, insira um código válido.');
    }
  };

  // Função para verificar se os campos estão válidos
  const areFieldsValid = () => {
    return code.every((digit) => digit !== '') && codeError === '';
  };

  // Reiniciar a validação quando o valor dos inputs mudar
  useEffect(() => {
    setCodeError('');
  }, [code]);

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Verificação de Código</Text>
        <Text style={styles.subtitle}>
          Insira o código de 4 dígitos que você recebeu por e-mail.
        </Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <View key={index} style={styles.inputContainer}>
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
              />
            </View>
          ))}
        </View>
        {codeError ? <NativeText style={styles.errorText}>{codeError}</NativeText> : null}
        <TouchableOpacity 
          style={[styles.buttonContainer, areFieldsValid() ? styles.buttonValid : styles.buttonInvalid]} 
          onPress={handleVerifyCode}
          disabled={!areFieldsValid()}
        >
          {areFieldsValid() ? (
            <LinearGradient
              colors={['#87CEFA', '#4682B4']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Verificar Código</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonGradient, { backgroundColor: '#87CEFA' }]}>
              <Text style={[styles.buttonText, { opacity: 0.5 }]}>Verificar Código</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0a7ea4',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: {
    width: '23%',
  },
  codeInput: {
    width: '100%',
    height: 50,
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonValid: {
    opacity: 1,
  },
  buttonInvalid: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'left',
  },
});

export default VerificationCodeScreen; 