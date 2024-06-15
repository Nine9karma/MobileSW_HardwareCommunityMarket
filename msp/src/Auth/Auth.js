// Auth.js - 회원가입 화면 구성 및 기능 처리 파일
import React, { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { signUp } from './AuthServiceA';
import CustomButton from './AuthCusttomButton';
import styles from '../style';

function Auth({ navigation }) {
    // 각 입력 필드의 상태를 관리하는 상태 변수들 정의
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');

    // 로그인과 회원가입 과정에서 발생하는 에러 메시지를 보여주기 위한 상태 변수들
    const [errorLogin, setErrorLogin] = useState('');
    const [errorSignup, setErrorSignup] = useState('');

    // 회원가입 버튼 클릭 시 실행되는 함수
    const handleSignup = async () => {
        // 비밀번호 일치 여부 검사
        if (password !== confirmPassword) {
            setErrorSignup("Passwords do not match.");
            return;
        }

        // 비밀번호 길이 검사 (6자 이상)
        if (password.length < 6) {
            setErrorSignup("Password must be at least 6 characters long.");
            return;
        }

        try {
            await signUp(email, password, nickname);  // AuthService에서 정의된 signUp 함수 호출하여 실제 회원가입 수행

            Alert.alert("Verification email sent", "Please verify your email before logging in.");
            navigation.navigate('Login');  // 로그인 페이지로 이동

        } catch (error) {
            setErrorSignup(error.message);
            console.log('회원가입 실패:', error.message);
        }
    };


    // UI 렌더링 부분
    return (
        <View style={styles.authContainer}>

            {/* 닉네임 입력란 */}
            <TextInput
                placeholder="Nickname"
                value={nickname}
                onChangeText={setNickname}
                style={styles.authTextInput}
            />

            {/* 이메일 입력란 */}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.authTextInput}
            />

            {/* 비밀번호 입력란 */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.authTextInput}
            />

            {/* 비밀번호 확인 입력란 */}
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.authTextInput}
            />

            {/* 로그인 에러 메시지 출력 */}
            {!!errorLogin && (
                <Text style={styles.authErrorText}>{errorLogin}</Text>
            )}

            {/* 회원가입 에러 메시지 출력 */}
            {!!errorSignup && (
                <Text style={styles.authErrorText}>{errorSignup}</Text>
            )}

            {/* 회원가입 버튼 */}
            <CustomButton title="Sign up" onPress={handleSignup} />
        </View>
    );
}

export default Auth;
