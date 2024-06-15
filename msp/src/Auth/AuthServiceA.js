// AuthService.js
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

export const signUp = async (email, password, nickname) => {
    // Firebase Auth를 사용하여 이메일과 비밀번호로 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    // 생성된 사용자에게 이메일 인증 메일 보내기
    await sendEmailVerification(userCredential.user);

    // Firebase Auth의 사용자 프로필 업데이트 (닉네임 설정)
    await updateProfile(userCredential.user, {
        displayName: nickname,
    });

    // Firestore에 사용자 정보 저장 (닉네임과 이메일)
    const userDoc = doc(db, 'users', userCredential.user.uid);  // 문서 이름을 uid로 설정
    await setDoc(userDoc, {
        nickname: nickname,
        email: email,
    });

    console.log('User data saved to Firestore');

    // 회원가입 후 자동 로그인 방지를 위해 바로 로그아웃 처리 
    await signOut(auth);
};
