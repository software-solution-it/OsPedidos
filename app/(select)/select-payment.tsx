import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SelectPaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const router = useRouter();

  const paymentMethods = [
    { id: 1, name: 'Cartão de Crédito' },
    { id: 2, name: 'Cartão de Débito' },
    { id: 3, name: 'Dinheiro' },
    { id: 4, name: 'Pix' },
    // Add more payment methods as needed
  ];

  const handleSelectPaymentMethod = (paymentMethodId: number) => {
    setSelectedPaymentMethod(paymentMethodId);
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentMethod) {
      // Implement payment processing logic here
      console.log(`Método de pagamento selecionado: ${selectedPaymentMethod}`);
      // After processing, you might want to navigate to a confirmation screen
      // router.push('/(select)/payment-confirmation');
    } else {
      alert('Por favor, selecione um método de pagamento.');
    }
  };

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Igreja Viva</Text>
        <Text style={styles.subtitle}>Selecione o Método de Pagamento</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {paymentMethods.map((paymentMethod) => (
            <TouchableOpacity
              key={paymentMethod.id}
              style={[
                styles.paymentButton,
                selectedPaymentMethod === paymentMethod.id && styles.selectedPaymentButton,
              ]}
              onPress={() => handleSelectPaymentMethod(paymentMethod.id)}
            >
              <Text style={styles.paymentButtonText}>{paymentMethod.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  scrollContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  paymentButton: {
    width: '100%',
    backgroundColor: '#87CEFA',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  selectedPaymentButton: {
    backgroundColor: '#0a7ea4',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectPaymentScreen; 