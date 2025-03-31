import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { colors, spacingX, spacingY } from "@/constants/theme";
  import ModalWrapper from "@/components/ModalWrapper";
  import Header from "@/components/Header1";
  import Typo from "@/components/Typo";
  import Button from "@/components/Button";
  import { scale, verticalScale } from "@/utils/styling";
  import BackButton from "@/components/BackButton";
//   import { deleteUserFinancialData } from "@/services/userService"; // Assuming you have this service
  
  const ProfileModal = () => {
    const [loading, setLoading] = useState(false);
    // const router = useRouter();
  
    const handleDeleteData = async () => {
      Alert.alert(
        "Delete All Financial Data",
        "Are you sure you want to delete all your financial data? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
            //   try {
                // const res = await deleteUserFinancialData(user?.uid as string);
                // if (res.success) {
                  Alert.alert("Success", "All your financial data has been deleted.");
                //   router.back();
                // } else {
                //   Alert.alert("Error", res.msg || "Failed to delete financial data.");
                // }
            //   } catch (error) {
            //     Alert.alert("Error", "An error occurred while deleting your data.");
            //   } finally {
            //     setLoading(false);
            //   }
            },
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
          
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Typo size={18} fontWeight="600" style={styles.sectionTitle}>
                Data Management
              </Typo>
              
              <View style={styles.sectionContent}>
                <Typo style={styles.warningText}>
                  This will permanently delete all your financial records including:
                </Typo>
                
                <View style={styles.list}>
                  <Typo style={styles.listItem}>• All transaction history</Typo>
                  <Typo style={styles.listItem}>• Budgets and savings goals</Typo>
                  <Typo style={styles.listItem}>• Investment records</Typo>
                  <Typo style={styles.listItem}>• Any other financial data</Typo>
                </View>
                
                <Typo style={styles.noteText}>
                  Note: This action cannot be undone. Your account will remain active but all financial data will be erased.
                </Typo>
              </View>
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.footer}>
          <Button 
            onPress={handleDeleteData} 
            style={styles.deleteButton} 
            loading={loading}
            color={colors.error}
          >
            <Typo color={colors.white} fontWeight={"700"} size={18}>
              Delete All Financial Data
            </Typo>
          </Button>
        </View>
      </ModalWrapper>
    );
  };
  
  export default ProfileModal;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingY._20,
    },
    content: {
      paddingVertical: spacingY._10,
    },
    footer: {
      paddingHorizontal: spacingX._20,
      paddingTop: spacingY._15,
      borderTopColor: colors.neutral700,
      borderTopWidth: 1,
      marginBottom: spacingY._5,
    },
    section: {
      marginBottom: spacingY._30,
    },
    sectionTitle: {
      marginBottom: spacingY._15,
      color: colors.neutral100,
    },
    sectionContent: {
      backgroundColor: colors.neutral800,
      borderRadius: 10,
      padding: spacingY._20,
    },
    warningText: {
      marginBottom: spacingY._15,
      color: colors.neutral200,
      lineHeight: 22,
    },
    list: {
      marginBottom: spacingY._20,
    },
    listItem: {
      color: colors.neutral200,
      marginBottom: spacingY._5,
      marginLeft: spacingX._10,
    },
    noteText: {
      color: colors.neutral300,
      fontStyle: 'italic',
      fontSize: 14,
      lineHeight: 20,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
  });