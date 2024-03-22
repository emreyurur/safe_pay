import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import axios from 'axios';
import Send from '../components/Send';


interface ExtendedContact extends Contact {
  walletAddress?: string;
}

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ExtendedContact | null>(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestContactsPermission();
    } else {
      loadContacts();
    }
  }, []);

  const openSendModal = (address: any) => {
    setSelectedAddress(address);
    setModalVisible(true);
  };


  const loadContacts = async () => {
    try {
      const contactsList = await Contacts.getAll() as ExtendedContact[]; // ExtendedContact[] olarak tip dönüşümü
      setContacts(contactsList);
    } catch (error) {
      console.error('Kişileri yüklerken hata oluştu:', error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Kişiler Erişimi',
          message: 'Uygulama kişilerinize erişmek için izninize ihtiyaç duyar.',
          buttonNeutral: 'Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        loadContacts();
      } else {
        console.log('Kişilere erişim izni reddedildi.');
      }
    } catch (err) {
      console.warn('İzin isteme sırasında hata oluştu:', err);
    }
  };

  const saveWalletAddress = async () => {
    if (selectedContact && walletAddress) {
      try {
        const endpoint = 'http://192.168.14.51:3000/user';

        const data = {
          name: "Emre",
          wallet: walletAddress,
          number: "5348124821",
          image: "123ey"
        };

        const response = await axios.post(endpoint, data);

        console.log('Kaydedildi:', response.data);

        setContacts(prevContacts => {
          return prevContacts.map(contact => {
            if (contact.recordID === selectedContact?.recordID) {
              return {
                ...contact,
                walletAddress: walletAddress // Cüzdan adresini kaydet
              };
            }
            return contact;
          });
        });

        setModalVisible(false);
      } catch (error) {
        // Hata oluşursa console'a yazdırma
        console.error('Adres kaydedilirken hata oluştu:', error);
      }
    }
  };

  const renderContactModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedContact && (
              <>
                <Text style={styles.contactName}>{selectedContact.givenName}</Text>
                <Text style={styles.contactPhone}>{selectedContact.phoneNumbers[0]?.number}</Text>
              </>
            )}
            <Text style={styles.modalText}>Phantom Wallet Adresini Giriniz:</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={setWalletAddress}
              value={walletAddress}
              placeholder="Phantom Wallet Adresi"
            />
            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => saveWalletAddress()}>
              <Text style={styles.textStyle}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSave, { backgroundColor: 'red' }]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  function handleFavoritePress(item: ExtendedContact): void {
    throw new Error('Function not implemented.');
  }

  function handleWalletAddressPress(walletAddress: string | undefined): void {
    throw new Error('Function not implemented.');
  }

  return (
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
                  <Text>Solana Address:</Text>
              <Text style={[styles.walletAddress, styles.clickableText]}>{item.walletAddress}</Text>
              </TouchableOpacity>
              )}
              </View>

              <TouchableOpacity onPress={() => handleFavoritePress(item)}>
                <Image source={require('../assets/favorite.png')} style={styles.favoriteIcon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      {renderContactModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    fontSize: 14,
    color: 'grey',
  },
  walletAddress: {
    fontSize: 14,
    color: 'blue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
    marginBottom: 15,
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
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 15,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },

  clickableText: {
    textDecorationLine: 'underline',
    fontSize: 12, // Tıklanabilir metin için belirlenen font boyutu
  },
});

export default ContactsScreen;

