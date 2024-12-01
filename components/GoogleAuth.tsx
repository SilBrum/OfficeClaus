import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { authorize } from 'react-native-app-auth';

const config = {
    issuer: 'https://accounts.google.com',
    clientId: process.env.CLIENT_ID as string,
    redirectUrl: process.env.REDIRECT_URI as string,
    scopes: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.send'],
  };
  

const GoogleAuth: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      const result = await authorize(config);
      setAccessToken(result.accessToken); // Store the token for later
      Alert.alert('Success!', 'Signed in with Google.');
      console.log('Access Token:', result.accessToken);
    } catch (error) {
      console.error('Failed to log in with Google:', error);
      Alert.alert('Error', 'Failed to sign in with Google.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
      {accessToken && <Text style={styles.token}>Token: {accessToken}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  token: {
    marginTop: 20,
    fontSize: 12,
    color: 'blue',
  },
});

export default GoogleAuth;
