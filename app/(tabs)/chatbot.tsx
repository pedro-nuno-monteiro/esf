import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';

import * as GoogleGenerativeAI from "@google/generative-ai";

const Chatbot: React.FC = () => {

  const [messages, setMessages] = useState<{ text: string; user: boolean }[]>([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {

    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI("AIzaSyAfEJMqeXeLvUxfkGdMNSJAEIOuZr0XJlY");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = "Olá!";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };

    startChat();
  }, []);

  const sendMessage = async () => {

    if (!userInput.trim()) return; 

    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI("AIzaSyAfEJMqeXeLvUxfkGdMNSJAEIOuZr0XJlY");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    setMessages([...messages, { text, user: false }]);
    setUserInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chatbot</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.user ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.user ? styles.userMessageText : styles.botMessageText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#023E8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#023E8A',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9ECEF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 20,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  sendButton: {
    backgroundColor: '#023E8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Chatbot;