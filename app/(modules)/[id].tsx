import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  ScrollView,
  StatusBar,
  Platform,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SideMenu from '../components/SideMenu';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

// Dados de exemplo para categorias e produtos
const categoriesData = [
  { id: 1, name: 'Bebidas' },
  { id: 2, name: 'Lanches' },
  { id: 3, name: 'Doces' },
  { id: 4, name: 'Salgados' },
  { id: 5, name: 'Combos' },
];

const productsData = {
  1: [
    { id: 1, name: 'Água Mineral 500ml', price: 3.50 },
    { id: 2, name: 'Refrigerante Lata', price: 5.00 },
    { id: 3, name: 'Suco Natural', price: 7.50 },
    { id: 4, name: 'Água com Gás', price: 4.00 },
  ],
  2: [
    { id: 5, name: 'X-Burger', price: 15.90 },
    { id: 6, name: 'Misto Quente', price: 8.50 },
    { id: 7, name: 'Cachorro Quente', price: 10.00 },
  ],
  3: [
    { id: 8, name: 'Pudim', price: 6.50 },
    { id: 9, name: 'Brigadeiro', price: 3.00 },
  ],
  4: [
    { id: 10, name: 'Coxinha', price: 5.50 },
    { id: 11, name: 'Empada', price: 6.00 },
    { id: 12, name: 'Pastel', price: 7.00 },
  ],
  5: [
    { id: 13, name: 'Combo Lanche + Bebida', price: 18.90 },
    { id: 14, name: 'Combo Família', price: 45.00 },
  ],
};

// Dados dos módulos
const moduleData = {
  '1': {
    title: 'Módulo 1',
    color: '#4A90E2',
    submodules: [
      {
        id: 1,
        title: 'Vendas',
        icon: 'cart',
        color: '#4A90E2',
      },
      {
        id: 2,
        title: 'Relatórios',
        icon: 'bar-chart',
        color: '#5C9CE6',
      },
      {
        id: 3,
        title: 'Clientes',
        icon: 'people',
        color: '#6EA8EA',
      },
      {
        id: 4,
        title: 'Produtos',
        icon: 'cube',
        color: '#80B4EE',
      }
    ]
  },
  '2': {
    title: 'Módulo 2',
    color: '#5C9CE6',
    submodules: [
      {
        id: 1,
        title: 'Configurações',
        icon: 'settings',
        color: '#5C9CE6',
      },
      {
        id: 2,
        title: 'Usuários',
        icon: 'people',
        color: '#6EA8EA',
      },
      {
        id: 3,
        title: 'Suporte',
        icon: 'help-circle',
        color: '#80B4EE',
      }
    ]
  }
};

const ModuleScreen = () => {
  const { id } = useLocalSearchParams();
  const moduleId = typeof id === 'string' ? id : '1';
  const module = moduleData[moduleId as keyof typeof moduleData] || moduleData['1'];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSubmodule, setSelectedSubmodule] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [cartTotal, setCartTotal] = useState(0);
  
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const submoduleAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  
  const categoryListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Animação de entrada
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Calcular o total do carrinho
    let total = 0;
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const productIdNum = parseInt(productId);
      const category = Object.entries(productsData).find(([_, products]) => 
        products.some(product => product.id === productIdNum)
      );
      
      if (category) {
        const product = category[1].find(p => p.id === productIdNum);
        if (product) {
          total += product.price * quantity;
        }
      }
    });
    
    setCartTotal(total);
  }, [cartItems]);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    
    Animated.timing(menuAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmoduleSelect = (id: number) => {
    setSelectedSubmodule(id);
    
    // Animar a transição para o submódulo
    Animated.timing(submoduleAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleBackToSubmodules = () => {
    // Animar a transição de volta para a lista de submódulos
    Animated.timing(submoduleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedSubmodule(null);
      setCartItems({});
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    
    // Scroll para a categoria selecionada
    categoryListRef.current?.scrollToIndex({
      index: categoryId - 1,
      animated: true,
      viewPosition: 0.5
    });
  };

  const handleAddToCart = (productId: number) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[productId] > 1) {
        newItems[productId] -= 1;
      } else {
        delete newItems[productId];
      }
      return newItems;
    });
  };

  const handleViewCart = () => {
    // Preparar os dados dos produtos para enviar para a tela de carrinho
    const cartProductsData = Object.entries(cartItems).map(([productId, quantity]) => {
      const productIdNum = parseInt(productId);
      const category = Object.entries(productsData).find(([_, products]) => 
        products.some(product => product.id === productIdNum)
      );
      
      if (category) {
        const product = category[1].find(p => p.id === productIdNum);
        if (product) {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity
          };
        }
      }
      return null;
    }).filter(Boolean);
    
    // Navegar para a tela de carrinho com os parâmetros
    router.push({
      pathname: '/(cart)/cart',
      params: {
        cartItems: encodeURIComponent(JSON.stringify(cartItems)),
        cartTotal: cartTotal.toString(),
        products: encodeURIComponent(JSON.stringify(cartProductsData))
      }
    });
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

  // Animações para a transição de submódulos
  const submoduleListOpacity = submoduleAnimation.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const submoduleListTranslateY = submoduleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const submoduleDetailOpacity = submoduleAnimation.interpolate({
    inputRange: [0.3, 0.7],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const submoduleDetailTranslateY = submoduleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  const selectedSubmoduleData = selectedSubmodule 
    ? module.submodules.find(item => item.id === selectedSubmodule) 
    : null;

  // Renderizar um item de categoria
  const renderCategoryItem = ({ item }: { item: typeof categoriesData[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && { 
          backgroundColor: selectedSubmoduleData?.color || '#4A90E2',
          borderColor: selectedSubmoduleData?.color || '#4A90E2'
        }
      ]}
      onPress={() => handleCategorySelect(item.id)}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.categoryName,
          selectedCategory === item.id && { color: '#FFFFFF' }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Renderizar um item de produto
  const renderProductItem = ({ item }: { item: typeof productsData[1][0] }) => {
    const quantity = cartItems[item.id] || 0;
    
    return (
      <View style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleRemoveFromCart(item.id)}
            disabled={quantity === 0}
          >
            <Ionicons 
              name="remove" 
              size={24} 
              color={quantity === 0 ? '#CCCCCC' : '#4A4A4A'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleAddToCart(item.id)}
          >
            <Ionicons name="add" size={24} color="#4A4A4A" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Calcular o total de itens no carrinho
  const totalItems = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

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
            
            <Text style={styles.headerTitle}>
              {selectedSubmodule ? selectedSubmoduleData?.title : module.title}
            </Text>
            
            {selectedSubmodule ? (
              <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: `${module.color}20` }]}
                onPress={handleBackToSubmodules}
              >
                <Ionicons name="arrow-back" size={24} color={module.color} />
              </TouchableOpacity>
            ) : (
              <View style={styles.menuButtonPlaceholder} />
            )}
          </View>
          
          {/* Lista de Submódulos */}
          <Animated.View 
            style={[
              styles.submodulesContainer,
              { 
                opacity: submoduleListOpacity,
                transform: [{ translateY: submoduleListTranslateY }],
                display: selectedSubmodule ? 'none' : 'flex'
              }
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.submodulesContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionTitle}>Selecione uma opção</Text>
              
              <View style={styles.submodulesGrid}>
                {module.submodules.map((submodule) => (
                  <TouchableOpacity
                    key={submodule.id}
                    style={styles.submoduleCard}
                    onPress={() => handleSubmoduleSelect(submodule.id)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[submodule.color, lightenColor(submodule.color, 20)]}
                      style={styles.submoduleGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.submoduleIconContainer}>
                        <Ionicons name={submodule.icon} size={responsiveSize(30, 0.3)} color="#FFFFFF" />
                      </View>
                      <Text style={styles.submoduleTitle}>{submodule.title}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
          
          {/* Detalhe do Submódulo - Interface estilo iFood */}
          {selectedSubmodule && (
            <Animated.View 
              style={[
                styles.submoduleDetailContainer,
                { 
                  opacity: submoduleDetailOpacity,
                  transform: [{ translateY: submoduleDetailTranslateY }],
                  display: selectedSubmodule ? 'flex' : 'none'
                }
              ]}
            >
              {/* Categorias (Barracas) */}
              <View style={styles.categoriesContainer}>
                <FlatList
                  ref={categoryListRef}
                  data={categoriesData}
                  renderItem={renderCategoryItem}
                  keyExtractor={item => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>
              
              {/* Lista de Produtos */}
              <FlatList
                data={productsData[selectedCategory]}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
              
              {/* Botão de Carrinho */}
              {totalItems > 0 && (
                <TouchableOpacity 
                  style={[styles.cartButton, { backgroundColor: selectedSubmoduleData?.color }]}
                  onPress={handleViewCart}
                >
                  <View style={styles.cartCenteredContent}>
                    <Ionicons name="cart" size={24} color="#FFFFFF" style={styles.cartIcon} />
                    <Text style={styles.cartTotal}>Ver Carrinho • R$ {cartTotal.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// Função para clarear uma cor (para o gradiente)
const lightenColor = (color: string, percent: number): string => {
  // Implementação simplificada para clarear uma cor
  const lighterColor = color === '#4A90E2' ? '#6BABF3' : 
                       color === '#5C9CE6' ? '#7DB5F5' : 
                       color === '#6EA8EA' ? '#8EBEF7' : 
                       color === '#80B4EE' ? '#A0C8F9' : '#B1D4FA';
  return lighterColor;
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonPlaceholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: responsiveSize(20, 0.2),
    fontWeight: '600',
    color: '#4A90E2',
  },
  sectionTitle: {
    fontSize: responsiveSize(18, 0.2),
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 20,
    marginLeft: 5,
  },
  submodulesContainer: {
    flex: 1,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 0,
    right: 0,
    bottom: 0,
  },
  submodulesContent: {
    padding: 20,
  },
  submodulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  submoduleCard: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  submoduleGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  submoduleIconContainer: {
    width: responsiveSize(60, 0.3),
    height: responsiveSize(60, 0.3),
    borderRadius: responsiveSize(30, 0.3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  submoduleTitle: {
    fontSize: responsiveSize(16, 0.2),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  submoduleDetailContainer: {
    flex: 1,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Estilos para a interface estilo iFood - Otimizados para máquina de cartão
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    zIndex: 1,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  productsList: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 100, // Espaço para o botão de carrinho
  },
  productItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 17,
    color: '#4A90E2',
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginHorizontal: 10,
    minWidth: 25,
    textAlign: 'center',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cartCenteredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    marginRight: 10,
  },
  cartTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ModuleScreen; 