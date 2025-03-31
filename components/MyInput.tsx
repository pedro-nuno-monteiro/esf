import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

interface MyInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  rightIcon?: React.ReactNode;
}

const MyInput: React.FC<MyInputProps> = ({ value, onChangeText, style, rightIcon, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textInput, style]}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize='none'
        {...props}
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 62, 138, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  iconContainer: {
    paddingRight: 10,
    justifyContent: 'center',
  },
});

export default MyInput;
