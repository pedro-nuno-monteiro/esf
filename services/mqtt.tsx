import mqtt from 'mqtt';

const mqtt_host = "wss://4cfa2bf7b6f54696a4897e1b6882558d.s1.eu.hivemq.cloud:8884/mqtt";
const mqtt_user = "pedro";
const mqtt_password = "Pepas1206";
const topic = "arduino/data";

let client: mqtt.MqttClient;

const clientId = `react_native_${Math.random().toString(16).slice(2, 10)}`;

export const connectMQTT = (setData: (message: string) => void) => {
  return new Promise<void>((resolve, reject) => {
    try {
      client = mqtt.connect(mqtt_host, {
        username: mqtt_user,
        password: mqtt_password,
        clientId: clientId,
        protocol: 'wss',
        reconnectPeriod: 1000,
      });

      client.on('connect', () => {
        client.subscribe(topic, (err) => {
          if (!err) {
            resolve();
          } else {
            console.error('Erro no tópico:', err);
            reject(err);
          }
        });
      });

      client.on('message', (topic, message) => {
        console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
        setData(message.toString());
      });

      client.on('error', (err) => {
        console.error('Erro de conexão MQTT:', err);
      });

      client.on('offline', () => {
        console.warn('Cliente MQTT offline');
      });

      client.on('reconnect', () => {
        console.log('Tentando reconectar ao MQTT...');
      });

      client.on('close', () => {
        console.log('Conexão MQTT fechada');
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  });
};

export const disconnectMQTT = () => {
  if (client) {
    console.log('A desconectar do MQTT...');
    client.end();
  }
};