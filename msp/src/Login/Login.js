import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { login } from './AuthServiceL';
import CustomButton from './CustomButton';
import styles from '../style';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 사용자 인증 처리
    const handleLogin = async () => {
        try {
            const userCredential = await login(email, password);
            console.log("로그인 성공:", userCredential.user);
        } catch (error) {
            setError(error.message);
            console.log("로그인 실패:", error.message);
        }
    };

    return (
        <View style={styles.loginCenteredView}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.loginTextInput}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.loginTextInput}
            />
            {error && <Text style={styles.loginErrorText}>{error}</Text>}
            <CustomButton title="Login" onPress={handleLogin} />
            <CustomButton title="Go to Signup" onPress={() => navigation.navigate('Sign Up')} />
        </View>
    );
};

export default Login;
