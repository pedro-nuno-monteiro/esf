import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.indexView}>
      <Image
        source={require('@/assets/images/logo_esf.svg')}
        style={styles.reactLogo}
      />
      <Text style={styles.indexTitle}>
        Engenheiros sem Fronteiras
      </Text>
      <TouchableOpacity onPress={handleLogin}>
        <View style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.indexMessageView}>
        <Text style={styles.indexMessage}>
          Não tem conta? Faça o{' '}
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>registo</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indexView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    marginTop: 50,
    height: 300,
    width: 300,
  },
  indexTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 50,
    width: 314,
    height: 60,
    backgroundColor: "#023E8A",
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 60,
  },
  indexMessageView: {
    width: '100%',
    paddingRight: '12%',
  },
  indexMessage: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'right',
  },
  registerLink: {
    color: '#023E8A',
  },
});
