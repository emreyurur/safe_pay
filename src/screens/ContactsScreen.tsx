import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native';
import Dialog, { SlideAnimation, DialogContent, DialogTitle } from 'react-native-popup-dialog';

interface ExtendedContact extends Contact {
  walletAddress?: string;
  isFavorite?: boolean;
}

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ExtendedContact | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestContactsPermission();
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = async () => {
    try {
      const contactsList = await Contacts.getAll() as ExtendedContact[];
      setContacts(contactsList);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'The app needs access to your contacts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        loadContacts();
      } else {
        console.log('Contacts permission denied.');
      }
    } catch (err) {
      console.warn('Error requesting contacts permission:', err);
    }
  };

  const saveWalletAddress = () => {
    if (selectedContact && walletAddress) {
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          if (contact.recordID === selectedContact?.recordID) {
            return {
              ...contact,
              walletAddress: walletAddress
            };
          }
          return contact;
        });
      });
      setModalVisible(false);
    }
  };

  const toggleFavorite = (recordID: string) => {
    setContacts(prevContacts => {
      return prevContacts.map(contact => {
        if (contact.recordID === recordID) {
          return {
            ...contact,
            isFavorite: !contact.isFavorite,
          };
        }
        return contact;
      });
    });
  };

  const handleWalletAddressPress = (address: string | undefined) => {
    if (address) {
      navigation.navigate('SendScreen', { address });
    }
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/safe_pay_background.jpeg')}>
      <View style={styles.container}>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.recordID}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedContact(item);
                setModalVisible(true);
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.name}>{item.givenName}</Text>
                  <Text style={styles.phone}>{item.phoneNumbers[0]?.number}</Text>
                  {item.walletAddress && (
                    <TouchableOpacity onPress={() => handleWalletAddressPress(item.walletAddress)}>
                      <Text style={[styles.walletAddress, styles.clickableText]}>Solana Address:</Text>
                      <Text style={[styles.walletAddress, styles.clickableText]}>{item.walletAddress}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.recordID)}>
                    <Image style={styles.favoriteIcon} source={item.isFavorite ? require('../assets/favorite_yellow.png') : require('../assets/favorite.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <Dialog
          visible={modalVisible}
          onTouchOutside={() => setModalVisible(false)}
          dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}>
          <DialogContent style={styles.modalView}>
            {selectedContact && (
              <>
                <Text style={styles.contactName}>{selectedContact.givenName}</Text>
                <Text style={styles.contactPhone}>{selectedContact.phoneNumbers[0]?.number}</Text>
              </>
            )}
            <Text style={styles.modalText}>Enter Solana Wallet Address:</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={setWalletAddress}
              value={walletAddress}
              placeholder="Solana Wallet Address"
            />
            <TouchableOpacity style={styles.buttonSave} onPress={saveWalletAddress}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonSave, { backgroundColor: 'red' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </DialogContent>
        </Dialog>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode:'cover',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#C9CCD5',
    padding: 15,
    marginVertical: 5,
    borderRadius: 15,
    margin:10,
    marginTop:10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:"black"
  },
  phone: {
    fontSize: 18,
    color:"black"
  },
  walletAddress: {
    fontSize: 20,
    color: 'blue',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom:15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 15,
  },
  favoriteIcon: {
    height: 18,
    width: 18,
  },
  clickableText: {
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#8109B7',
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
});

export default ContactsScreen;

