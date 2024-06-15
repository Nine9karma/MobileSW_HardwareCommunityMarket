import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { uploadImages, submitPost } from './postFunctions'; // 게시물 처리를 위한 필요한 함수들 임포트
import ImagePickerComponent from './ImagePickerComponent'; // 사용자 정의 이미지 선택 컴포넌트 임포트
import styles from '../../style';

const AddPost = ({ navigation }) => {
    // 상태 변수 초기화
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURIs, setImageURIs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 폼 제출 처리 함수
    const handleSubmit = async () => {
        if (isSubmitting) return; // 중복 제출 방지

        if (title.trim() === '' || content.trim() === '') {
            Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');  // 제목 또는 내용이 비어 있을 때의 오류 메시지
        } else {
            setIsSubmitting(true);  // 제출 과정 시작

            try {
                let imagesData = [];
                if (imageURIs.length > 0) {
                    imagesData = await uploadImages(imageURIs, title);  // 이미지 업로드하고 그 데이터를 얻음
                }

                await submitPost(title, content, imagesData);  // 게시물 제출

                navigation.goBack();  // 성공적으로 게시물을 제출하면 이전 화면으로 돌아감 
            } finally {
                setIsSubmitting(false);   // 제출 과정 종료 
            }
        }
    };

    return (
        <ScrollView style={styles.addPostContainer}>
            <TextInput
                label="제목"
                value={title}
                onChangeText={setTitle}   /* 입력값이 변경될 때마다 title 상태 업데이트 */
                style={styles.addPostInput}
                mode="outlined"
            />
            <TextInput
                /* 내용 입력란 */
                label="내용"
                value={content}
                onChangeText={setContent}   /* 입력값이 변경될 때마다 content 상태 업데이트 */
                style={styles.addPostInput}
                mode="outlined"
                multiline                  /* 여러 줄의 텍스트를 허용 */
                numberOfLines={4}          /* 최대 라인 수 설정 */
            />
            <ImagePickerComponent imageURIs={imageURIs} setImageURIs={setImageURIs} />
            <Button icon="content-save" mode="contained" onPress={handleSubmit} style={styles.addPostSubmitButton} disabled={isSubmitting}>
                게시글 올리기
            </Button>
        </ScrollView>
    );
};

export default AddPost;
