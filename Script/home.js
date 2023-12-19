import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  FlatList,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { db } from "./firebase.js";
//import firebase from "firebase/compat/app";
import {
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const Home = () => {
  const navigation = useNavigation();

  const [delid, setdelid] = useState("");

  const fetchDataFromStorage = async () => {
    try {
      // Retrieve data from AsyncStorage
      let toke = await AsyncStorage.getItem("tokenz");
      const deddate = await AsyncStorage.getItem("deldate");
      // Check if tokeni doesn't exist and set it to "NOPE"
      if (!toke) {
        toke = "NOPE";
        await AsyncStorage.setItem("tokenz", toke);
      }

      if (deddate) {
        setdelid(deddate);
      }
    } catch (error) {
      //console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchDataFromStorage();
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [f1Date, setF1Date] = useState("hehe");

  useEffect(() => {
    // previousDay.setDate(currentDate.getDate() - 1);
    const day = currentDate.getDate() - 1;
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const year = currentDate.getFullYear();
    const currydate = `${day},${month},${year}`;
    setF1Date(currydate);
  }, []);

  const [dd1] = useState("NOPE");
  const [dd2] = useState("NOPE");

  useEffect(() => {
    if (f1Date === delid) {
      AsyncStorage.setItem("tokenz", dd1);
      AsyncStorage.setItem("deldate", dd2);
      //  console.log("true");
    } else {
      //  console.log("false");
    }
  }, [f1Date, delid]);

  useEffect(() => {
    const checkInternetConnection = async () => {
      try {
        const response = await fetch("https://www.google.com", {
          method: "HEAD",
        });
        if (!response.ok) {
          // No internet connection, handle accordingly
          Alert.alert("No Internet", "App Requires A Internet Connection!");
          // console.log('No internet connection! Enable Internet.');
          return false;
        }

        return true;
      } catch (error) {
        // Handle other errors
        //  console.error('Error checking internet connection:', error.message);
        Alert.alert("No Internet", "App Requires A Internet Connection!");
        return false;
      }
    };

    const checkIfCollectionExists = async () => {
      try {
        // Check internet connectivity
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          Alert.alert("No Internet", "App Requires A Internet Connection!");
          // No internet connection, handle accordingly
          return;
        }

        const collectionRef = collection(db, delid);

        // Get a snapshot of the collection
        const collectionDocs = await getDocs(collectionRef);

        if (collectionDocs.empty) {
          // Collection does not exist
          const toke = "NOPE";
          await AsyncStorage.setItem("tokenz", toke);
          //   console.log('Collection does not exist.');
        } else {
          // Collection exists
          //console.log('Collection exists.');
        }
      } catch (error) {
        // Handle other errors
        //console.error('Error checking collection existence:', error.message);
      }
    };

    checkIfCollectionExists();
  }, [delid]);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate a 3-second delay
      await new Promise((resolve) => setTimeout(resolve, 4000));

      let unsub;
      try {
        const q = query(collection(db, "cards"), orderBy("num", "asc"));
        unsub = onSnapshot(q, (snapshot) => {
          setData(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });
      } catch (error) {
        // console.error('Error fetching data:', error.message);
      } finally {
        // After fetching data, set loading to false
        setLoading(false);
      }
    };

    fetchData();
    // Clean up the subscription when the component unmounts
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = "923104768593";
    const message = "Hello!";

    // Use the WhatsApp URL scheme
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(whatsappUrl)
      .then(() => {
        // console.log(`Opening WhatsApp with number ${phoneNumber}`);
      })
      .catch((err) => console.error("Error opening WhatsApp", err));
  };

  const image = require("./Images/whatsapp.png");

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.89 }}>
        <View
          style={{
            flex: 0.23,
            justifyContent: "center",
            backgroundColor: "#363062",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontStyle: "italic",
              marginBottom: 7,
              fontWeight: "bold",
              fontSize: 28,
              padding: 9,
              backgroundColor: "#B4BDFF",
              borderRadius: 35,
              textAlign: "center",
              width: 260,
            }}
          >
            🐾 Paw Club
          </Text>
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 28,
              padding: 9,
              backgroundColor: "#83A2FF",
              borderRadius: 35,
              textAlign: "center",
              width: 260,
              alignSelf: "flex-end",
            }}
          >
            Veterinary Clinic
          </Text>
        </View>

        <View style={{ flex: 0.54 }}>
          <View style={{ height: 435, justifyContent: "center" }}>
            {loading ? (
              <ActivityIndicator size="large" color="yellow" />
            ) : (
              <FlatList
                data={data}
                horizontal={true}
                renderItem={({ item }) => (
                  <View style={styles.cardContainer}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />

                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </View>

      <View
        style={{ flex: 0.21, flexDirection: "row", justifyContent: "center" }}
      >
        <TouchableOpacity
          style={[styles.fancyButton1, { flex: 0.42 }]}
          onPress={() => navigation.navigate("Appointment")}
        >
          <Text style={styles.buttonText}>Schedule </Text>
          <Text style={styles.buttonText}>Appointment</Text>
        </TouchableOpacity>

        <View style={styles.callButtonContainer}>
          <TouchableOpacity
            style={[styles.callButton]}
            onPress={() => {
              openWhatsApp();
            }}
          >
            <Image style={{ height: 65, width: 50 }} source={image} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.fancyButton, { flex: 0.42 }]}
          onPress={() => navigation.navigate("Screen1")}
        >
          <Text style={styles.buttonText}>My </Text>
          <Text style={styles.buttonText}>Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#435585",
  },
  welcomeText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  fancyButton: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
    marginLeft: 11,
    borderRadius: 10, // Adjust as needed
    borderBottomLeftRadius: 30,
    borderColor: "white",
    borderWidth: 2,
  },

  fancyButton1: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
    marginRight: 11,
    borderRadius: 10, // Adjust as needed
    borderColor: "white",
    borderWidth: 2,

    borderBottomRightRadius: 30,
  },

  buttonText1: {
    fontSize: 19,
    fontWeight: "bold",
  },

  buttonText: {
    fontSize: 19,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
    color: "white",
  },

  callButton: {
    backgroundColor: "#34D878",

    borderTopRightRadius: 10, // Adjust the radius to create the circular part
    borderTopLeftRadius: 10,
    height: 136,
    justifyContent: "center",
  },

  cardContainer: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)", // Black with 0.7 opacity
    overflow: "hidden",
    margin: 18,
    width: 285,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 15,
      height: 25,
    },
    shadowOpacity: 0.7,
    shadowRadius: 17,
    elevation: 16,
  },

  callButtonContainer: {
    flex: 0.12,

    alignItems: "center",
    justifyContent: "flex-end", // Align the button at the bottom
  },
  cardImage: {
    height: 255,
    width: "100%",
  },
  textContainer: {
    padding: 15,
    backgroundColor: "#fff",
    height: 187,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
