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
  import { scale, verticalScale } from "@/utils/styling";
  import BackButton from "@/components/BackButton";
  
  const PrivacyModal = () => {
    return (
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={"Privacy Policy"}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Introduction
              </Typo>
              <Typo style={styles.paragraph}>
                At Bearcat Finance, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
              </Typo>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Information We Collect
              </Typo>
              <Typo style={styles.paragraph}>
                We may collect personal information that you voluntarily provide to us when registering an account, including:
              </Typo>
              <View style={styles.list}>
                <Typo style={styles.listItem}>• Personal identification details (name, email address)</Typo>
                <Typo style={styles.listItem}>• Financial transaction data</Typo>
                <Typo style={styles.listItem}>• Budget and savings information</Typo>
                <Typo style={styles.listItem}>• Device information and usage data</Typo>
              </View>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                How We Use Your Information
              </Typo>
              <Typo style={styles.paragraph}>
                We use the information we collect to:
              </Typo>
              <View style={styles.list}>
                <Typo style={styles.listItem}>• Provide and maintain our service</Typo>
                <Typo style={styles.listItem}>• Improve user experience</Typo>
                <Typo style={styles.listItem}>• Develop new features and functionality</Typo>
                <Typo style={styles.listItem}>• Communicate with you about your account</Typo>
                <Typo style={styles.listItem}>• Ensure security and prevent fraud</Typo>
              </View>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Data Security
              </Typo>
              <Typo style={styles.paragraph}>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </Typo>
              <Typo style={styles.paragraph}>
                All financial data is encrypted both in transit and at rest using industry-standard protocols.
              </Typo>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Data Retention
              </Typo>
              <Typo style={styles.paragraph}>
                We retain your personal data only for as long as necessary to provide you with our services and for legitimate business purposes. You may request deletion of your data at any time through the app settings.
              </Typo>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Your Rights
              </Typo>
              <Typo style={styles.paragraph}>
                You have the right to:
              </Typo>
              <View style={styles.list}>
                <Typo style={styles.listItem}>• Access your personal data</Typo>
                <Typo style={styles.listItem}>• Request correction of inaccurate data</Typo>
                <Typo style={styles.listItem}>• Request deletion of your data</Typo>
                <Typo style={styles.listItem}>• Object to processing of your data</Typo>
                <Typo style={styles.listItem}>• Request restriction of processing</Typo>
                <Typo style={styles.listItem}>• Request data portability</Typo>
              </View>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Changes to This Policy
              </Typo>
              <Typo style={styles.paragraph}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </Typo>
            </View>
  
            <View style={styles.section}>
              <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
                Contact Us
              </Typo>
              <Typo style={styles.paragraph}>
                If you have any questions about this Privacy Policy, please contact us at privacy@bearcatfinance.com.
              </Typo>
              <Typo style={[styles.paragraph, styles.noteText]}>
                Last updated: {new Date().toLocaleDateString()}
              </Typo>
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
    content: {
      paddingVertical: spacingY._10,
    },
    section: {
      marginBottom: spacingY._24,
    },
    sectionTitle: {
      marginBottom: spacingY._12,
      color: colors.neutral100,
    },
    paragraph: {
      color: colors.neutral200,
      lineHeight: 22,
      marginBottom: spacingY._12,
    },
    list: {
      marginBottom: spacingY._12,
      paddingLeft: spacingX._16,
    },
    listItem: {
      color: colors.neutral200,
      marginBottom: spacingY._6,
      lineHeight: 20,
    },
    noteText: {
      color: colors.neutral300,
      fontStyle: 'italic',
      fontSize: 14,
    },
  });