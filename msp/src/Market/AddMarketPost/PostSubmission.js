import { Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

// 게시글 제출 및 Firebase Firestore에 저장하는 함수
export const submitPost = async (title, price, content, imageURIs, imagesData, navigation, setIsLoading, uploadImages) => {
    // 제목이나 내용이 비어있는 경우 경고 메시지 표시
    if (title.trim() === '' || content.trim() === '') {
        Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
        return;
    }

    // 이미지가 선택되지 않은 경우 경고 메시지 표시
    if (!imageURIs.length) {
        Alert.alert('오류', '최소 하나의 이미지를 선택해주세요.');
        return;
    }

    // 가격이 유효하지 않은 경우 경고 메시지 표시
    if (isNaN(price) || Number(price) <= 0) {
        Alert.alert('오류', '가격은 0보다 커야 합니다.');
        return;
    }

    // 로딩 상태 활성화
    setIsLoading(true);

    try {
        const auth = getAuth(); // Firebase auth 인스턴스 가져오기
        const db = getFirestore(); // Firestore 인스턴스 가져오기

        // 업로드 함수를 통해 이미지 데이터 가져오기
        imagesData = await uploadImages();

        // 새로운 채팅방 생성 및 ID 생성
        const chatRoomId = `chat_${Date.now()}`;
        const chatRoomData = {
            roomId: chatRoomId,
            members: [auth.currentUser.uid], // 현재 사용자를 멤버로 추가
            createdAt: new Date().toISOString(), // 생성 시간 기록
        };
        // Firestore의 "chatRooms" 컬렉션에 채팅방 데이터 추가
        await addDoc(collection(db, "chatRooms"), chatRoomData);

        // 게시글 데이터 구성
        const postData = {
            title: title,
            price: Number(price),
            content: content,
            imagesData: imagesData, // 업로드된 이미지 데이터
            authorName: auth.currentUser.displayName, // 게시자의 이름
            authorEmail: auth.currentUser.email, // 게시자의 이메일
            createdAt: new Date().toISOString(), // 게시 시간
            viewCount: 0, // 조회 수 초기화
            chatRoomId: chatRoomId, // 연관된 채팅방 ID
            sellerChatId: auth.currentUser.uid, // 판매자 ID
        };
        // Firestore의 "market" 컬렉션에 게시글 데이터 추가
        await addDoc(collection(db, "market"), postData);

        // 성공 알림
        Alert.alert('게시글이 성공적으로 업로드되었습니다!');
        navigation.goBack(); // 이전 화면으로 돌아가기
    } catch (error) {
        console.error("Error writing document:", error); // 콘솔에 에러 로그 출력
        Alert.alert('게시글 업로드에 실패했습니다.'); // 사용자에게 실패 알림
    } finally {
        setIsLoading(false); // 로딩 상태 비활성화
    }
};
