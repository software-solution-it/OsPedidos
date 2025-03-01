import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Text as NativeText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { mask as masker, unMask } from 'react-native-mask-text';

const ForgotPasswordScreen = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const router = useRouter();

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

    router.push('/(auth)/verification-code');
  };

  const handlePhoneChange = (text: string) => {
    const maskedText = masker(text, '(99) 99999-9999');
    setPhone(maskedText);
  };

  // Função para verificar se os campos estão válidos
  const areFieldsValid = () => {
    return phone !== '' && phoneError === '';
  };

  // Reiniciar a validação quando o valor do input mudar
  useEffect(() => {
    setPhoneError('');
  }, [phone]);

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Insira seu número de telefone para receber um código de verificação.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Seu telefone"
            placeholderTextColor="#A9A9A9"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={15} // (99) 99999-9999
          />
        </View>
        {phoneError ? <NativeText style={styles.errorText}>{phoneError}</NativeText> : null}
        <TouchableOpacity 
          style={[styles.buttonContainer, areFieldsValid() ? styles.buttonValid : styles.buttonInvalid]} 
          onPress={handleSendCode}
          disabled={!areFieldsValid()}
        >
          {areFieldsValid() ? (
            <LinearGradient
              colors={['#87CEFA', '#4682B4']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Enviar Código de Verificação</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonGradient, { backgroundColor: '#87CEFA' }]}>
              <Text style={[styles.buttonText, { opacity: 0.5 }]}>Enviar Código de Verificação</Text>
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
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 0,
    color: '#333',
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

export default ForgotPasswordScreen; 