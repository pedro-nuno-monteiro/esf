import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { collection, doc, getDoc, getDocs, query, where} from 'firebase/firestore';

import Popup from '@/components/Popup';
import PopupUser from '@/components/PopupUser';

interface Card {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  horas: number;
  status: string;
  createdAt: string;
}

interface UserData {
  id: string;
  email: string;
  expertise: string;
  fullName: string;
  institution: string;
  isStudent: string;
  oeNumber: string;
  phone: string;
  specialty: string;
}

const Home: React.FC = () => {

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState(false);
  const [popupUser, setPopupUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);

  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) {
          router.replace('/login');
          return;
        }
      };

      checkAuth();
    }, [])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        // verificar user
        const currentUser = FIREBASE_AUTH.currentUser;
        
        // se não estiver -> redirecionar
        // futuramente, impedir que entre na route sem login
        if (!currentUser) {
          router.replace('/login');
          return;
        }

        console.log(currentUser.uid);

        // verifica que tipo de user é
        const userTypeDoc = await getDoc(doc(FIREBASE_DB, 'userTypes', currentUser.uid));
        console.log(userTypeDoc.data());
        if (userTypeDoc.exists()) {
          const userType = userTypeDoc.data().type;
          
          // coloca numa var
          const collectionName = userType === 'engineer' || userType === 'admin'  ? 'users' : 'ongs';

          // retrieve dos dados do user corretos
          const userDoc = await getDoc(doc(FIREBASE_DB, collectionName, currentUser.uid));
          
          console.log(userDoc.data());
          // se existir, coloca na var userData
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              userType
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error loading user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchCards();
  }, [userData]);

  const fetchCards = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) return;

      // Only proceed if we have userData
      if (!userData?.userType) return;

      let querySnapshot;

      // Handle each user type separately
      switch (userData.userType) {
        case 'engineer':
          querySnapshot = await getDocs(
            query(collection(FIREBASE_DB, 'challenges'))
          );
          setCards(querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Card[]);
          break;

        case 'organization':
          querySnapshot = await getDocs(
            query(
              collection(FIREBASE_DB, 'challenges'),
              where('userId', '==', currentUser.uid)
            )
          );
          setCards(querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Card[]);
          break;

        case 'admin':
          querySnapshot = await getDocs(
            query(
              collection(FIREBASE_DB, 'users'),
              where('email', '!=', currentUser.email),
              where('status', '==', 'pending')
            )
          );
          setUsers(querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as UserData[]);
          break;

        default:
          setCards([]);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCards([]);
      setUsers([]);
    }
  };

  const openPopupUsers = (userId: string) => {
    setPopupUser(true);
    setSelectedUserId(userId); // You'll need to add this state
  };

  const openPopup = () => {
    setPopup(true);
  }

  const chatbot = async () => {
    router.replace('/chatbot');
  }

  const arduino = async () => {
    router.replace('/arduino');
  }

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo_esf.svg')}
        style={styles.logo}
      />

      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Bem Vindo, {userData.userType === 'engineer' ? userData.fullName : userData.orgName} {userData.userType === 'admin' ? userData.fullName : null}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={arduino}>
          <Text style={styles.buttonText}>Arduino</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={chatbot}>
          <Text style={styles.buttonText}>ChatBot</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {userData && (userData.userType === 'engineer' || userData.userType === 'organization') && (
          <View style={styles.headerContainter}>
            {userData.userType === 'engineer' ? (
              <Text style={styles.header2}>Desafios disponíveis</Text>
            ) : (
              <>
                <Text style={styles.header2}>Os seus challenges</Text>
                <TouchableOpacity style={styles.headerButton} onPress={openPopup}>
                  <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        {userData && userData.userType === 'admin' ? (
          <>
            <Text style={styles.header2}>Lista de utilizadores</Text>
            {users.map((card) => (
              <TouchableOpacity key={card.id} style={styles.card} onPress={() => openPopupUsers(card.id)}>
                <Text style={styles.cardTitle}>{card.fullName}</Text>
                <Text style={styles.cardDescription}>{card.email} | {card.institution}</Text>
                <Text style={styles.cardDetails}>
                  Especialidade: {card.specialty} | N.º {card.phone}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {cards.map((card) => (
              <View key={card.id} style={styles.card}>
                <Text style={styles.cardTitle}>{card.nome}</Text>
                <Text style={styles.cardDescription}>{card.descricao}</Text>
                <Text style={styles.cardDetails}>
                  Tipo: {card.tipo} | {card.horas} horas
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {popup && (
        <Popup 
          isOpen={popup}
          onClose={() => setPopup(false)}
          userId={userData ? userData.userId : ''}
        />
      )}

      {popupUser && (
        <PopupUser 
          isOpen={popupUser}
          onClose={() => setPopupUser(false)}
          userId={selectedUserId ? selectedUserId : ''}
          onUpdate={fetchCards}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 16,
    gap: 30,
  },
  logo: {
    marginTop: 5,
    height: 150,
    width: 150,
  },
  userInfo: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  headerButton: {
    backgroundColor: '#023E8A',
    padding: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: 'rgba(0, 150, 199, 0.6)',
    width: 315,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;