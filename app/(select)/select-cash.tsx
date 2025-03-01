import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SelectCashScreen = () => {
  const [cashAmount, setCashAmount] = useState(0);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Simulação de carregamento do valor no caixa
  useEffect(() => {
    // Aqui você pode adicionar a lógica para carregar o valor do caixa do banco de dados ou de onde for necessário
    setCashAmount(1000); // Valor simulado
  }, []);

  const cashRegisters = [
    { id: 1, name: 'Caixa 1', amount: 1000.00 },
    { id: 2, name: 'Caixa 2', amount: 1500.00 },
    { id: 3, name: 'Caixa 3', amount: 2000.00 },
    { id: 4, name: 'Caixa 4', amount: 800.00 },
    { id: 5, name: 'Caixa 5', amount: 1200.00 },
    { id: 6, name: 'Caixa 6', amount: 1800.00 },
    { id: 7, name: 'Caixa 7', amount: 900.00 },
    { id: 8, name: 'Caixa 8', amount: 1100.00 },
    { id: 9, name: 'Caixa 9', amount: 1600.00 },
    { id: 10, name: 'Caixa 10', amount: 1300.00 },
    { id: 11, name: 'Caixa 11', amount: 700.00 },
    { id: 12, name: 'Caixa 12', amount: 1400.00 },
  ];

  const handleOpenCash = (cashRegisterId: number) => {
    // Lógica para abrir o caixa
    console.log(`Abrindo caixa: ${cashRegisterId}`);
    router.push('/select-module');
  };

  const renderCashRegisters = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleCashRegisters = cashRegisters.slice(startIndex, endIndex);

    return visibleCashRegisters.map((cashRegister) => (
      <TouchableOpacity
        key={cashRegister.id}
        style={styles.cashCard}
        onPress={() => handleOpenCash(cashRegister.id)}
      >
        <View style={styles.cashCardContent}>
          <Text style={styles.cashName}>{cashRegister.name}</Text>
          <Text style={styles.cashAmount}>R$ {cashRegister.amount.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const totalPages = Math.ceil(cashRegisters.length / itemsPerPage);
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Igreja Viva</Text>
        <Text style={styles.subtitle}>Selecione o Caixa</Text>
        <View style={styles.carouselContainer}>
          {renderCashRegisters()}
        </View>
        <View style={styles.pagination}>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => handlePageChange('prev')}
            disabled={currentPage === 0}
          >
            <Ionicons name="chevron-back" size={24} color={currentPage === 0 ? '#ccc' : '#0a7ea4'} />
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>
            {currentPage + 1} / {Math.ceil(cashRegisters.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => handlePageChange('next')}
            disabled={currentPage === Math.ceil(cashRegisters.length / itemsPerPage) - 1}
          >
            <Ionicons name="chevron-forward" size={24} color={currentPage === Math.ceil(cashRegisters.length / itemsPerPage) - 1 ? '#ccc' : '#0a7ea4'} />
          </TouchableOpacity>
        </View>
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
  carouselContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  cashCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cashCardContent: {
    alignItems: 'flex-start',
  },
  cashName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 5,
  },
  cashAmount: {
    fontSize: 16,
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
  },
  pageIndicator: {
    fontSize: 16,
    color: '#555',
  },
});

export default SelectCashScreen; 