import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, Image } from 'react-native';
import { TextInput, Button, FAB, Portal, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { pickImage, uploadImages } from './ImageUploader'; // 이미지 업로드 관련 함수
import { submitPost } from './PostSubmission'; // 게시글 제출 함수

// 마켓 게시글 추가 컴포넌트
const AddMarketPost = ({ navigation }) => {
    // 상태 초기화
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [content, setDescription] = useState('');
    const [openFabGroup, setOpenFabGroup] = useState(false);
    const [imageURIs, setImageURIs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 가격 입력 처리 함수: 숫자만 허용
    const handlePriceInput = (text) => {
        if (!isNaN(text) && Number(text) >= 0) {
            setPrice(text);
        } else if (text === '') {
            setPrice('');
        }
    };

    return (
        <Provider>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'
            >
                <ScrollView style={styles.container}>
                    {/* 제목 입력 */}
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                        mode="outlined"
                    />
                    {/* 가격 입력 */}
                    <TextInput
                        label="Price"
                        value={price}
                        onChangeText={handlePriceInput}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="numeric"
                    />
                    {/* 설명 입력 */}
                    <TextInput
                        label="Description"
                        value={content}
                        onChangeText={setDescription}
                        style={styles.input}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                    />
                    {/* 이미지 선택 버튼 */}
                    <Button icon="camera" mode="contained" onPress={() => pickImage(setImageURIs, imageURIs)} style={{marginBottom:10}}>
                        이미지 선택
                    </Button>
                    {/* 선택된 이미지 표시 */}
                    {imageURIs.map((uri, index) => <Image key={index} source={{ uri }} style={{ width: 200, height: 200 }} />)}
                    {/* 게시글 제출 버튼 */}
                    <Button
                        icon="content-save"
                        mode="contained"
                        onPress={() => submitPost(title, price, content, imageURIs, null, navigation, setIsLoading, () => uploadImages(imageURIs, title))}
                        disabled={isLoading}
                        style={styles.submitButton}
                    >
                        {isLoading ? '업로딩 중...' : '게시글 제출'}
                    </Button>
                </ScrollView>
            </KeyboardAwareScrollView>
        </Provider>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginBottom: 10,
        flex: 1,
        maxHeight: 520
    },
    submitButton: {
        marginTop: 10,
    },
});

export default AddMarketPost;
