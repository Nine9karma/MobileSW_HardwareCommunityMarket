// firebaseService.js
import { collection, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase';

// 벤치마크 데이터를 가져오는 함수. 성공 시 setBenchmarks 콜백으로 데이터를 전달하고,
// 실패 시 handleError 콜백으로 에러를 전달
export const fetchBenchmarks = (setBenchmarks, handleError) => {
    // Firestore에서 "Benchmark" 컬렉션 참조 생성
    const benchmarkCollection = collection(db, "Benchmark");

    // onSnapshot을 사용하여 실시간 업데이트 구독 설정
    const unsubscribe = onSnapshot(benchmarkCollection, async (querySnapshot) => {
        let benchmarksData = [];

        // 각 문서에 대해 이미지 URL을 가져와 데이터 객체 생성 후 배열에 추가
        await Promise.all(querySnapshot.docs.map(async (doc) => {
            let data = doc.data();
            let imageRef = ref(storage, `GPU/${doc.id}.jpg`);

            try {
                let url = await getDownloadURL(imageRef);
                data.imageURL = url;
            } catch (error) {
                console.log("Error in getting image url", error);

                // 이미지 URL을 가져오는 데 실패하면 imageURL 필드를 빈 문자열로 설정
                data.imageURL = "";
            }

            benchmarksData.push({ id: doc.id, ...data });
        }));

        // Index 필드 기준으로 내림차순 정렬 후 상태 업데이트 함수 호출
        benchmarksData.sort((a, b) => b.Index - a.Index);
        setBenchmarks(benchmarksData);
    }, handleError);

    return unsubscribe;  // 구독 취소 함수 반환. 이 함수는 컴포넌트가 언마운트될 때 호출
};
