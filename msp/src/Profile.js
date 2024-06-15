import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, updateEmail, sendEmailVerification, signOut } from 'firebase/auth';

const Profile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [email, setEmail] = useState(user.email);

    useEffect(() => {
        if (!user) {
            // 사용자가 로그인하지 않은 경우 처리
        }
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => console.log('User signed out!'))
            .catch((error) => console.error('Error signing out: ', error));
    };

    const handleUpdateEmail = () => {
        updateEmail(user, email)
            .then(() => {
                console.log('Email updated!');

                sendEmailVerification(user)
                    .then(() => {
                        Alert.alert('Verification email sent!');
                    })
                    .catch((error) => {
                        console.error('Error sending verification email: ', error);
                    });
            })
            .catch((error) => {
                console.error('Error updating email: ', error);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                placeholder="Enter your new email"
                placeholderTextColor="#A6AEC1"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
                <Text style={styles.buttonText}>Update Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSignOut]} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F5F7FB', // light grey background for a softer look
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#3E4C59', // dark text color for better readability
        textAlign: 'center',
        marginBottom: 48, // increased spacing for a more "airy" feel
    },
    label: {
        fontSize: 16,
        color: '#3E4C59',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D3DCE6', // softer color for the border
        borderRadius: 4, // rounded corners for the input fields
        paddingHorizontal: 16, // more horizontal padding for aesthetic purposes
        paddingVertical: 12, // more vertical padding to give text more space
        marginBottom: 24, // increased spacing between elements
        backgroundColor: '#FFFFFF', // white background to highlight active input field
        color: '#3E4C59', // text color that's easier on the eyes
    },
    button: {
        borderRadius: 4, // rounded corners for the buttons
        paddingVertical: 12, // taller buttons are easier to interact with
        paddingHorizontal: 16, // horizontal padding to center text within the button
        backgroundColor: '#4E67EB', // a pleasing, noticeable button color
        alignItems: 'center', // centers the text horizontally
        justifyContent: 'center', // centers the text vertically
        marginBottom: 16, // space between the buttons
    },
    buttonText: {
        color: '#FFFFFF', // white text to contrast with the button color
        fontSize: 16, // slightly larger font for readability
        fontWeight: '600', // heavier font weight for emphasis
    },
    buttonSignOut: {
        backgroundColor: '#FF6347', // a different color to distinguish the "Sign Out" button
    },
});

export default Profile;
