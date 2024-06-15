// CustomButton.js - 사용자 정의 버튼 컴포넌트 파일
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../style';

// 'CustomButton' 컴포넌트 정의. 'title'과 'onPress' props를 받음
const CustomButton = ({ title, onPress }) => {
    return (
        // TouchableOpacity 컴포넌트를 이용해 터치 가능한 버튼 생성. 버튼을 누르면 props로 받은 onPress 함수가 실행됨.
        <TouchableOpacity onPress={onPress} style={styles.authButton}>
            {/* Button 내부의 Text 컴포넌트. Button의 이름으로 props로 받은 title을 사용함. */}
            <Text style={styles.authButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton; 
