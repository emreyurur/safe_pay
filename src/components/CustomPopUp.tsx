import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground } from 'react-native';
import Dialog, { DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const CustomPopUp: React.FC<Props> = ({ isVisible, onClose }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    console.log('Kaydedilen değer:', inputValue);
    onClose();
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/safe_pay_background.jpeg')}>
      <Dialog
        visible={isVisible}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        onTouchOutside={onClose}
        onDismiss={onClose}>
        <DialogContent style={[styles.dialogContent, {backgroundColor: 'desired-color-here'}]}>
          <DialogTitle title="Custom PopUp" />
          <View style={styles.container}>
            <Text style={styles.label}>Enter Value:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="Type here..."
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  dialogContent: {
    width: '80%',
    backgroundColor: 'white', // Burayı istediğiniz renkle değiştirebilirsiniz.
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'blue',
  },
  saveButtonText: {
    color: 'white',
  }
});

export default CustomPopUp;