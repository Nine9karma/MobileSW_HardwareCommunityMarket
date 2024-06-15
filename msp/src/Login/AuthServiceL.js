import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

/**
 * 이메일과 비밀번호를 사용하여 사용자 인증을 수행합니다.
 * 
 * @param {string} email 사용자의 이메일 주소
 * @param {string} password 사용자의 비밀번호
 * @returns {Promise} Firebase 인증 작업을 수행하는 프로미스
 */
export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email.trim(), password);
};
