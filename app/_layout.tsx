import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/reset-password" />
      <Stack.Screen name="(auth)/verification-code" />
      <Stack.Screen name="(select)/select-cash" />
      <Stack.Screen name="(select)/select-module" />
      <Stack.Screen name="(select)/select-products" />
      <Stack.Screen name="(select)/select-payment" />
      <Stack.Screen name="(modules)/[id]" />
      <Stack.Screen name="(cart)/cart" />
    </Stack>
  );
}
