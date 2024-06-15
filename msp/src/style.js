import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    //===================================================================Login
    loginCenteredView: {
        height: 450,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginTextInput: {
        height: 40,
        width: 380,
        borderColor: 'gray',
        borderWidth: 1
    },
    loginCustomButton: {
        height: 40,
        width: 380,
        backgroundColor: '#76B900',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 100,
        marginTop: 0.8
    },
    loginCustomText: {
        color: '#fff'
    }, loginErrorText: {
        color: "red"
    },
    //===================================================================Auth
    authContainer: {
        height: 550,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    authTextInput: {
        height: 40,
        width: 380,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
    },
    authButton: {
        height: 40,
        width: 380,
        backgroundColor: '#76B900',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 100,
        marginTop: 20
    },
    authButtonText: {
        color: '#fff',
    },
    authErrorText: {
        color: 'red',
    },
    //=====================================bench
    benchmarkContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    benchmarkPost: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    benchmarkImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    benchmarkTextContainer: {
        flex: 1, // 이를 추가하여 텍스트 컨테이너가 남은 공간을 채우도록 합니다.
        alignItems: 'flex-start', // 올바른 alignItems 값
    },
    bbenchmarkTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    //=====================================AddMarketPost



    //=====================================Market
    MarketContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    MarketItemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#ddd'
    },
    MarketTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    MarketImage: {
        width: 130,
        height: 130,
        marginRight: 20
    },
    MarketFab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }, 
    //==================================================Community
    comunityContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    communityPost: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10
    },
    communityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    communityFab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },
    //=====================AddPost
    addPostContainer: {
        flex: 1,
        padding: 10,
    },
    addPostInput: {
        marginBottom: 10,
        flex: 1,
        maxHeight: 570
    },
    addPostImageButton: {
        marginBottom:10
    },
    addPostSubmitButton: {
        marginTop: 10,
    },
    addPostFab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        marginBottom: -18
    },
    //=================================================profile
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    profileLabel: {
        fontSize: 16,
        marginBottom: 6,
    },
    profileInput: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 20,
    },
});
export default styles;