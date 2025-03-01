import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Text as NativeText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();

  const handleResetPassword = () => {
    setNewPasswordError('');
    setConfirmPasswordError('');

    if (newPassword.length < 4) {
      setNewPasswordError('A senha deve ter pelo menos 4 dígitos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
      return;
    }

    // Aqui você pode adicionar a lógica para redefinir a senha
    router.push('/');
  };

  // Função para verificar se os campos estão válidos
  const areFieldsValid = () => {
    return newPassword !== '' && confirmPassword !== '' && newPasswordError === '' && confirmPasswordError === '';
  };

  // Reiniciar a validação quando o valor dos inputs mudar
  useEffect(() => {
    setNewPasswordError('');
    setConfirmPasswordError('');
  }, [newPassword, confirmPassword]);

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>
          Insira sua nova senha e confirme-a para completar a redefinição.
        </Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              placeholderTextColor="#A9A9A9"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
        </View>
        {newPasswordError ? <NativeText style={styles.errorText}>{newPasswordError}</NativeText> : null}
        <View style={styles.inputContainer}>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              placeholderTextColor="#A9A9A9"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
        </View>
        {confirmPasswordError ? <NativeText style={styles.errorText}>{confirmPasswordError}</NativeText> : null}
        <TouchableOpacity 
          style={[styles.buttonContainer, areFieldsValid() ? styles.buttonValid : styles.buttonInvalid]} 
          onPress={handleResetPassword}
          disabled={!areFieldsValid()}
        >
          {areFieldsValid() ? (
            <LinearGradient
              colors={['#87CEFA', '#4682B4']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Redefinir Senha</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonGradient, { backgroundColor: '#87CEFA' }]}>
              <Text style={[styles.buttonText, { opacity: 0.5 }]}>Redefinir Senha</Text>
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 55,
    color: '#333',
    fontSize: 16,
    paddingBottom: 5,
  },
  eyeIcon: {
    padding: 10,
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
    alignSelf: 'flex-start',
  },
});

export default ResetPasswordScreen;