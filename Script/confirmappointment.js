import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import { db } from "./firebase.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const Confirm = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const slotz = route.params.slot;
  const time = route.params.times;
  const daydates = route.params.daydate;
  const dates = route.params.date;
  const ffds = route.params.ffd;

  useEffect(() => {
    fetchDataFromStorage();
  }, []);

  const fetchDataFromStorage = async () => {
    try {
      const storedName = await AsyncStorage.getItem("name");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedContactNumber = await AsyncStorage.getItem("contactNumber");
      if (storedName) {
        setName(storedName);
      }

      if (storedEmail) {
        setEmail(storedEmail);
      }

      if (storedContactNumber) {
        setContactNumber(storedContactNumber);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
      }
    })();
  }, []);

  async function createAppointment(startTime, endTime) {
    // Get the default calendar source
    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Expo Calendar" };

    // Create a new calendar if it doesn't exist
    const newCalendarID = await createCalendar(defaultCalendarSource);

    console.log(`Your calendar ID is: ${newCalendarID}`);

    // Create an event
    const eventDetails = {
      title: "Vetinary Clinic Appointment",
      startDate: startTime,
      endDate: endTime,
      alarms: [{ relativeOffset: -30, method: Calendar.AlarmMethod.ALERT }],
      //AlarmMethod.Alert for notification alert
    };

    //  console.log(`Event start date: ${startTime}`);
    //  console.log(`Event end date: ${endTime}`);

    const newEventID = await Calendar.createEventAsync(
      newCalendarID,
      eventDetails
    );
    //  console.log(`Your event ID is: ${newEventID}`);
  }

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  async function createCalendar(source) {
    // Check if the calendar already exists
    const calendars = await Calendar.getCalendarsAsync();
    const existingCalendar = calendars.find(
      (calendar) => calendar.sourceId === source.id
    );

    if (existingCalendar) {
      return existingCalendar.id;
    }

    // Create a new calendar
    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Expo Calendar",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: source.id,
      source: source,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    return newCalendarID;
  }

  function convertDateTimeString(dateTimeString) {
    const dateTimeParts = dateTimeString.split(" ");

    if (dateTimeParts.length !== 3) {
      console.error("Invalid date and time format");
      return null;
    }

    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];
    const amPmPart = dateTimeParts[2];

    const dateParts = datePart.split("/");
    if (dateParts.length !== 3) {
      console.error("Invalid date format");
      return null;
    }

    const timeParts = timePart.split(":");
    if (timeParts.length !== 2) {
      console.error("Invalid time format");
      return null;
    }

    const [month, day, year] = dateParts.map(Number);
    const [hours, minutes] = timeParts.map(Number);

    // Parse AM/PM part
    const amPm = amPmPart.trim();

    let hour = hours;

    if (amPm === "PM" && hour !== 12) {
      hour += 12;
    } else if (amPm === "AM" && hour === 12) {
      hour = 0;
    }

    // Create the start date
    const startDate = new Date(year, month - 1, day, hour, minutes);

    // Create the end date by adding 30 minutes
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    return { startDate, endDate };
  }

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
          Confirm
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

      <View style={{ flex: 0.03 }}></View>

      <View style={styles.container1}>
        <View
          style={{
            alignItems: "center",
            marginBottom: 10,
            backgroundColor: "#83A2FF",
            padding: 5,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
              backgroundColor: "#FDF4DC",
              width: "100%",
              textAlign: "center",
            }}
          >
            Selected Slot Is :
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
            {daydates}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
            {time}
          </Text>
        </View>

        <View style={{ backgroundColor: "#FDF4DC", padding: 20 }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={(text) => setContactNumber(text)}
            keyboardType="phone-pad"
          />
          <Button
            title="Confirm"
            onPress={async () => {
              const calendardt = `${dates} ${time}`;
              // console.log(calendardt);
              // console.log(time);
              const { startDate, endDate } = convertDateTimeString(calendardt);

              // not required code is below
              const startDateString = `${startDate.getFullYear()}, ${startDate.getMonth()}, ${startDate.getDate()}, ${startDate.getHours()}, ${startDate.getMinutes()}`;
              //  const endDateString = `${endDate.getFullYear()}, ${endDate.getMonth()}, ${endDate.getDate()}, ${endDate.getHours()}, ${endDate.getMinutes()}`;

              console.log(`startDate: ${startDateString}`);
              //  console.log(`endDate: ${endDateString}`);

              const p1 = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                startDate.getHours(),
                startDate.getMinutes()
              );
              const p2 = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                endDate.getHours(),
                endDate.getMinutes()
              );

              //  console.log(p1);
              // console.log(p2);

              createAppointment(p1, p2);

              try {
                await db.collection(ffds).doc(slotz).set({
                  slot: slotz,
                  selected: "yes",
                  time: time,
                  name: name,
                  email: email,
                  contact: contactNumber,
                  ddate: daydates,
                });
              } catch (error) {
                console.error(error);
              }

              await AsyncStorage.setItem("name", name);
              await AsyncStorage.setItem("email", email);
              await AsyncStorage.setItem("contactNumber", contactNumber);
              await AsyncStorage.setItem("tokenz", daydates);
              await AsyncStorage.setItem("timezz", time);
              await AsyncStorage.setItem("deldate", ffds);
              await AsyncStorage.setItem("slots", slotz);

              setTimeout(() => {
                Alert.alert(
                  "Appointment Confirmed",
                  "Appointment Has Been Confirmed & Added In Your Calendar!"
                );
              }, 200);

              setTimeout(() => {
                navigation.navigate("Home", {});
              }, 2000);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#435585",
  },
  container1: {
    flex: 0.78,
    // justifyContent: "center",
    paddingHorizontal: 20,
  },

  input: {
    height: 40,
    borderColor: "blue",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "white",
  },
});
