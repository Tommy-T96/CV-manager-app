import React from 'react';
import {Platform} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CVDetailScreen from '@/screens/CVDetailScreen';
import UploadModalScreen from '@/screens/UploadModalScreen';
import QueryScreen from '@/screens/QueryScreen';
import {colors} from '@/constants/colors';

export type RootStackParamList = {
  Tabs: undefined;
  'cv/detail': {id: string};
  upload: undefined;
  query: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
      }}>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="cv/detail"
        component={CVDetailScreen}
        options={{
          title: 'CV Details',
          presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
        }}
      />
      <Stack.Screen
        name="upload"
        component={UploadModalScreen}
        options={{
          title: 'Upload CV',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="query"
        component={QueryScreen}
        options={{
          title: 'Query CVs',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}