import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // 이미지 선택을 위한 라이브러리 임포트
import styles from '../../style';

const ImagePickerComponent = ({ imageURIs, setImageURIs }) => {
    // 이미지 선택 함수 정의
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // 사용자가 이미지 선택을 취소하지 않은 경우에만 이미지 URI를 상태에 추가
        if (!result.cancelled) {
            setImageURIs([...imageURIs, result.uri]);
        }
    };

    return (
        <>
            <Button icon="camera" mode="contained" onPress={pickImage} style={styles.addPostImageButton}>
                이미지 선택
            </Button>
            {/* 각각의 이미지 URI를 이용하여 이미지 표시 */}
            {imageURIs.map((uri, index) => <Image key={index} source={{ uri }} style={{ width: 200, height: 200 }} />)}
        </>
    );
};

export default ImagePickerComponent;
