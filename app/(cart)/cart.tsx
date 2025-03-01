import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Platform,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375 || height < 667;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

// Mock de tickets de desconto válidos
const validTickets = [
  { code: 'DESCONTO10', value: 10.00 },
  { code: 'PROMO20', value: 20.00 },
  { code: 'VALE5', value: 5.00 }
];

// Métodos de pagamento padrão
const standardPaymentMethods = [
  { id: 'cash', name: 'Dinheiro', icon: 'cash-outline' },
  { id: 'pix', name: 'PIX', icon: 'qr-code-outline' },
  { id: 'debit', name: 'Cartão de Débito', icon: 'card-outline' },
  { id: 'credit', name: 'Cartão de Crédito', icon: 'card-outline' },
];

// Métodos de pagamento opcionais (definidos pelo estabelecimento)
const optionalPaymentMethods = [
  { id: 'voucher', name: 'Vale Refeição', icon: 'help-circle-outline' },
  { id: 'transfer', name: 'Transferência Bancária', icon: 'help-circle-outline' },
  { id: 'other', name: 'Outro Método', icon: 'help-circle-outline' },
];

const CartScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parsear os parâmetros recebidos
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paramsProcessed, setParamsProcessed] = useState(false);
  
  // Estados para o modal de ticket
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [appliedTicket, setAppliedTicket] = useState<{code: string, value: number} | null>(null);
  
  // Animação para o modal
  const modalAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Parsear os parâmetros da URL apenas uma vez
    if (!paramsProcessed) {
      try {
        if (params.cartItems) {
          const parsedCartItems = JSON.parse(decodeURIComponent(params.cartItems as string));
          setCartItems(parsedCartItems);
        }
        
        if (params.cartTotal && typeof params.cartTotal === 'string') {
          const total = parseFloat(params.cartTotal);
          setCartTotal(total);
          setOriginalTotal(total);
        }
        
        if (params.products) {
          const parsedProducts = JSON.parse(decodeURIComponent(params.products as string));
          setProducts(parsedProducts);
        }
        
        setParamsProcessed(true);
      } catch (error) {
        console.error('Erro ao parsear parâmetros:', error);
        setParamsProcessed(true);
      }
    }
  }, [params, paramsProcessed]);

  const handleBack = () => {
    router.back();
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const openTicketModal = () => {
    setIsTicketModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeTicketModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsTicketModalVisible(false);
      setTicketCode('');
      setTicketError('');
    });
  };

  const applyTicket = () => {
    // Verificar se o código do ticket é válido
    const ticket = validTickets.find(t => t.code === ticketCode.toUpperCase());
    
    if (!ticket) {
      setTicketError('Código de ticket inválido');
      return;
    }
    
    // Aplicar o desconto
    const newTotal = Math.max(0, originalTotal - ticket.value);
    setCartTotal(newTotal);
    setAppliedTicket(ticket);
    
    // Fechar o modal
    closeTicketModal();
  };

  const removeTicket = () => {
    setCartTotal(originalTotal);
    setAppliedTicket(null);
  };

  const handleFinishOrder = () => {
    // Aqui você pode implementar a lógica para finalizar o pedido
    // Por exemplo, enviar para uma API, processar pagamento, etc.
    
    // Após processar, redirecionar para uma tela de confirmação
    router.replace('/');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemQuantity}>{item.quantity}x</Text>
        <Text style={styles.cartItemName}>{item.name}</Text>
      </View>
      <Text style={styles.cartItemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  // Calcular a opacidade e escala do modal
  const modalOpacity = modalAnimation;
  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });
  const backdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#FFFFFF', '#F5F9FF']}
        style={styles.mainGradient}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Carrinho</Text>
          
          <View style={styles.backButtonPlaceholder} />
        </View>
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção de Itens do Carrinho */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens do Pedido</Text>
            
            {products.length > 0 ? (
              <>
                <FlatList
                  data={products}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
                
                <View style={styles.totalContainer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      R$ {cartTotal.toFixed(2)}
                      {appliedTicket && (
                        <Text style={styles.originalPrice}> (R$ {originalTotal.toFixed(2)})</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
            )}
          </View>
          
          {/* Seção de Ticket */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket</Text>
            
            {appliedTicket ? (
              <View style={styles.appliedTicketContainer}>
                <View style={styles.appliedTicketInfo}>
                  <Ionicons name="ticket-outline" size={24} color="#4A90E2" />
                  <View style={styles.appliedTicketTextContainer}>
                    <Text style={styles.appliedTicketCode}>{appliedTicket.code}</Text>
                    <Text style={styles.appliedTicketValue}>
                      Desconto: R$ {appliedTicket.value.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.removeTicketButton}
                  onPress={removeTicket}
                >
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addTicketButton}
                onPress={openTicketModal}
              >
                <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
                <Text style={styles.addTicketText}>Adicionar Ticket de Desconto</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Seção de Métodos de Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
            
            {/* Métodos Padrão */}
            <Text style={styles.paymentCategoryTitle}>Métodos Principais</Text>
            {standardPaymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  selectedPaymentMethod === method.id && styles.paymentMethodItemSelected
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <View style={styles.paymentMethodIcon}>
                  <Ionicons 
                    name={method.icon} 
                    size={24} 
                    color={selectedPaymentMethod === method.id ? "#4A90E2" : "#666666"} 
                  />
                </View>
                <Text 
                  style={[
                    styles.paymentMethodName,
                    selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
                  ]}
                >
                  {method.name}
                </Text>
                {selectedPaymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
            
            {/* Métodos Opcionais */}
            <Text style={styles.paymentCategoryTitle}>Métodos Adicionais</Text>
            {optionalPaymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  selectedPaymentMethod === method.id && styles.paymentMethodItemSelected
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <View style={styles.paymentMethodIcon}>
                  <Ionicons 
                    name={method.icon} 
                    size={24} 
                    color={selectedPaymentMethod === method.id ? "#4A90E2" : "#666666"} 
                  />
                </View>
                <Text 
                  style={[
                    styles.paymentMethodName,
                    selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
                  ]}
                >
                  {method.name}
                </Text>
                {selectedPaymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Espaço para o botão fixo */}
          <View style={{ height: 100 }} />
        </ScrollView>
        
        {/* Botão de Finalizar */}
        <TouchableOpacity 
          style={[
            styles.finishButton,
            !selectedPaymentMethod && styles.finishButtonDisabled
          ]}
          onPress={handleFinishOrder}
          disabled={!selectedPaymentMethod}
        >
          <Text style={styles.finishButtonText}>
            Finalizar Pedido • R$ {cartTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
        
        {/* Modal para inserir código do ticket */}
        {isTicketModalVisible && (
          <View style={styles.modalContainer}>
            <Animated.View 
              style={[
                styles.modalBackdrop,
                { opacity: backdropOpacity }
              ]}
              onTouchEnd={closeTicketModal}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View 
                style={[
                  styles.modalContent,
                  { 
                    opacity: modalOpacity,
                    transform: [{ scale: modalScale }]
                  }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Inserir Código do Ticket</Text>
                  <TouchableOpacity onPress={closeTicketModal}>
                    <Ionicons name="close" size={24} color="#4A4A4A" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalDescription}>
                  Insira o código do seu ticket de desconto para aplicar ao valor total da compra.
                </Text>
                
                <TextInput
                  style={styles.ticketInput}
                  placeholder="Digite o código do ticket"
                  value={ticketCode}
                  onChangeText={setTicketCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                
                {ticketError ? (
                  <Text style={styles.ticketError}>{ticketError}</Text>
                ) : (
                  <Text style={styles.ticketHint}>
                    Exemplo: DESCONTO10 (vale R$ 10,00 de desconto)
                  </Text>
                )}
                
                <TouchableOpacity 
                  style={styles.applyTicketButton}
                  onPress={applyTicket}
                  disabled={!ticketCode}
                >
                  <Text style={styles.applyTicketButtonText}>Aplicar Ticket</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: responsiveSize(20, 0.2),
    fontWeight: '600',
    color: '#4A90E2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginVertical: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartItemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 10,
    minWidth: 30,
  },
  cartItemName: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  // Estilos para a seção de ticket
  addTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
  },
  addTicketText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90E2',
    marginLeft: 10,
  },
  appliedTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
  },
  appliedTicketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedTicketTextContainer: {
    marginLeft: 15,
  },
  appliedTicketCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  appliedTicketValue: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  removeTicketButton: {
    padding: 5,
  },
  // Estilos para métodos de pagamento
  paymentCategoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginTop: 15,
    marginBottom: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
  },
  paymentMethodItemSelected: {
    backgroundColor: '#4A90E2',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
    flex: 1,
  },
  paymentMethodNameSelected: {
    color: '#FFFFFF',
  },
  finishButton: {
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
  finishButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Estilos para o modal de ticket
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  ticketInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  ticketError: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 15,
  },
  ticketHint: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 20,
  },
  applyTicketButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyTicketButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;