import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorize } from 'react-native-app-auth';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  AddParticipants: undefined;
  PairingsScreen: { pairings: { giver: string; receiver: string; email: string }[] };
};

type AddParticipantsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddParticipants'
>;

type Props = {
  navigation: AddParticipantsScreenNavigationProp;
};

type Participant = {
  name: string;
  email: string;
};

const AddParticipants: React.FC<Props> = ({ navigation }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const config = {
    issuer: 'https://accounts.google.com',
    clientId: process.env.CLIENT_ID as string,
    redirectUrl: process.env.REDIRECT_URI as string,
    scopes: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.send'],
  };

  const signInWithGoogle = async () => {
    try {
      const result = await authorize(config);
      setAccessToken(result.accessToken);
      await AsyncStorage.setItem('accessToken', result.accessToken || '');
      Alert.alert('Success', 'Signed in with Google.');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google.');
    }
  };

  const addParticipant = () => {
    if (name.trim() && email.trim()) {
      setParticipants([...participants, { name: name.trim(), email: email.trim() }]);
      setName('');
      setEmail('');
    } else {
      Alert.alert('Error', 'Both name and email are required.');
    }
  };

  const generatePairings = (participants: Participant[]) => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    return participants.map((participant, index) => ({
      giver: participant.name,
      receiver: shuffled[index].name,
      email: participant.email,
    }));
  };

  const sendEmailsToBackend = async (pairings: { giver: string; receiver: string; email: string }[]) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Error', 'Please sign in with Google first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/send-pairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pairings }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Emails sent successfully!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to send emails.');
      }
    } catch (error) {
      console.error('Failed to send emails:', error);
      Alert.alert('Error', 'An error occurred while sending emails.');
    }
  };

  const handleGeneratePairings = async () => {
    if (participants.length >= 2) {
      const pairings = generatePairings(participants);
      await sendEmailsToBackend(pairings);
      navigation.navigate('PairingsScreen', { pairings });
    } else {
      Alert.alert('Error', 'You need at least two participants to generate pairings.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Participants</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Add" onPress={addParticipant} />
      <FlatList
        data={participants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.participant}>
            {item.name} ({item.email})
          </Text>
        )}
      />
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
      <Button title="Generate Pairings" onPress={handleGeneratePairings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  participant: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default AddParticipants;
