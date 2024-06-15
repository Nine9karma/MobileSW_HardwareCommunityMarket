import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getFirestore, doc, getDoc, collection, addDoc, deleteDoc, query, where, onSnapshot, orderBy, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CommunityDetail = ({ navigation }) => {
    const [postDetails, setPostDetails] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const route = useRoute();
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchPostDetail = async () => {
            const postRef = doc(db, "community", route.params.postId);
            const postDoc = await getDoc(postRef);

            if (postDoc.exists()) {
                setPostDetails(postDoc.data());

                if (postDoc.data().viewCount !== undefined) {
                    await updateDoc(postRef, {
                        viewCount: increment(1)
                    });
                } else {
                    await updateDoc(postRef, {
                        viewCount: 1
                    });
                }
            }
        };

        fetchPostDetail();

        let unsubscribe;
        if (route.params.postId) {
            const commentsRef = collection(db, 'communityComments', route.params.postId, 'comments');
            const q = query(commentsRef, orderBy('createdAt', 'asc'));

            unsubscribe = onSnapshot(q, snapshot => {
                const commentList = snapshot.docs.map(doc => doc.data());
                setComments(commentList);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };

    }, []);

    const handleDelete = async () => {
        if (postDetails.authorId !== auth.currentUser.uid) {
            alert('게시물을 삭제할 수 있는 권한이 없습니다.');
            return;
        }

        try {
            const postRef = doc(db, 'community', route.params.postId);
            await deleteDoc(postRef);

            alert('게시물이 성공적으로 삭제되었습니다!');
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('게시물 삭제에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim() === '') {
            alert('댓글을 입력해주세요.');
            return;
        }

        try {
            const commentRef = doc(db, 'communityComments', route.params.postId);
            const commentsCol = collection(commentRef, 'comments');
            await addDoc(commentsCol, {
                uid: auth.currentUser.uid,
                nickname: auth.currentUser.displayName,
                createdAt: new Date().toISOString(),
                text: commentText,
            });

            alert('댓글이 성공적으로 등록되었습니다!');
            setCommentText('');
        } catch (error) {
            console.error("Error writing comment:", error);
            alert('댓글 등록에 실패했습니다.');
        }
    };

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
                            <Text style={styles.title}>{postDetails.title}</Text>
                            <Text style={styles.author}>작성자: {postDetails.author}</Text>
                            <Text>Views: {postDetails.viewCount}</Text>
                            <Button
                                mode="contained"
                                onPress={handleDelete}
                                style={styles.deleteButton}
                                disabled={!auth.currentUser || postDetails.authorId !== auth.currentUser.uid}
                            >
                                Delete
                            </Button>
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
                                    <Text style={styles.commentAuthor}>{comment.nickname}</Text>
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
    deleteButton: {
        marginTop:10,
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    submitButton: {
        marginTop: 10
    }
});

export default CommunityDetail;
