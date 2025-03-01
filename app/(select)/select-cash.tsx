import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Animated, 
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SideMenu from '../components/SideMenu';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

// Dados dos módulos
const modules = [
  {
    id: 1,
    title: 'Módulo 1',
    icon: 'cube',
    color: '#4A90E2',
    route: '/(modules)/1'
  },
  {
    id: 2,
    title: 'Módulo 2',
    icon: 'cube',
    color: '#5C9CE6',
    route: '/(modules)/2'
  },
];

// Update the module type definition
type Module = {
  id: number;
  title: string;
  icon: string;
  color: string;
  route: string;
};

const SelectCashScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // Animação de entrada
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    
    Animated.timing(menuAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsMenuOpen(!isMenuOpen);
  };

  // Update the handleModuleSelect function
  const handleModuleSelect = (route: string) => {
    // Fechar o menu se estiver aberto
    if (isMenuOpen) {
      toggleMenu();
      
      // Aguardar a animação do menu fechar antes de navegar
      setTimeout(() => {
        router.push(route as any);
      }, 300);
    } else {
      // Adicionar console.log para debug
      console.log('Navegando para:', route);
      router.push(route as any);
    }
  };

  // Calcular a escala e translação do conteúdo principal
  const mainScale = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });
  
  const mainTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.5],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Menu Lateral Componentizado */}
      <SideMenu 
        isOpen={isMenuOpen}
        menuAnimation={menuAnimation}
        onClose={toggleMenu}
      />
      
      {/* Conteúdo Principal */}
      <Animated.View 
        style={[
          styles.mainContent,
          { 
            opacity: fadeAnimation,
            borderRadius: isMenuOpen ? 20 : 0,
            transform: [
              { scale: mainScale },
              { translateX: mainTranslateX }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F5F9FF']}
          style={styles.mainGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={toggleMenu}
            >
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Selecione um Módulo</Text>
            
            <View style={styles.menuButtonPlaceholder} />
          </View>
          
          <ScrollView 
            style={styles.modulesContainer}
            contentContainerStyle={styles.modulesContent}
            showsVerticalScrollIndicator={false}
          >
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleCard}
                onPress={() => handleModuleSelect(module.route)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[module.color, lightenColor(module.color, 20)]}
                  style={styles.moduleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.moduleIconContainer}>
                    <Ionicons name={module.icon} size={responsiveSize(40, 0.3)} color="#FFFFFF" />
                  </View>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// Função para clarear uma cor (para o gradiente)
const lightenColor = (color: string, percent: number): string => {
  // Esta é uma implementação simplificada
  // Para uma implementação real, você pode usar uma biblioteca como 'color'
  return color; // Retorna a mesma cor por enquanto
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A4B8B',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  mainGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonPlaceholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: responsiveSize(20, 0.2),
    fontWeight: '600',
    color: '#4A90E2',
  },
  modulesContainer: {
    flex: 1,
  },
  modulesContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: height * 0.05,
    alignItems: 'center',
  },
  moduleCard: {
    width: width * 0.85,
    height: width * 0.4,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  moduleGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  moduleIconContainer: {
    width: responsiveSize(80, 0.3),
    height: responsiveSize(80, 0.3),
    borderRadius: responsiveSize(40, 0.3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  moduleTitle: {
    fontSize: responsiveSize(22, 0.2),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SelectCashScreen; 