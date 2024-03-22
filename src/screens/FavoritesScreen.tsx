import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';

interface Favorite {
  id: string;
  name: string;
  phone: string;
}

interface FavoritesScreenProps {
  favorites: Favorite[];
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favorites }) => {
  const renderFavoriteItem: ListRenderItem<Favorite> = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 18 }}>{item.name}</Text>
      <Text style={{ fontSize: 14 }}>{item.phone}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default FavoritesScreen;
