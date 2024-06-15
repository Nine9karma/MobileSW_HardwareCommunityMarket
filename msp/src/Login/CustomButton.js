import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../style';

/**
 * 재사용 가능한 커스텀 버튼 컴포넌트.
 * 
 * @param {Object} props 컴포넌트의 프로퍼티들을 담은 객체
 * @param {string} props.title 버튼에 표시될 텍스트
 * @param {function} props.onPress 버튼 클릭 시 호출될 함수
 */
const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.loginCustomButton}>
        <Text style={styles.loginCustomText}>{title}</Text>
    </TouchableOpacity>
);

export default CustomButton;
