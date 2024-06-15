import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../style';

// MarketItem 컴포넌트는 마켓 리스트의 개별 아이템을 표시
const MarketItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.MarketItemContainer}>
      <Image source={{ uri: item.imagesData[0].url }} style={styles.MarketImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.MarketTitle}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.poster}>Posted by: {item.authorName}</Text>
        <Text>Views: {item.viewCount || 0}</Text>
        <Text numberOfLines={1} >{`${item.content.replace(/\n/g, '').slice(0, 10)}...`}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default MarketItem;
