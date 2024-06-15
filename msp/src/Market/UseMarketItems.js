import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

// Hook: useMarketItems
// 이 Hook은 Firestore로부터 상품 정보를 실시간으로 가져와서 상태로 관리합니다.
const useMarketItems = () => {
  // 상태: 상품 목록을 저장하기 위한 상태
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Firestore 인스턴스 초기화
    const db = getFirestore();
    // 'market' 컬렉션 참조 설정
    const marketCollection = collection(db, "market");
    // 'createdAt' 필드 기준으로 내림차순 정렬된 쿼리 생성
    const marketQuery = query(marketCollection, orderBy("createdAt", "desc"));

    // 스냅샷 리스너: 데이터베이스의 변경 사항을 실시간으로 수신하여 상태 업데이트
    const unsubscribe = onSnapshot(marketQuery, (snapshot) => {
      let newItems = [];
      snapshot.forEach((doc) => {
        // 문서 ID와 데이터를 포함하는 새로운 항목 배열 생성
        newItems.push({ id: doc.id, ...doc.data() });
      });
      // 상품 목록 상태 업데이트
      setItems(newItems);
    });

    // 컴포넌트가 언마운트되면 스냅샷 리스너 구독 취소
    return () => unsubscribe();
  }, []);

  // 가져온 상품 목록 반환
  return items;
};

export default useMarketItems;
