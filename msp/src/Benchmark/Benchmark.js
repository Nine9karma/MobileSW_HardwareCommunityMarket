// Benchmark.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BenchmarkItem from './BenchmarkItem';
import { fetchBenchmarks } from './BfirebaseService';
import styles from '../style';

const Benchmark = () => {
    // 벤치마크 데이터를 관리할 상태 변수 선언
    const [benchmarks, setBenchmarks] = useState([]);

    useEffect(() => {
        // 에러 처리 함수
        const handleError = (error) => console.error("Error fetching benchmarks:", error);

        // 컴포넌트가 마운트될 때 벤치마크 데이터를 가져옴
        const unsubscribe = fetchBenchmarks(setBenchmarks, handleError);

        // 컴포넌트가 언마운트될 때 데이터 가져오기 구독 취소
        return unsubscribe;
    }, []);

    return (
        <View style={styles.benchmarkContainer}>
            {/* 벤치마크 데이터를 리스트 형태로 표시 */}
            <FlatList
                data={benchmarks}  // 벤치마크 데이터 배열
                renderItem={({ item }) => <BenchmarkItem item={item} />}  // 각 항목을 렌더링하는 함수. 각 항목은 BenchmarkItem 컴포넌트로 표시됨.
                keyExtractor={(item) => item.id}  // 각 항목의 고유 키를 추출하는 함수. 여기서는 각 벤치마크의 id를 사용.
            />
        </View>
    );
};

export default Benchmark;  
