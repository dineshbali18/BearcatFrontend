import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header1";
import Typo from "@/components/Typo";
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
              At JackPick Lottery, your privacy is our top priority. This policy explains how we collect, use, and protect your personal data when you use our app to participate in games and manage your wallet.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              Information We Collect
            </Typo>
            <Typo style={styles.paragraph}>
              We collect the following information when you register or use our services:
            </Typo>
            <View style={styles.list}>
              <Typo style={styles.listItem}>• Full Name, Email, and Phone Number</Typo>
              <Typo style={styles.listItem}>• UPI ID and wallet balance details</Typo>
              <Typo style={styles.listItem}>• Bet history and win/loss results</Typo>
              <Typo style={styles.listItem}>• IP address and device info</Typo>
              <Typo style={styles.listItem}>• App usage statistics</Typo>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              How We Use Your Information
            </Typo>
            <Typo style={styles.paragraph}>
              Your data helps us deliver a secure and engaging lottery experience:
            </Typo>
            <View style={styles.list}>
              <Typo style={styles.listItem}>• Process bets and declare winners</Typo>
              <Typo style={styles.listItem}>• Manage wallet and payout history</Typo>
              <Typo style={styles.listItem}>• Detect and prevent fraud or misuse</Typo>
              <Typo style={styles.listItem}>• Improve game fairness and speed</Typo>
              <Typo style={styles.listItem}>• Provide customer support</Typo>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              Data Security
            </Typo>
            <Typo style={styles.paragraph}>
              All personal and financial data is protected using end-to-end encryption. We store minimal user information and never share data with third parties without consent.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              Data Retention
            </Typo>
            <Typo style={styles.paragraph}>
              We retain user data for as long as you maintain an account with us. You may request deletion of your account and related data at any time.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              Your Rights
            </Typo>
            <Typo style={styles.paragraph}>
              You can:
            </Typo>
            <View style={styles.list}>
              <Typo style={styles.listItem}>• View or update your personal info</Typo>
              <Typo style={styles.listItem}>• Request deletion of your data</Typo>
              <Typo style={styles.listItem}>• Opt-out of marketing messages</Typo>
              <Typo style={styles.listItem}>• Contact support for privacy concerns</Typo>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={16} fontWeight="600" style={styles.sectionTitle}>
              Changes to This Policy
            </Typo>
            <Typo style={styles.paragraph}>
              We may update this Privacy Policy to reflect changes in law or our practices. You will be notified of updates through in-app alerts.
            </Typo>
          </View>

          <View style={styles.section}>

            <Typo style={styles.paragraph}>
              For privacy-related questions, contact us at help via telegram or reach out on our Telegram channel.
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
    fontStyle: "italic",
    fontSize: 14,
  },
});
