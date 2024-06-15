import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image } from 'react-native';

// 이미지 선택 함수
export const pickImage = async (setImageURIs, imageURIs) => {
    // 사용자에게 이미지 라이브러리 접근을 허용하고, 이미지 선택
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    // 사용자가 이미지 선택을 취소하지 않은 경우, 이미지 URI 배열에 새 이미지 추가
    if (!result.cancelled) {
        setImageURIs([...imageURIs, result.uri]);
    }
};

// 이미지 업로드 함수
export const uploadImages = async (imageURIs, title) => {
    const storage = getStorage(); // Firebase storage 인스턴스 가져오기
    const images = []; // 업로드될 이미지 정보를 저장할 배열

    // 제공된 모든 이미지 URI에 대해 반복
    for (let i = 0; i < imageURIs.length; i++) {
        try {
            // 이미지 URI에서 데이터 가져오기
            const response = await fetch(imageURIs[i]);
            const blob = await response.blob(); // blob 형태로 변환

            const timestamp = Date.now(); // 현재 시간을 타임스탬프로 가져오기
            // 이미지 이름 구성: 타이틀_타임스탬프_인덱스
            const imageName = `${title.replace(/\s/g, '')}_${timestamp}_${i}`;

            // Firebase storage에 업로드할 참조 생성
            const storageRef = ref(storage, imageName);

            // 이미지를 Firebase storage에 업로드
            await uploadBytesResumable(storageRef, blob);

            // 업로드된 이미지의 다운로드 URL 가져오기
            const downloadURL = await getDownloadURL(storageRef);

            // 이미지의 크기 가져오기
            let imageSize;
            imageSize = await new Promise((resolve, reject) => {
                Image.getSize(downloadURL,
                    (width, height) => resolve({ width: width, height: height }), // 이미지의 너비와 높이 해상도 가져오기
                    (error) => reject(`Error getting size of image: ${error}`) // 에러 핸들링
                );
            });

            // images 배열에 이미지 정보 추가
            images.push({
                url: downloadURL,
                ...imageSize
            });
        } catch (error) {
            console.error("Error uploading images:", error); // 콘솔에 에러 로그 출력
            throw error;
        }
    }
    return images; // 업로드된 이미지 정보 반환
};
