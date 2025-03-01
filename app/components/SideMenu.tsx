import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isLargeScreen = width >= 768;

const responsiveSize = (size: number, factor = 0.5): number => {
  if (isSmallScreen) return size * (1 - factor);
  if (isLargeScreen) return size * (1 + factor * 0.5);
  return size;
};

interface SideMenuProps {
  isOpen: boolean;
  menuAnimation: Animated.Value;
  onClose: () => void;
}

const SideMenu = ({ isOpen, menuAnimation, onClose }: SideMenuProps) => {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  // Calcular a translação do menu
  const translateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.6, 0],
  });

  // Calcular a opacidade do overlay
  const overlayOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <>
      {/* Menu Lateral */}
      <Animated.View 
        style={[
          styles.sideMenu,
          { transform: [{ translateX }] }
        ]}
      >
        <LinearGradient
          colors={['#1A4B8B', '#2A70C2']}
          style={styles.menuGradient}
        >
          <View style={styles.menuHeader}>
            <Image
              source={require('../../assets/images/logo-white.png')}
              style={styles.menuLogo}
            />
          </View>
          
          <View style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Overlay para fechar o menu ao tocar fora */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.overlay,
            { opacity: overlayOpacity }
          ]}
          onTouchEnd={onClose}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    width: width * 0.6,
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  menuGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  menuHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuLogo: {
    width: responsiveSize(100, 0.3),
    height: responsiveSize(40, 0.3),
    resizeMode: 'contain',
  },
  menuItems: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 5,
  },
});

export default SideMenu; 