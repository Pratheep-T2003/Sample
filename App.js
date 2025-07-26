// App.js
import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'user@example.com' && password === '123456') {
      Alert.alert('Login Successful');
    } else {
      Alert.alert('Invalid email or password');
    }
  };

  return (
    <PaperProvider>
      <ImageBackground
        source={{ uri: 'https://i.imgur.com/Vu7gsoN.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Title style={styles.title}>Login</Title>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Text style={styles.note}>Email: user@example.com | Password: 123456</Text>
        </View>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 28,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  note: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
  },
});
