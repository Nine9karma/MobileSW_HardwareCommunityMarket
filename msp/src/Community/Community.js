import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CommunityPost from './CommunityPost';
import useCommunityPosts from './UseCommunityPosts';
import styles from '../style';

// 커뮤니티 화면 컴포넌트
const Community = () => {
    const navigation = useNavigation();  // 네비게이션 훅 사용

    // 커스텀 훅을 사용하여 포스트 가져옴
    const posts = useCommunityPosts();

    return (
        <View style={styles.comunityContainer}>
            {/* 가져온 포스트들을 FlatList로 출력 */}
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    // 각 포스트는 CommunityPost 컴포넌트로 렌더링. 클릭 시 해당 게시글의 상세 페이지로 이동
                    <CommunityPost
                        item={item}
                        onPress={() => navigation.navigate('CommunityDetail', { postId: item.id })}
                    />
                )}
                keyExtractor={(item) => item.id}  // 각 항목의 key는 id로 설정
            />

            {/* 글 작성 버튼. 클릭 시 글 작성 페이지로 이동 */}
            <FAB
                style={styles.communityFab}
                small
                icon="plus"
                onPress={() => {
                    console.log('FAB pressed');
                    navigation.navigate("AddPost");
                }}
            />
        </View>
    );
};

export default Community; 
