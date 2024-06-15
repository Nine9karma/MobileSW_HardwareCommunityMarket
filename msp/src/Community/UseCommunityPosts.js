import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

// 커뮤니티 포스트들을 가져와 상태로 관리하는 커스텀 훅
const useCommunityPosts = () => {
    // 가져온 포스트들을 저장할 상태 변수
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const db = getFirestore();

        // "community" 컬렉션 참조 생성
        const postsCollection = collection(db, "community");

        // 쿼리 생성: "createdAt" 필드 기준으로 내림차순 정렬된 결과를 반환하도록 설정
        const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));

        // 쿼리 결과에 대한 실시간 업데이트 구독 설정. 
        // 데이터가 업데이트될 때마다 콜백 함수가 호출되어 상태를 업데이트
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            let newPosts = [];
            snapshot.forEach((doc) => {
                newPosts.push({ id: doc.id, ...doc.data() });
            });

            setPosts(newPosts);  // 상태 업데이트 함수 호출하여 포스트 목록 상태 갱신
        });

        return () => unsubscribe();  // 구독 해제 함수 반환. 이는 컴포넌트가 언마운트될 때 실행
    }, []);

    return posts;
};

export default useCommunityPosts;
