import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './index'; // Ajuste o caminho conforme necessário
import ForgotPasswordScreen from './(auth)/forgot-password';
import ResetPasswordScreen from './(auth)/reset-password';
import VerificationCodeScreen from './(auth)/verification-code';
import SelectCashScreen from './(select)/select-cash';
import SelectModuleScreen from './(select)/select-module';
import SelectProductsScreen from './(select)/select-products';
import SelectPaymentScreen from './(select)/select-payment';

const Stack = createStackNavigator();

function Layout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)/login" component={LoginScreen} />
      <Stack.Screen name="(auth)/forgot-password" component={ForgotPasswordScreen} />
      <Stack.Screen name="(auth)/reset-password" component={ResetPasswordScreen} />
      <Stack.Screen name="(auth)/verification-code" component={VerificationCodeScreen} />
      <Stack.Screen name="(select)/select-cash" component={SelectCashScreen} />
      <Stack.Screen name="(select)/select-module" component={SelectModuleScreen} />
      <Stack.Screen name="(select)/select-products" component={SelectProductsScreen} />
      <Stack.Screen name="(select)/select-payment" component={SelectPaymentScreen} />
    </Stack.Navigator>
  );
}

export default Layout;
