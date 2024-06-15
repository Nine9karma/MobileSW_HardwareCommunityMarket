import "react-native-gesture-handler";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Entypo } from "@expo/vector-icons";
import Login from "./src/Login/Login";
import Community from "./src/Community/Community";
import Benchmark from "./src/Benchmark/Benchmark";
import Market from "./src/Market/Market";
import Auth from './src/Auth/Auth';
import AddPost from './src/Community/AddPost/AddPost';
import AddMarketPost from './src/Market/AddMarketPost/AddMarketPost';
import CommunityDetail from './src/Community/CommunityDetail';
import MarketDetail from './src/Market/MarketDetail';
import MessageBox from './src/MessageBox';
import Profile from './src/Profile';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      }
      else {
        setUser(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    });
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <RootNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      {/* 추가된 부분 */}
      <Stack.Screen name="Sign Up" component={Auth} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator();
const CommunityStack = createStackNavigator();
const MarketStack = createStackNavigator();
const MessageStack = createStackNavigator();

function CommunityStackScreen() {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen name="Community" component={Community} />
      <CommunityStack.Screen name="AddPost" component={AddPost} />
      <CommunityStack.Screen name="CommunityDetail" component={CommunityDetail} />
    </CommunityStack.Navigator>
  );
}

function MarketStackScreen() {
  return (
    <MarketStack.Navigator>
      <MarketStack.Screen name="Market" component={Market} />
      <MarketStack.Screen name="AddMarketPost" component={AddMarketPost} />
      <MarketStack.Screen name="MarketDetail" component={MarketDetail} />
    </MarketStack.Navigator>
  );
}
function MessageStackScreen() {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen name="MessageBox" component={MessageBox} />
      
    </MessageStack.Navigator>
  );
}
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Community">
      <BottomTab.Screen
        name="Benchmark"
        component={Benchmark}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Community"
        component={CommunityStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="chat" color={color} size={size} />
          ), headerShown: false
        }}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="shopping-cart" color={color} size={size} />
          ), headerShown: false
        }}
      />
      <BottomTab.Screen
        name="MessageBox" // changed to "Messages"
        component={MessageStackScreen} // Use your ChatRoomList screen here 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="mail" color={color} size={size} /> // changed to a mail icon
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}   // Use your UserProfile screen here
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />  // Use 'user' icon for the tab
          ), headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}