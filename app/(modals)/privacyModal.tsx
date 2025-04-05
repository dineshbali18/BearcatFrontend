import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import { colors, spacingX, spacingY } from "@/constants/theme";
  import ModalWrapper from "@/components/ModalWrapper";
  import Header from "@/components/Header1";
  import Typo from "@/components/Typo";
  import Button from "@/components/Button";
  import { useRouter } from "expo-router";
  import BackButton from "@/components/BackButton";
  import { Switch } from "react-native";
  
  const PrivacyModal = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [settings, setSettings] = useState({
      dataSharing: false,
      biometricAuth: true,
    });
  
    const toggleSetting = (key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };
  
    const handleShareData = () => {
      Alert.alert(
        "Share Data with Partners",
        "This allows trusted partners to provide personalized offers and ads based on your financial activity.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable Sharing",
            onPress: () => toggleSetting('dataSharing')
          },
        ]
      );
    };
  
    const handleDeleteFinancialData = () => {
      Alert.alert(
        "Delete All Financial Data",
        "This will permanently erase all your transaction history, budgets, and financial records.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setLoading(true);
              // API call to delete data would go here
              setTimeout(() => {
                setLoading(false);
                Alert.alert("Success", "All financial data has been deleted");
              }, 1500);
            }
          },
        ]
      );
    };
  
    return (
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={"Settings"}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" color={colors.neutral100}>
                Data Sharing
              </Typo>
              
              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <Typo>Share with Marketing Partners</Typo>
                  <Typo size={12} color={colors.neutral300}>
                    Receive personalized offers and ads
                  </Typo>
                </View>
                <Switch
                  value={settings.dataSharing}
                  onValueChange={() => handleShareData()}
                  trackColor={{ true: colors.primary }}
                />
              </View>
            </View>
  
  
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button 
                onPress={handleShareData}
                style={[styles.actionButton, styles.shareButton]}
              >
                <Typo color={colors.white} fontWeight="600">
                  Share Data with Partners
                </Typo>
              </Button>
              
              {/* <Button 
                onPress={handleDeleteFinancialData}
                style={[styles.actionButton, styles.deleteButton]}
                loading={loading}
              >
                <Typo color={colors.white} fontWeight="600">
                  Delete All Financial Data
                </Typo>
              </Button> */}
            </View>
          </ScrollView>
        </View>
      </ModalWrapper>
    );
  };
  
  export default PrivacyModal;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingY._20,
    },
    form: {
      gap: spacingY._20,
      paddingBottom: spacingY._20,
    },
    section: {
      backgroundColor: colors.neutral800,
      borderRadius: 10,
      padding: spacingY._16,
      gap: spacingY._16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingText: {
      gap: spacingY._4,
      flex: 1,
      paddingRight: spacingX._10,
    },
    actionButtons: {
      gap: spacingY._12,
      marginTop: spacingY._10,
    },
    actionButton: {
      borderRadius: 8,
      paddingVertical: spacingY._14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareButton: {
      backgroundColor: colors.primary,
    },

    deleteButton: {
      backgroundColor: colors.rose,
    },
  });