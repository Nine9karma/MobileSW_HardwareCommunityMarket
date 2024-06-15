import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../style';

// 커뮤니티 포스트를 표현하는 컴포넌트
const CommunityPost = ({ item, onPress }) => (
    // TouchableOpacity 컴포넌트로 감싸서 터치 가능한 영역 생성
    <TouchableOpacity onPress={onPress}>
        <View style={styles.communityPost}>
            {/* 포스트의 제목 출력 */}
            <Text style={styles.communityTitle}>{item.title}</Text>

            {/* 포스트의 작성자 출력 */}
            <Text style={styles.author}>작성자: {item.author}</Text>

            {/* 포스트의 작성일 출력. Date 객체로 변환 후 로컬 시간 문자열로 변환하여 출력 */}
            <Text style={styles.date}>작성일: {new Date(item.createdAt).toLocaleString()}</Text>

            {/* 조회수 출력. 조회수가 없으면 0으로 기본 설정 */}
            <Text>Views: {item.viewCount || 0}</Text>
            
            {/* 내용의 첫 부분(10글자)만 표시. 줄바꿈 문자는 삭제하고 문자열을 자름 */}
            <Text>{item.content.replace(/\n/g, '').substring(0, 10)}</Text>
        </View>
    </TouchableOpacity>
);

export default CommunityPost; 
