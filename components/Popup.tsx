import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

import MyInput from './MyInput';

import { FIREBASE_DB } from '@/FirebaseConfig';
import { addDoc, collection, doc, getDoc} from 'firebase/firestore';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, userId }) => {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [horas, setHoras] = useState('');

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setTipo('');
    setHoras('');
  };

  const handleAddChallenge = async () => {

    if (!nome.trim() || !descricao.trim() || !tipo.trim() || !horas.trim()) {
      Alert.alert('Error', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {

      const challengeData = {
        nome,
        descricao,
        tipo,
        horas: Number(horas),
        userId, // Reference to the user who created it
        status: 'pending', // Add status to track challenge state
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(FIREBASE_DB, 'challenges'), challengeData);
    
      Alert.alert('Success', 'Challenge adicionado com sucesso');
      resetForm();
      onClose();

    } catch (error: any) {
      console.error(error);
      alert('Registration failed: ' + error.message);
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
          <Text style={styles.title}>Adicionar um novo Challenge</Text>
          <MyInput
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholder='Nome'
            editable={!loading}
          />
          <MyInput
            value={descricao}
            onChangeText={setDescricao}
            style={styles.texto}
            placeholder='Descrição'
            editable={!loading}
          />
          <MyInput
            value={tipo}
            onChangeText={setTipo}
            style={styles.input}
            placeholder='Especialidade de Engenheiro'
            editable={!loading}
          />
          <MyInput
            value={horas}
            onChangeText={setHoras}
            style={styles.input}
            placeholder='N.º de horas'
            editable={!loading}
          />

          <View style={styles.buttons}>
            <TouchableOpacity 
              onPress={handleAddChallenge}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Adding...' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.button}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Fechar</Text>
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

export default Popup;