
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { db } from "./firebase.js";
//import firebase from "firebase/compat/app";
import {
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Appointment = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [tokeni, settokeni] = useState("");
  const [timing, settiming] = useState("");
  const [delid, setdelid] = useState("");

  const fetchDataFromStorage = async () => {
    try {
      // Retrieve data from AsyncStorage
      const toke = await AsyncStorage.getItem("tokenz");
      const tim = await AsyncStorage.getItem("timezz");
      const deddate = await AsyncStorage.getItem("deldate");

      // Update state if values are found in AsyncStorage
      if (toke) {
        settokeni(toke);
      }

      if (tim) {
        settiming(tim);
      }

      if (deddate) {
        setdelid(deddate);
      }
    } catch (error) {
      // console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchDataFromStorage();
  }, []);

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDay, setFormattedDay] = useState("");
  const [ndata, setndata] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedFirestoreDate, setFormattedFirestoreDate] = useState("aaa");

  //calendar code starts here

  //  endDate: new Date(2023, 10, 3, 10, 30),

  useEffect(() => {
    const fetchData = async () => {
      setFormattedDate(currentDate.toLocaleDateString());
      setFormattedDay(
        currentDate.toLocaleDateString("en-US", { weekday: "long" })
      );

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedFirestoreDate = `${day},${month},${year}`;
      setFormattedFirestoreDate(formattedFirestoreDate);

      const checkAndCreateCollection = async () => {
        const collectionRef = collection(db, formattedFirestoreDate);
        const collectionDocs = await getDocs(collectionRef);

        if (collectionDocs.empty) {
          for (let i = 1; i <= 24; i++) {
            const startTime = 9 + Math.floor((i - 1) / 2);
            const startMinutes = i % 2 === 1 ? "00" : "30";
            const isAM = startTime < 12;
            const formattedStartTime =
              startTime > 12 ? startTime - 12 : startTime;
            const formattedEndTime = isAM ? "AM" : "PM";
            const timeSlot = `${formattedStartTime}:${startMinutes} ${formattedEndTime}`;

            // Check if the current day is Saturday or Sunday
            const isWeekend =
              currentDate.getDay() === 0 /* Sunday */ ||
              currentDate.getDay() === 6; /* Saturday */

            // Set the value to "nope" for the 10th iteration
            const selectedValue = i === 10 ? "yes" : isWeekend ? "yes" : "no";

            await setDoc(doc(collectionRef, i.toString()), {
              slot: i.toString(),
              selected: selectedValue,
              time: timeSlot,
            });
          }
        }
      };

      checkAndCreateCollection();

      const unsub = onSnapshot(
        collection(db, formattedFirestoreDate),
        (snapshot) => {
          const sortedData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.slot - b.slot);

          setndata(sortedData);
        }
      );
    };

    fetchData();
  }, [currentDate]);

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const goBackDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };

  const image = require("./Images//b1.png");
  const image2 = require("./Images//b2.png");

  const [f1Date, setF1Date] = useState("hehe");
  const [f2Date, setF2Date] = useState("hehe");
  const [f3Date, setF3Date] = useState("hehe");
  const [f4Date, setF4Date] = useState("hehe");

  useEffect(() => {
    // previousDay.setDate(currentDate.getDate() - 1);
    const day = currentDate.getDate() - 1;
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const year = currentDate.getFullYear();
    const currydate = `${day},${month},${year}`;
    setF1Date(currydate);

    const day2 = currentDate.getDate() - 2;
    const month2 = currentDate.getMonth() + 1; // Month is zero-based
    const year2 = currentDate.getFullYear();
    const currydate2 = `${day2},${month2},${year2}`;
    setF2Date(currydate2);

    const day3 = currentDate.getDate() - 3;
    const month3 = currentDate.getMonth() + 1; // Month is zero-based
    const year3 = currentDate.getFullYear();
    const currydate3 = `${day3},${month3},${year3}`;
    setF3Date(currydate3);

    const day4 = currentDate.getDate() - 4;
    const month4 = currentDate.getMonth() + 1; // Month is zero-based
    const year4 = currentDate.getFullYear();
    const currydate4 = `${day4},${month4},${year4}`;
    setF4Date(currydate4);
  }, []);

  //console.log(f1Date)

  const [dd1] = useState("NOPE");
  const [dd2] = useState("NOPE");
  const [testing] = useState("21,11,2023");
  const [testing1] = useState("2,11,2023");

  /*
  useEffect(() => {

    if (f1Date === delid) {
      AsyncStorage.setItem("tokenz", dd1);
      AsyncStorage.setItem("deldate", dd2);
    }

  }, [f1Date,delid]);

  */

  //console.log(f1Date)
  // console.log(delid)

  useEffect(() => {
    const deleteCollection = async () => {
      if (f1Date) {
        const collectionRef = collection(db, f1Date); // Replace with your actual collection name
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        //  console.log(`Collection ${f1Date} deleted.`);
      }

      if (f2Date) {
        const collectionRef = collection(db, f2Date); // Replace with your actual collection name
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        //  console.log(`Collection ${f1Date} deleted.`);
      }

      if (f3Date) {
        const collectionRef = collection(db, f3Date); // Replace with your actual collection name
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        //  console.log(`Collection ${f1Date} deleted.`);
      }

      if (f4Date) {
        const collectionRef = collection(db, f4Date); // Replace with your actual collection name
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        //  console.log(`Collection ${f1Date} deleted.`);
      } else {
        // console.log(`f1Date does not exist.`);
      }
    };

    deleteCollection();
  }, [f1Date, f2Date, f3Date, f4Date]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 0.14,
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
            fontSize: 20,
            padding: 6,
            backgroundColor: "#B4BDFF",
            borderRadius: 35,
            textAlign: "center",
            width: 260,
          }}
        >
          Select
        </Text>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 20,
            padding: 6,
            backgroundColor: "#83A2FF",
            borderRadius: 35,
            textAlign: "center",
            width: 260,
            alignSelf: "flex-end",
          }}
        >
          The Slot
        </Text>
      </View>

      <View>
        {/*
        <Text>
          {tokeni} ,,,  {testing} = = = {delid}
       </Text>       */}
      </View>

      <View
        style={{
          flex: 0.08,
          backgroundColor: "gold",
          width: "100%",
          marginBottom: 7,
        }}
      >
        <View style={styles.rowz}>
          <View style={styles.sideRectangle}>
            <ImageBackground source={image} resizeMode="contain">
              <TouchableOpacity onPress={goBackDay}>
                <View style={{ height: 55, width: 59 }}></View>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.middleRectangle}>
            <Text style={styles.dayText}>{formattedDay}</Text>
          </View>

          <View style={styles.sideRectangle}>
            <ImageBackground source={image2} resizeMode="contain">
              <TouchableOpacity onPress={goToNextDay}>
                <View style={{ height: 55, width: 59 }}></View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </View>

      <View style={styles.fullWidthSquare}>
        <View style={styles.row}>
          <FlatList
            data={ndata}
            vertical={true}
            numColumns={4}
            renderItem={({ item }) => {
              const isItemSelected = item.selected === "yes";
              const isSameDayAndTime =
                tokeni === formattedDay && timing === item.time;
              //const [isDisabled, setDisabled] = useState("");
              var disabling = true;
              if (tokeni != null) {
                disabling = true;
              }

              if (tokeni === "NOPE") {
                disabling = false;
              }

              if (item.selected === "yes") {
                disabling = true;
              }

              // if()
              //const isDisabled = true;

              return (
                <TouchableOpacity
                  onPress={async () => {
                    if (isItemSelected) {
                      //  console.log("This item is already selected.");
                      return;
                    }

                    const abcd = formattedFirestoreDate;

                    setTimeout(() => {
                      navigation.navigate("Confirm", {
                        slot: item.id,
                        times: item.time,
                        daydate: formattedDay,
                        date: formattedDate,
                        ffd: abcd,
                      });
                    }, 300);
                  }}
                  disabled={disabling}
                >
                  <View
                    style={[
                      styles.smallRectangle,
                      isItemSelected && { backgroundColor: "purple" },
                      isSameDayAndTime && { backgroundColor: "green" }, // You can use a different color for this case
                    ]}
                  >
                    <Text style={styles.timetext}>Slot: {item.slot} </Text>
                    <Text style={styles.timetext}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <View style={{ flex: 0.13 }}></View>
    </SafeAreaView>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#435585",
    justifyContent: "center",
    alignItems: "center",
  },

  fullWidthSquare: {
    backgroundColor: "black",
    width: "100%",
    //aspectRatio: 1.3, // To make it a square
    flex: 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  smallRectangle: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 68,
    backgroundColor: "#87CEEB",
    margin: 3,
    marginLeft: 13,
    marginBottom: 6,
    borderRadius: 12,
  },

  timetext: {
    fontSize: 14,
    fontWeight: "bold",
  },

  rowz: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sideRectangle: {
    flex: 0.17,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    // backgroundImage: url("./b1.png"), // Replace "b1.png" with the actual image path
  },

  middleRectangle: {
    flex: 0.66,
    backgroundColor: "blue",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
  },
  dayText: {
    fontSize: 22,
    color: "white",
  },
});
