import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';

import { connectMQTT, disconnectMQTT } from '../../services/mqtt';

const ArduinoPage = () => {

  const [sensorData, setSensorData] = useState<string>("");

    useEffect(() => {
      connectMQTT(setSensorData)
        .then(() => {
          console.log('Conectado ao MQTT');
        })
        .catch((err) => {
          Alert.alert('Erro', err);
        });

      return () => {
        disconnectMQTT();
      };
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arduino Sensor Values</Text>
      <FlatList
        data={sensorData}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.value}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default ArduinoPage;
