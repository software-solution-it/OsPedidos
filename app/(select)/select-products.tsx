import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';  

const SelectProductsScreen = () => {
  const [selectedProducts, setSelectedProducts] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['Todos', 'Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5', 'Categoria 6', 'Categoria 7', 'Categoria 8', 'Categoria 9', 'Categoria 10'];

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCustomCarousel = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselItemsContainer}
      >
        {categories.map((item, index) => (
          <View key={index} style={styles.carouselItem}>
            {renderCategoryItem({ item })}
          </View>
        ))}
      </ScrollView>
    );
  };

  const products = [
    { id: 1, name: 'Produto 1', price: 10.00, description: 'Descrição do Produto 1', category: 'Categoria 1' },
    { id: 2, name: 'Produto 2', price: 15.00, description: 'Descrição do Produto 2', category: 'Categoria 2' },
    { id: 3, name: 'Produto 3', price: 20.00, description: 'Descrição do Produto 3', category: 'Categoria 3' },
    { id: 4, name: 'Produto 4', price: 25.00, description: 'Descrição do Produto 4', category: 'Categoria 4' },
    { id: 5, name: 'Produto 5', price: 30.00, description: 'Descrição do Produto 5', category: 'Categoria 5' },
    { id: 6, name: 'Produto 6', price: 35.00, description: 'Descrição do Produto 6', category: 'Categoria 6' },
    { id: 7, name: 'Produto 7', price: 40.00, description: 'Descrição do Produto 7', category: 'Categoria 7' },
    { id: 8, name: 'Produto 8', price: 45.00, description: 'Descrição do Produto 8', category: 'Categoria 8' },
    { id: 9, name: 'Produto 9', price: 50.00, description: 'Descrição do Produto 9', category: 'Categoria 9' },
    { id: 10, name: 'Produto 10', price: 55.00, description: 'Descrição do Produto 10', category: 'Categoria 10' },
    { id: 11, name: 'Produto 11', price: 60.00, description: 'Descrição do Produto 11', category: 'Categoria 1' },
    { id: 12, name: 'Produto 12', price: 65.00, description: 'Descrição do Produto 12', category: 'Categoria 2' },
    { id: 13, name: 'Produto 13', price: 70.00, description: 'Descrição do Produto 13', category: 'Categoria 3' },
    { id: 14, name: 'Produto 14', price: 75.00, description: 'Descrição do Produto 14', category: 'Categoria 4' },
    { id: 15, name: 'Produto 15', price: 80.00, description: 'Descrição do Produto 15', category: 'Categoria 5' },
    { id: 16, name: 'Produto 16', price: 85.00, description: 'Descrição do Produto 16', category: 'Categoria 6' },
    { id: 17, name: 'Produto 17', price: 90.00, description: 'Descrição do Produto 17', category: 'Categoria 7' },
    { id: 18, name: 'Produto 18', price: 95.00, description: 'Descrição do Produto 18', category: 'Categoria 8' },
    { id: 19, name: 'Produto 19', price: 100.00, description: 'Descrição do Produto 19', category: 'Categoria 9' },
    { id: 20, name: 'Produto 20', price: 105.00, description: 'Descrição do Produto 20', category: 'Categoria 10' },
  ];

  const handleSelectProduct = (productId: number) => {
    const selectedProduct = products.find((product) => product.id === productId);
    if (selectedProduct) {
      const existingProduct = selectedProducts.find((item) => item.id === productId);
      if (existingProduct) {
        // If product already selected, increase quantity
        const updatedProducts = selectedProducts.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setSelectedProducts(updatedProducts);
        updatePrices(updatedProducts);
      } else {
        // If new product, add to selected products
        setSelectedProducts([...selectedProducts, { ...selectedProduct, quantity: 1 }]);
        updatePrices([...selectedProducts, { ...selectedProduct, quantity: 1 }]);
      }
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const updatedProducts = selectedProducts.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
    );
    setSelectedProducts(updatedProducts);
    updatePrices(updatedProducts);
  };

  const updatePrices = (products: any[]) => {
    const newTotalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0);
    setTotalPrice(newTotalPrice);
    const newFinalPrice = newTotalPrice - discount;
    setFinalPrice(newFinalPrice);
  };

  const handleDiscountChange = (discountValue: string) => {
    const newDiscount = parseFloat(discountValue) || 0;
    setDiscount(newDiscount);
    const newFinalPrice = totalPrice - newDiscount;
    setFinalPrice(Math.max(0, newFinalPrice));
  };

  const handleProceedToPayment = () => {
    // Navigate to payment selection screen
    router.push('/(select)/select-payment');
  };

  const handleCancel = () => {
    // Logic to cancel the current selection
    setSelectedProducts([]);
    setTotalPrice(0);
    setDiscount(0);
    setFinalPrice(0);
  };

  const handleChangeTicket = () => {
    // Logic to change the ticket (e.g., start a new selection)
    setSelectedProducts([]);
    setTotalPrice(0);
    setDiscount(0);
    setFinalPrice(0);
  };

  const renderProductItem = (product: any) => {
    const selectedProduct = selectedProducts.find((item) => item.id === product.id);
    const quantity = selectedProduct ? selectedProduct.quantity : 0;

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(product.id, quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(product.id, quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#AEEEEE', '#B0E0E6', '#ADD8E6']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.categoryHeader}>
          {renderCustomCarousel()}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.cardBody, { marginTop: -10, backgroundColor: '#fff' }]}>
            {products
              .filter((product) =>
                selectedCategory === 'Todos' || product.category === selectedCategory
              )
              .map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productItem}
                  onPress={() => handleSelectProduct(product.id)}
                >
                  {renderProductItem(product)}
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
        <View style={styles.cartContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.cartButtonText}>Ver Carrinho</Text>
            <Text style={styles.cartTotal}>R$ {finalPrice.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff',
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
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 3,
    width: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#0a7ea4',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a7ea4',
    padding: 15,
    alignItems: 'center',
  },
  cartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartTotal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  customCarouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  carouselButton: {
    padding: 10,
  },
  carouselItemsContainer: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    marginRight: 10,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    width: 120,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryItem: {
    backgroundColor: '#fff',
    borderColor: '#0a7ea4',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryHeader: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  cardBody: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productItem: {
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default SelectProductsScreen; 