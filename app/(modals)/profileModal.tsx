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
import Input from "@/components/Input";
import { UserDataType, UserType } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";
import { getProfileImage } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { useSelector,useDispatch } from "react-redux";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "@/store/userSlice"; 

const ProfileModal = () => {

  const dispatch = useDispatch()
  const userCurrentData = useSelector((state)=>state.user)

  console.log("QQQQQQ",userCurrentData)

  let [userData, setUserData] = useState<UserDataType>({
    id: userCurrentData?.user?.id,
    name: userCurrentData?.user?.name,
    email: userCurrentData?.user?.email,
    phoneNumber: userCurrentData?.user?.phoneNumber,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSelectImage = (file: any) => {
    // console.log("file: ", file);
    if (file) setUserData({ ...userData, image: file });
  };

  const onSubmit = async () => {
    const { name, email, phoneNumber } = userData;

    console.log("NAMMMAaaaaaa",name)
  
    // Basic validatio
    if (!name?.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
  
    if (!email?.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
  
    if (!phoneNumber?.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    setLoading(true);
  
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/user/update/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userCurrentData?.user?.token}`
        },
        body: JSON.stringify({
          id: userCurrentData?.user?.id, // or whatever your user ID field is
          username: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        })
      });
  
      const data = await response.json();
  
      setLoading(false);

      console.log("DDDDDD",data)      
      
      if (response.ok) {
        // Update local user data
        // updateUser(userCurrentData?.user?.uid);
         dispatch(setUser({
                  token: userCurrentData?.token,
                  user: userData,
                  msg: userCurrentData.msg
                }));
        // await AsyncStorage.setItem("userData", JSON.stringify({
        //   ...userCurrentData,
        //   user: userData
        // }));
        setUserData(userData)
        Alert.alert("Success", "Profile updated successfully");
        
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (error) {
      setLoading(false);
      console.error("Update error:", error);
      Alert.alert("Error", "An error occurred while updating your profile");
    }
  };

  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.5,
      });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets?.[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Update Profile"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          {/* form */}
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />
            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
            <Typo color={colors.neutral200}>Email</Typo>
            <Input
              placeholder="Email"
              value={userData.email}
              onChangeText={(value) =>
                setUserData({ ...userData, email: value })
              }
            />
            <Typo color={colors.neutral200}>Phone Number</Typo>
            <Input
              placeholder="Phone Number"
              value={userData.phoneNumber}
              onChangeText={(value) =>
                setUserData({ ...userData, phoneNumber: value })
              }
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.black} fontWeight={"700"} size={18}>
            Update
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
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
    // paddingVertical: spacingY._30,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
