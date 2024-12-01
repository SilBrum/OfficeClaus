//This screen is to see possible errors, or for the user to view the pairings if they choose to. It also allows you to see if the email was sent sucessfully.
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  AddParticipants: undefined;
  PairingsScreen: { pairings: { giver: string; receiver: string; email: string }[] };
};


type PairingsScreenRouteProp = RouteProp<RootStackParamList, 'PairingsScreen'>;

type PairingsScreenProps = {
  route: PairingsScreenRouteProp;
  navigation: StackNavigationProp<RootStackParamList, 'PairingsScreen'>;
};

const PairingsScreen: React.FC<PairingsScreenProps> = ({ route, navigation }) => {
  const { pairings } = route.params || { pairings: [] };
  const [showPairings, setShowPairings] = useState(false);

  const handleResendEmails = async () => {
    try {
      const response = await fetch('http://localhost:3001/send-pairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pairings }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Emails resent successfully!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to resend emails.');
      }
    } catch (error) {
      console.error('Error resending emails:', error);
      Alert.alert('Error', 'An error occurred while resending emails.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pairings Generated!</Text>
      <Text style={styles.subtitle}>
        Emails have been sent to participants. Use the options below for further actions.
      </Text>

      <Button
        title={showPairings ? 'Hide Pairings' : 'View Pairings'}
        onPress={() => setShowPairings(!showPairings)}
      />

      {showPairings && (
        <FlatList
          data={pairings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.pair}>
              {item.giver} ➡️ {item.receiver}
            </Text>
          )}
        />
      )}

      <Button title="Resend Emails" onPress={handleResendEmails} />
      <Button
        title="Add More Participants"
        onPress={() => navigation.navigate('AddParticipants')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  pair: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default PairingsScreen;
