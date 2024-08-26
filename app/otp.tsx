import {
  View,
  Text,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { lazy, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import Colors from "@/constants/Colors";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";
import MaskInput from "react-native-mask-input";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;
  const { bottom } = useSafeAreaInsets();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const openLink = () => {
    Linking.openURL("https://google.com");
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      await signUp!.create({ phoneNumber });

      signUp!.preparePhoneNumberVerification();
      router.push(`/verify/${phoneNumber}`);
    } catch (err) {
      console.log(err);
      if (isClerkAPIResponseError(err)) {
        if (err.errors[0].code === "form_identifier_exists") {
          console.log("user exists");
          await trySignIn();
        } else {
          setLoading(false);
          Alert.alert("Error", err.errors[0].message);
        }
      }
    }
  };

  const trySignIn = async () => {};

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.container}>
        {loading && (
          <View style={[StyleSheet.absoluteFill, styles.loading]}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ fontSize: 18, padding: 10 }}>Sending code...</Text>
          </View>
        )}
        <Text style={styles.description}>
          WhatsApp will need to verify your account. Carrier charge may apply.
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>India</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </View>
          <View style={styles.seperator} />
          <MaskInput
            value={phoneNumber}
            autoFocus
            placeholder="+91 Your Phone Number"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(masked, unmasked) => {
              setPhoneNumber(masked);
            }}
            mask={[
              "+",
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
          />
        </View>
        <Text style={styles.legal}>
          You must be{" "}
          <Text style={styles.link} onPress={openLink}>
            at least 16 years old{" "}
          </Text>
          to register . Learn how WhatsApp works with the{" "}
          <Text style={styles.link} onPress={openLink}>
            Meta Companies
          </Text>
          .
        </Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            phoneNumber !== "" ? styles.enabled : null,
            { marginBottom: bottom },
          ]}
          onPress={sendOTP}
          disabled={phoneNumber === ""}
        >
          <Text
            style={[
              styles.buttonText,
              phoneNumber !== "" ? styles.enabled : null,
            ]}
          >
            Next
          </Text>
          {/* <Text>Send OTP</Text> */}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
  },
  list: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.primary,
  },
  seperator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
    opacity: 0.3,
  },
  legal: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    padding: 6,
    marginTop: 10,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
