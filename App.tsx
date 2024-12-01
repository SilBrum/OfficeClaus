import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import AddParticipants from './components/AddParticipants';
import PairingsScreen from './components/PairingsScreen';

type RootStackParamList = {
  Home: undefined;
  AddParticipants: undefined;
  PairingsScreen: { pairings: { giver: string; receiver: string; email: string }[] };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddParticipants" component={AddParticipants} />
        <Stack.Screen name="PairingsScreen" component={PairingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
