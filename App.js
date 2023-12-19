import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';;
import Home from './Script/home.js';
import Screen1 from './Script/myappointment.js';
import Appointment from './Script/bookappointment.js';
import Confirm from './Script/confirmappointment.js';
import * as Updates from 'expo-updates';
import { useState, useEffect } from "react";

const Stack = createNativeStackNavigator();

function App() {

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
    }
  }

  useEffect(() => {
 
    onFetchUpdateAsync()

  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown:false, animation: 'none'}}  />
      <Stack.Screen name="Screen1" component={Screen1} options={{ headerShown:false, animation:'none'}}  />
      <Stack.Screen name="Appointment" component={Appointment} options={{ headerShown:false, animation:'none'}}  />
      <Stack.Screen name="Confirm" component={Confirm} options={{ headerShown:false, animation:'none'}}  />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;