import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import * as web3 from '@solana/web3.js';

interface SendScreenProps {
  route: {
    params: {
      solanaAddress: string;
    };
  };
  navigation: any; // Burada navigation props'unun tipini daha spesifik belirtmeniz gerekebilir.
}

const SendScreen: React.FC<SendScreenProps> = ({ route, navigation }) => {

  const [address, setAddress] = useState<string>(route.params.solanaAddress);
  const [amount, setAmount] = useState<string>(''); // amount'u string olarak tut

  const senderKeypair = web3.Keypair.fromSecretKey(new Uint8Array(
    [207,41,67,33,0,11,73,126,238,146,156,131,134,245,6,71,211,132,25,7,78,247,193,235,169,242,185,131,232,94,170,56,56,153,136,178,181,50,196,130,189,111,134,21,2,232,69,58,50,184,203,12,134,236,131,24,82,58,253,55,141,85,44,216]
  ));
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  const handleAmountChange = (text: string): void => {
    // Girilen metni bir sayıya dönüştür ve setAmount ile durumu güncelle
    const num = parseFloat(text);
    if (!isNaN(num)) {
      setAmount(text); // Sayısal bir değerse, miktarı string olarak güncelle
    } else {
      setAmount(''); // Girilen değer sayısal değilse, miktarı boş string olarak ayarla
    }
  };

  const sendSol = async () => {
    try {
      const lamports = parseFloat(amount) * web3.LAMPORTS_PER_SOL;
      if (isNaN(lamports)) {
        Alert.alert('Hata', 'Lütfen geçerli bir miktar giriniz');
        return;
      }

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new web3.PublicKey(address),
          lamports,
        }),
      );

      const signature = await web3.sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
      console.log('Transaction signature', signature);
      Alert.alert('Başarılı', 'Transaction başarıyla gönderildi.');
    } catch (error) {
      console.error('Transaction error', error);
      Alert.alert('Hata', 'Transaction gönderilirken bir hata oluştu.');
    }
  };

  const checkBalance = async () => {
    try {
      const balance = await connection.getBalance(senderKeypair.publicKey);
      console.log(`Hesap bakiyesi: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.error('Bakiye sorgulama hatası', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Alıcı Solana Adresi:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8, marginBottom: 20, paddingHorizontal: 10 }}
        onChangeText={setAddress}
        value={address}
        placeholder="Solana adresini girin"
      />
      <Text>Gönderilecek SOL Miktarı:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8, marginBottom: 20, paddingHorizontal: 10 }}
        onChangeText={handleAmountChange}
        value={amount}
        placeholder="SOL miktarını girin"
        keyboardType="numeric"
      />
      <Button title="Gönder" onPress={sendSol} />
    </View>
  );
};

export default SendScreen;
