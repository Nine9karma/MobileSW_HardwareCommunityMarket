// BenchmarkItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../style';

// 벤치마크 항목을 표시하는 컴포넌트. 각 항목의 정보를 item prop으로 받음
const BenchmarkItem = ({ item }) => (
    // TouchableOpacity 컴포넌트로 감싸서 터치 가능한 영역 생성
    <TouchableOpacity>
        <View style={styles.benchmarkPost}>
            {/* 이미지 URL이 있으면 이미지를 표시 */}
            {item.imageURL ? (
                <Image source={{ uri: item.imageURL }} style={styles.benchmarkImage} />
            ) : null}

            {/* 벤치마크 정보를 표시하는 부분 */}
            <View style={styles.benchmarkTextContainer}>
                {/* 각종 벤치마크 정보 출력 */}
                <Text style={styles.bbenchmarkTitle}>Name: {item.id}</Text>
                <Text>Index: {item.Index}</Text>
                <Text>G3D Mark: {item['G3D Mark']}</Text>
                <Text>FHD: {item.FHD} fps</Text>
                <Text>QHD: {item.QHD} fps</Text>
                <Text>4K: {item['4K']} fps</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default BenchmarkItem;  // 이 모듈을 다른 파일에서 불러와 사용할 수 있도록 export
