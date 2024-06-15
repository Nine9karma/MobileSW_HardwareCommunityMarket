import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Alert, Modal, Pressable, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, increment, deleteDoc, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



const MarketDetail = ({ navigation }) => {
    const [postDetails, setPostDetails] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);

    const [messageContent, setMessageContent] = useState('');
    const route = useRoute();
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        if (!route.params?.productId) {
            console.error("No productId found");
            return;
        }

        const fetchPostDetail = async () => {
            try {
                const postRef = doc(db, "market", route.params.productId);
                const postDoc = await getDoc(postRef);

                if (postDoc.exists()) {
                    setPostDetails(postDoc.data());

                    const newViewCount = postDoc.data().viewCount ? increment(1) : 1;
                    await updateDoc(postRef, {
                        viewCount: newViewCount
                    });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        fetchPostDetail();

        let unsubscribe;
        if (route.params.productId) {
            unsubscribe = onSnapshot(
                query(collection(db, 'comments'), where('postId', '==', route.params.productId), orderBy('createdAt', 'asc')),
                snapshot => {
                    let commentList = [];
                    snapshot.forEach(doc => commentList.push(doc.data()));
                    setComments(commentList);
                }
            );
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };

    }, []);

    const editPost = (productId) => {
        navigation.navigate('EditMarketPost', { productId: productId });
        console.log(productId)
    }

    const deletePost = async () => {
        if (auth.currentUser?.uid !== postDetails?.sellerChatId) {
            Alert.alert("Error", "You are not authorized to delete this post.");
            return;
        }

        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const db = getFirestore();
                            // Initialize a write batch
                            const batch = writeBatch(db);

                            const postRef = doc(db, 'market', route.params.productId);

                            // Get comments related to the post
                            const commentsRef = collection(db, 'comments');
                            const q = query(commentsRef, where('postId', '==', route.params.productId));
                            const commentSnapshot = await getDocs(q);

                            // Add each comment to the batch for deletion
                            commentSnapshot.forEach((doc) => {
                                batch.delete(doc.ref);
                            });

                            // Delete the main document
                            batch.delete(postRef);

                            // Commit the batch
                            await batch.commit();

                            Alert.alert('Success', 'Post deleted successfully!');
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error removing document: ", error);
                            Alert.alert('Error', 'Error removing document');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // Handle the submission of comments
    const handleCommentSubmit = async () => {
        if (commentText.trim() === '') {
            alert('Please enter a comment.');
            return;
        }

        try {
            await addDoc(collection(db, 'comments'), {
                postId: route.params.productId,
                author: auth.currentUser.displayName,
                email: auth.currentUser.email,
                text: commentText,
                createdAt: new Date().toISOString(),
            });

            alert('Comment added successfully!');
            setCommentText('');
        } catch (error) {
            console.error("Error writing comment:", error);
            alert('Failed to add comment.');
        }
    };
    const isNotCurrentUser = () => {
        return auth.currentUser?.uid !== postDetails?.sellerChatId; // 'sellerId'는 게시글 데이터에 포함된 판매자의 UID입니다.
    };
    // 게시글 작성자와 현재 로그인한 사용자가 동일한지 확인하는 함수
    const isCurrentUserTheSeller = () => {
        return auth.currentUser?.uid === postDetails?.sellerChatId; // 'sellerId'는 게시글 데이터에 포함된 판매자의 UID입니다.
    };

    const disabledDelButtonMessage = () => {
        if (isNotCurrentUser()) {
            return "타인의 게시물";
        }
        return "";
    };

    // 채팅 버튼이 비활성화될 때 출력할 메시지
    const disabledChatButtonMessage = () => {
        if (isCurrentUserTheSeller()) {
            return "본인의 게시물";
        }
        return "";
    };

    const openMessageModal = () => {
        setIsMessageModalVisible(true);
    };

    const closeMessageModal = () => {
        setIsMessageModalVisible(false);
        setMessageContent(''); // 모달을 닫을 때 메시지 내용을 초기화합니다.
    };
    const sendMessage = async () => {
        if (!messageContent.trim()) {
            Alert.alert("Error", "Message cannot be empty.");
            return;
        }

        try {
            // 새 메시지 문서를 생성합니다.
            await addDoc(collection(db, 'messages'), {
                senderId: auth.currentUser.uid, // 현재 로그인한 사용자의 UID
                receiverId: postDetails.sellerChatId, // 게시물 작성자의 UID
                timestamp: new Date().toISOString(), // 현재 시간
                content: messageContent, // 메시지 내용
                senderNickname: auth.currentUser.displayName, // 보내는 사람의 닉네임
            });

            // 메시지 전송 후 모달을 닫고, 메시지 내용을 초기화합니다.
            setModalVisible(false);
            setMessageContent('');
            Alert.alert("Success", "Message sent successfully.");
        } catch (error) {
            console.error("Error sending message: ", error);
            Alert.alert("Error", "Failed to send the message.");
        }
    };
    // Render
    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            <ScrollView style={styles.container}>
                {!postDetails ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <View style={styles.postContainer}>
                            <Text style={styles.title}>제목: {postDetails.title}</Text>
                            <Text style={styles.price}>Price: {postDetails.price}</Text>
                            <Text style={styles.author}>Posted by: {postDetails.authorName}</Text>
                            <Text>Views: {postDetails.viewCount}</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="contained"
                                    onPress={deletePost}
                                    style={styles.deleteButton}
                                    disabled={isNotCurrentUser()} // 추가: 현재 사용자가 작성자가 아닌 경우 비활성화
                                    color="red"
                                >
                                    {disabledDelButtonMessage() || 'Delete'}
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={openMessageModal} // 모달 창을 보이게 설정합니다.
                                    style={styles.messageButton}
                                    disabled={isCurrentUserTheSeller()} // 현재 사용자가 판매자인 경우 비활성화
                                >
                                    {disabledChatButtonMessage() || 'Send Message'}
                                </Button>
                            </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isMessageModalVisible}
                                onRequestClose={closeMessageModal}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Send a message</Text>
                                        <TextInput
                                            style={styles.modalTextInput}
                                            placeholder="Enter your message here..."
                                            value={messageContent}
                                            onChangeText={setMessageContent}
                                            multiline
                                            numberOfLines={4}
                                        />
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={closeMessageModal}
                                            >
                                                <Text>
                                                    <FontAwesome name="times" size={24} color="white" />
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonSend]}
                                                onPress={sendMessage}
                                            >
                                                <Text style={styles.textStyle}>Send</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            {postDetails.imagesData && postDetails.imagesData.map((imageData, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: imageData.url }}
                                    style={{ width: 360, height: 360, marginBottom: 10 }}
                                    resizeMode="contain"
                                />
                            ))}

                            <Text>{postDetails.content}</Text>
                        </View>

                        <View style={styles.commentsContainer}>
                            <Text style={styles.sectionTitle}>Comments</Text>
                            {comments.map((comment, index) => (
                                <View key={index} style={styles.comment}>
                                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                                    <Text>{comment.text}</Text>
                                    <Text style={{ alignSelf: "flex-end", fontSize: 10 }}>{new Date(comment.createdAt).toLocaleString()}</Text>
                                </View>
                            ))}
                            <TextInput
                                label="Write a comment..."
                                value={commentText}
                                onChangeText={(text) => setCommentText(text)}
                                mode="outlined"
                                multiline
                            />

                            <Button mode="contained" onPress={handleCommentSubmit} style={styles.submitButton}>
                                Submit Comment
                            </Button>
                        </View>
                    </>
                )}
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    postContainer: {
        marginBottom: 20
    },
    commentsContainer: {
        marginTop: 20
    }, messageButton: {
        flex: 1,
        marginLeft: 5, // 왼쪽 마진을 추가하여 버튼 사이에 공간을 만듭니다.
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    comment: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
    },
    commentAuthor: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    deleteButton: {
        flex: 1, // 버튼이 컨테이너의 공간을 동일하게 차지하도록 합니다.

    },
    chatButton: {
        flex: 1, // 버튼이 컨테이너의 공간을 동일하게 차지하도록 합니다.

    },
    submitButton: {
        marginTop: 10
    }, title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: '80%', // 모달 창의 너비를 조정합니다.
        maxHeight: '60%', // 모달 창의 최대 높이를 설정합니다.
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTextInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%', // or fixed width
    },
    mbuttonContainer: {
        backgroundColor: 'blue'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 100, // 버튼 너비
        justifyContent: 'center', // 컨텐츠 센터 정렬
        alignItems: 'center' // 컨텐츠 센터 정렬
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonSend: {
        backgroundColor: "#F194FF",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    cancelButton: {
        backgroundColor: 'red', // 원하는 색상 사용
    },
    sendButton: {
        backgroundColor: 'blue', // 원하는 색상 사용
    },
});

export default MarketDetail;
