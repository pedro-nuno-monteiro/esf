import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { useRouter } from 'expo-router';

import MyInput from '@/components/MyInput';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAndSignOut = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        try {
          await FIREBASE_AUTH.signOut();
          console.log('Previous user signed out');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    };

    setEmail('');
    setPassword('');
    setShowPassword(false);
    checkAndSignOut();
  }, []);

  const auth = FIREBASE_AUTH;
  
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {

      const response = await signInWithEmailAndPassword(auth, email, password);

      // tipo de user
      const userTypeDoc = await getDoc(doc(FIREBASE_DB, 'userTypes', response.user.uid));
      
      if (userTypeDoc.exists()) {
        const userType = userTypeDoc.data().type;

        // apenas caso seja engenheiro
        if (userType === 'engineer') {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', response.user.uid));
          
          if (userDoc.exists()) {
            const status = userDoc.data().status;
            
            if (status === 'pending') {
              await auth.signOut();
              alert('A sua conta ainda não foi aprovada.');
              return;
            }
          }
        }
        
        alert('Entrada verificada');
        router.replace('/home');
      }
    } catch (error) {
      console.error(error);
      alert('Erro no login!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo_esf.svg')}
        style={styles.reactLogo}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <MyInput
          value={email}
          onChangeText={setEmail}
          placeholder='Email'
        />
        <MyInput
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image 
                source={showPassword ? 
                  require('@/assets/images/eye-slash.svg') : 
                  require('@/assets/images/eye.svg')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          }
        />

        { loading ? <ActivityIndicator size='large' color='blue'/> 
        : 
        <>
          <TouchableOpacity onPress={signIn}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 100,
    textAlign: 'center',
  },
  content: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#023E8A',
  },
});

export default LoginScreen;