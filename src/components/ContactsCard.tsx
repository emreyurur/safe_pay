import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface ContactsCardProps {
    name: string;
    phone: string;
    phantomWallet?: string; // Made it optional in case it's not always provided
    isFavorite: boolean;
    onPress: () => void;
    onFavoritePress: () => void;
    walletAddress?: string; // This prop should be optional to handle cases where it's not provided
  }
  

const ContactsCard: React.FC<ContactsCardProps> = ({
  name,
  phone,
  phantomWallet,
  isFavorite,
  onPress,
  onFavoritePress,
  walletAddress,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
        {walletAddress && (
  <Text style={styles.walletAddress}>
    Solana Address: {walletAddress.substring(0, 4)}***{walletAddress.substring(walletAddress.length - 4)}
  </Text>
)}
      </TouchableOpacity>
      <TouchableOpacity onPress={onFavoritePress}>
        <Image
          source={require('../assets/favorite.png')}
          style={[styles.favoriteIcon, { tintColor: isFavorite ? 'yellow' : 'grey' }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: 'grey',
  },
  walletAddress: {
    fontSize: 12,
    color: 'blue',
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000', // Başlangıç rengi siyah
  },
});

export default ContactsCard;
