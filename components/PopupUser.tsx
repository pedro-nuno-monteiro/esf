import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

import { FIREBASE_DB } from '@/FirebaseConfig';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdate: () => void;
}

const PopupUser: React.FC<PopupProps> = ({ isOpen, onClose, userId, onUpdate }) => {

  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {

    setLoading(true);
    
    try {
      console.log(userId);
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(userDocRef, {
        status: 'approved'
      });
      Alert.alert('Success', 'User aprovado com sucesso');
      onUpdate(); // Call the update function
      onClose();
    } catch (error: any) {
      console.error(error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDecline = async () => {
    setLoading(true);

    try {
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      await deleteDoc(userDocRef);
      Alert.alert('Success', 'User apagado com sucesso');
      onUpdate(); // Call the update function
      onClose();
    } catch (error: any) {
      console.error(error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Adicionar um novo User</Text>
          <View style={styles.buttons}>
            <TouchableOpacity 
              onPress={handleDecline}
              style={styles.button}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Reprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAccept}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'A adicionar...' : 'Aprovar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: Dimensions.get('window').width * 0.9,
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderRadius: 4,
  },
  texto: {
    height: 100,
    borderRadius: 4,
    padding: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    minWidth: 120,
    backgroundColor: '#023E8A',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default PopupUser;