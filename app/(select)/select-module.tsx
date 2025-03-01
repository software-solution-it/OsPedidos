import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const SelectModuleScreen = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const modules = [
    { id: 1, name: 'Financeiro' },
    { id: 2, name: 'Membros' },
    { id: 3, name: 'Eventos' },
    { id: 4, name: 'Relatórios' },
    { id: 5, name: 'Configurações' },
    { id: 6, name: 'Doações' },
    { id: 7, name: 'Voluntários' },
    { id: 8, name: 'Comunicação' },
    { id: 9, name: 'Educação' },
    { id: 10, name: 'Missões' },
    { id: 11, name: 'Cultos' },
    { id: 12, name: 'Ministérios' },
    { id: 13, name: 'Recursos' },
    { id: 14, name: 'Pastoral' },
  ];

  const handleSelectModule = (moduleId: number) => {
    // Lógica para selecionar o módulo
    console.log(`Módulo selecionado: ${moduleId}`);
    // Navigate to product selection screen
    router.push('/(select)/select-products');
  };

  const renderModules = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleModules = modules.slice(startIndex, endIndex);

    return visibleModules.map((module) => (
      <TouchableOpacity
        key={module.id}
        style={styles.moduleButton}
        onPress={() => handleSelectModule(module.id)}
      >
        <Text style={styles.moduleButtonText}>{module.name}</Text>
      </TouchableOpacity>
    ));
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const totalPages = Math.ceil(modules.length / itemsPerPage);
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
        <Text style={styles.subtitle}>Selecione o Módulo</Text>
        <View style={styles.carouselContainer}>
          {renderModules()}
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
            {currentPage + 1} / {Math.ceil(modules.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => handlePageChange('next')}
            disabled={currentPage === Math.ceil(modules.length / itemsPerPage) - 1}
          >
            <Ionicons name="chevron-forward" size={24} color={currentPage === Math.ceil(modules.length / itemsPerPage) - 1 ? '#ccc' : '#0a7ea4'} />
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
  moduleButton: {
    width: '48%',
    backgroundColor: '#87CEFA',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  moduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default SelectModuleScreen; 