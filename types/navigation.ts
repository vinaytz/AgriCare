import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  LanguageSelector: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  FarmerTabs: NavigatorScreenParams<FarmerTabParamList>;
  LabourTabs: NavigatorScreenParams<LabourTabParamList>;
  Profile: undefined;
};

export type AuthStackParamList = {
  RoleSelection: undefined;
  Signup: { role: 'farmer' | 'labour' };
  Login: { role: 'farmer' | 'labour' };
  OTPVerification: { 
    email?: string; 
    phone?: string; 
    role: 'farmer' | 'labour' 
  };
};

export type FarmerTabParamList = {
  Home: undefined;
  Chats: undefined;
  Labours: undefined;
  Services: undefined;
};

export type LabourTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Chats: undefined;
};