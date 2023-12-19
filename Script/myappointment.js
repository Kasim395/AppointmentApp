import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { db } from "./firebase.js";
//import firebase from "firebase/compat/app";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";

const Screen1 = () => {
  const navigation = useNavigation();
  //AsyncStorage.setItem("tokenz", 'NOPE');
  const [daydate, setdaydate] = useState("Nill");
  const [tokeni, settokeni] = useState("");
  const [timing, settiming] = useState("");
  const [delid, setdelid] = useState("");
  const [reset, setreset] = useState("Nill");
  const [appoi, setappoi] = useState("");

  const fetchDataFromStorage = async () => {
    try {
      // Retrieve data from AsyncStorage
      const ddate = await AsyncStorage.getItem("tokenz");
      const toke = await AsyncStorage.getItem("slots");
      const tim = await AsyncStorage.getItem("timezz");
      const deddate = await AsyncStorage.getItem("deldate");

      // Update state if values are found in AsyncStorage
      if (toke) {
        settokeni(toke);
      }

      if (tim) {
        settiming(tim);
      }

      if (ddate) {
        setdaydate(ddate);
      }

      if (deddate) {
        setdelid(deddate);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchDataFromStorage();
  }, []);

  const [Ndata, setNdata] = useState();

 // console.log(delid);
 // console.log(tokeni);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tokeni || !delid) {
         // console.log("tokeni or toke is empty"); 
          return;
        }

        const collectionRef = collection(db, delid);
        const documentRef = doc(collectionRef, tokeni);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          const data = { id: documentSnapshot.id, ...documentSnapshot.data() };
          setNdata([data]);
        } else {
          console.log("Document does not exist!");
          setappoi("No Appointment Reserved!");
          setNdata([]); // Set empty array when document does not exist
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [tokeni, delid]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 0.19,
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
          My Reserved
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
          Appointment
        </Text>
      </View>

      <View style={{ flex: 0.02 }}></View>

      <View style={{ flex: 0.3 }}>
        <View style={styles.box}>
          <FlatList
            data={Ndata}
            vertical={true}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{ borderWidth: 4, borderColor: "black", width: 240 }}
                >
                  <Text style={styles.welcomeText}>{daydate} </Text>
                  <Text style={styles.welcomeText}>{timing}</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    try {
                      await db.collection(delid).doc(tokeni).set({
                        slot: item.slot,
                        selected: "no",
                        time: item.time,
                      });
                    } catch (error) {
                      console.error(error);
                    }

                    await AsyncStorage.setItem("tokenz", "NOPE");
                    await AsyncStorage.setItem("timezz", reset);
                    await AsyncStorage.setItem("deldate", reset);
                    await AsyncStorage.setItem("slots", reset);

                    setTimeout(() => {
                      Alert.alert(
                        "Deletion Complete",
                        "Appointment Has been Deleted!"
                      );
                    }, 200);

                    setTimeout(() => {
                      navigation.navigate("Home", {});
                    }, 2000);
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.welcomeText}>{appoi}</Text>
        </View>
      </View>

      <View style={{ flex: 0.49 }}></View>
    </SafeAreaView>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#435585",
  },
  welcomeText: {
    fontSize: 29,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    marginBottom: 12,
  },
  box: {
    width: 300,
    height: 280,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F5E8C7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
