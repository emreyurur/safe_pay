import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    ImageBackground
} from 'react-native';
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import LinearGradient from 'react-native-linear-gradient';
import 'react-native-get-random-values';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';

interface Transaction {
    id: string;
    amount: number; // SOL cinsinden miktar
    date: string; // İşlem tarihi
}


const HomeScreen: React.FC = () => {
    const [cüzdanAdresi, setCüzdanAdresi] = useState<string>('');
    const [bakiye, setBakiye] = useState<number | null>(null);
    const [hata, setHata] = useState<string>('');
    const [cüzdanBağlandı, setCüzdanBağlandı] = useState<boolean>(false);
    const [appState, setAppState] = useState(AppState.currentState);
      const [transactions, setTransactions] = useState<Transaction[]>([]);

    const getCüzdanBakiyesi = useCallback(async () => {
        const temizAdres = cüzdanAdresi.trim(); // Boşlukları kaldır
        if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(temizAdres)) {
            // Base58 formatını kontrol et
            setHata('Cüzdan adresi geçerli değil. Lütfen adresi kontrol edin.');
            return;
        }
        try {
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
            const cüzdan = new PublicKey(temizAdres);
            const bakiyeLamports = await connection.getBalance(cüzdan);
            setBakiye(bakiyeLamports / LAMPORTS_PER_SOL); // Solana'daki bakiyeyi SOL cinsinden dönüştür
            setCüzdanBağlandı(true);
            setHata('');
        } catch (error) {
            console.error('Cüzdan bakiyesi sorgulanırken bir hata oluştu:', error);
            setHata('Bakiye sorgulanırken bir hata oluştu. Lütfen cüzdan adresini kontrol edin.');
        }
    }, [cüzdanAdresi]);

    useFocusEffect(
        useCallback(() => {
            if (cüzdanBağlandı) {
                getCüzdanBakiyesi();
            }
        }, [cüzdanBağlandı, getCüzdanBakiyesi])
    );

    return (
        <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/safe_pay_background.jpeg')}>
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <LinearGradient
                    colors={['#6a11cb', '#2575fc']} // Mavi ve mor tonlarında renk geçişi
                    style={styles.gradient}
                >
                    <View style={styles.topContainer}>
                        {!cüzdanBağlandı ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your wallet address..."
                                    placeholderTextColor="#fff"
                                    value={cüzdanAdresi}
                                    onChangeText={setCüzdanAdresi}
                                />
                                <TouchableOpacity style={styles.button} onPress={getCüzdanBakiyesi}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../assets/Phantom.png')} style={styles.buttonImage} />
                                        <Text style={styles.buttonText}>Connect your Phantom Wallet</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {bakiye !== null && (
                                    <View style={styles.bakiyeCard}>
                                        <Text style={styles.bakiyeText}>Balance: {bakiye} SOL</Text>
                                    </View>
                                )}
                                {hata !== '' && <Text style={styles.hataText}>{hata}</Text>}
                            </>
                        )}
                    </View>
                </LinearGradient>
                {/* İşlem geçmişini listeleyecek alan burada olacak */}
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
      },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    gradient: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        color: '#fff',
        fontSize: 20
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonImage:{
        width:40,
        height:40
    },
    buttonText: {
        color: '#6a11cb',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft:6
    },
    bakiyeCard: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bakiyeText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    hataText: {
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});

export default HomeScreen;

