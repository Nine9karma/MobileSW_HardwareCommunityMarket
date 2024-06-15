import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from '../../../firebase';
import { Alert } from 'react-native';

// 이미지를 업로드하고 다운로드 URL을 반환하는 함수
export const uploadImages = async (imageURIs, title) => {
    const imagesData = [];

    for (let i = 0; i < imageURIs.length; i++) {
        // 각 이미지 URI로부터 blob 데이터를 얻음
        const response = await fetch(imageURIs[i]);
        const blob = await response.blob();

        // 스토리지에 저장할 이미지 이름 설정
        const imageName = `${title.replace(/\s/g, '')}_${i}`;

        // Firebase 스토리지에 이미지 업로드
        const storageRef = ref(storage, imageName);
        await uploadBytesResumable(storageRef, blob);

        // 업로드된 이미지의 다운로드 URL 획득
        const downloadURL = await getDownloadURL(storageRef);

        imagesData.push({ url: downloadURL });
    }

    return imagesData;
};

// 게시물을 Firebase에 제출하는 함수
export const submitPost = async (title, content, imagesData) => {
    try {
        // Firestore 'community' 컬렉션에 새 문서 추가 
        await addDoc(collection(db, "community"), {
            title,
            content,
            author: auth.currentUser.displayName,
            authorId: auth.currentUser.uid,
            email: auth.currentUser.email,
            createdAt: new Date().toISOString(),
            imagesData,
            viewCount: 0,
        });

        Alert.alert('게시글이 성공적으로 업로드되었습니다!');
    } catch (error) {
        console.error("Error uploading post: ", error);
        Alert.alert('게시글 업로드에 실패했습니다.');
    }
};
