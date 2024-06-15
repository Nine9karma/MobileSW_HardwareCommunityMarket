import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { collection, query, where, onSnapshot, addDoc, orderBy } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

function MessageBox() {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [reply, setReply] = useState('');
    const [nickname, setNickname] = useState('');


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                // Firebase 사용자 프로필에서 닉네임 가져오기
                setNickname(currentUser.displayName || "Anonymous"); // displayName이 없다면 "Anonymous" 사용
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(db, "messages"),
                where("receiverId", "==", user.uid),
                orderBy("timestamp", "desc") // 여기에 추가합니다. "desc"는 내림차순 정렬을 의미합니다.
            );

            const unsubscribeMessages = onSnapshot(q,
                (querySnapshot) => {
                    const fetchedMessages = [];
                    querySnapshot.forEach((doc) => {
                        fetchedMessages.push({ ...doc.data(), id: doc.id });
                    });
                    setMessages(fetchedMessages);
                },
                (error) => {
                    console.error("Error fetching messages: ", error);
                }
            );

            return () => unsubscribeMessages();
        }
    }, [user]);

    const handleSendReply = async () => {
        if (!reply.trim()) {
            Alert.alert("Error", "Reply cannot be empty.");
            return;
        }

        try {
            await addDoc(collection(db, 'messages'), {
                senderId: user.uid,
                senderNickname: nickname,
                receiverId: selectedMessage.senderId,
                content: reply,
                timestamp: new Date().toISOString(), // 현재 시간을 ISO 형식의 문자열로 저장합니다.
            });

            setReply('');
            setModalVisible(false);
            setSelectedMessage(null);
            Alert.alert("Success", "Reply sent successfully.");
        } catch (error) {
            console.error("Error sending reply: ", error);
            Alert.alert("Error", "Failed to send the reply.");
        }
    };

    const formatTimestamp = (timestamp) => {
        let date;
        if (timestamp instanceof Date) {
            // timestamp가 이미 Date 객체인 경우
            date = timestamp;
        } else if (timestamp.toDate) {
            // timestamp가 Firestore Timestamp 객체인 경우
            date = timestamp.toDate();
        } else {
            // timestamp가 문자열이나 다른 형태일 경우
            date = new Date(timestamp);
        }

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };
    const toggleModal = () => {
        // 모달을 닫을 때마다 reply를 초기화합니다.
        if (modalVisible) {
            setReply('');
            setSelectedMessage(null); // 선택된 메시지도 초기화합니다.
        }
        setModalVisible(!modalVisible);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!user) {
        return <View style={styles.container}><Text>No user is authenticated</Text></View>;
    }
    return (
        <View style={styles.container}>
            {/* 메시지 목록 */}
            {messages.map((message) => {
                // 메시지에 대한 타임스탬프 문자열 생성
                const dateString = message.timestamp ? formatTimestamp(message.timestamp) : 'Timestamp not available';

                return (
                    <TouchableOpacity
                        key={message.id}
                        onPress={() => {
                            setSelectedMessage(message);
                            setModalVisible(true);
                        }}
                    >
                        <View style={styles.messageBox}>
                            <Text style={styles.messageText}>From: {message.senderNickname}</Text>
                            <Text style={styles.messageText}>Message: {message.content}</Text>
                            <Text style={styles.messageText}>Time: {dateString}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {selectedMessage && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={toggleModal} // 여기서 새로운 함수를 사용합니다.
                >
                    {/* 이 부분이 모달 밖을 터치했을 때 닫히도록 하는 부분입니다. */}
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={toggleModal} // 여기서 새로운 함수를 사용합니다.
                    >
                        <View style={styles.centeredView}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { }}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Reply to: {selectedMessage.senderNickname}</Text>

                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setReply}
                                        value={reply}
                                        placeholder="Your reply"
                                    />

                                    <Button title="Send Reply" onPress={handleSendReply} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );

}
const theme = {
    primary: '#4F9DDE', // 예를 들어, 파란색 테마
    secondary: '#F4F5F7', // 배경색
    error: '#D32F2F', // 오류 메시지 등에 사용될 빨간색
    text: '#333', // 기본 텍스트 색상
    // ... 기타 필요한 색상들
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    messageBox: {
        padding: 10,
        marginBottom: 20,
        backgroundColor: theme.secondary, // 위의 색상 테마에서 정의한 배경색
        borderRadius: 10, // 둥근 모서리
        shadowColor: "#000", // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    messageText: {
        fontSize: 16,
        color: theme.text, // 위의 색상 테마에서 정의한 텍스트 색상
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: '90%', // 화면 폭의 90%
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        // ... 기존 코드 유지
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20, // 폰트 크기 증가
        fontWeight: 'bold', // 텍스트를 굵게
    },
    input: {
        height: 50,
        width: 280, // 입력란 너비 변경
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: theme.primary, // 테마의 주 색상으로 테두리 색상 설정
    }, modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
    },
});

export default MessageBox;
