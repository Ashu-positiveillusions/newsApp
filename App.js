import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import DashboardScreen from './src/screens/dashboard';
import CustomHeader from './src/components/header';
export default function App() {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ header: () => <CustomHeader /> }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}