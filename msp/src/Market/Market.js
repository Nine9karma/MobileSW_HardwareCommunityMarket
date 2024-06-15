import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MarketItem from './MarketItem'; // 분리한 MarketItem 컴포넌트를 임포트합니다.
import useMarketItems from './UseMarketItems'; // 분리한 useMarketItems 훅을 임포트합니다.
import styles from '../style';

const Market = () => {
    const navigation = useNavigation();
    const items = useMarketItems(); // 커스텀 훅을 사용하여 아이템을 가져옵니다.

    return (
        <View style={styles.MarketContainer}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MarketItem
                        item={item}
                        onPress={() => navigation.navigate('MarketDetail', { productId: item.id })}
                    />
                )}
            />
            <FAB
                style={styles.MarketFab}
                small
                icon="plus"
                onPress={() => navigation.navigate("AddMarketPost")}
            />
        </View>
    );
};

export default Market;
