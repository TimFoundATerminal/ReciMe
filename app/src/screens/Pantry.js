// import React from "react";
// import { Text } from "react-native";

// export default function Pantry() {
//   return <Text>Test Content</Text>;
// }

import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, FlatList } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

//Navigation import
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// MAIN PAGE
const Main = (props) => {

  // LIST FOODS IN PANTRY
  // let foodListView = (item) => {
  //   <View key={item.FOODVAR} style={{ backgroundColor: "#98DC14", padding: 20, margin: 20 }}>
  //     <Text>{item.QUANTITYVAR} {item.FOODVAR}</Text>
  //   </View>
  // }

  // VARIABLES TO STORE PANTRY DATA
  let [flatListItems, setFlatListItems] = React.useState([]);

  // FOR LOOP TO GET ALL FOOD ITEMS IN PANTRY
  // code here

  // NAVIGATION FUNCTIONS
  const onPressChoose = () => {
    props.navigation.navigate('BarcodeOrManual');
  }

  return (
    <View style={{ paddingHorizontal: 20, flex: 1, alignItems: 'center' }}>
     
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginTop: 51, marginRight: 6, fontSize: 27, fontWeight: 600 }}>Pantry</Text>
        {/* NAVIGATION BUTTONS */}
        <Pressable onPress={onPressChoose} style={styles.pantryButton}>
          <Text style={{ fontSize: 15, color: 'white' }}>Add Food</Text>
        </Pressable>
      </View>

      <View
        style={{
          marginTop: 12,
          height: 3,
          width: '100%',
          backgroundColor: '#98DC14'
        }}
      />

      {/* FOOD LIST
      <FlatList
        data={flatListItems}
        keyExtractor={(item, index) => index.toString()} // Extracts a unique key for a given item at specified index
        renderItem={({ item }) => foodListView(item)}
      /> */}

    </View>
  )

}

// CHOOSE BETWEEN ADDING FOOD MANUALLY OR USING BARCODE
const BarcodeOrManual = (props) => {

  // NAVIGATION FUNCTIONS
  const onPressDropdown = () => {
    props.navigation.navigate('AddFood');
  }

  const onPressBarcode = () => {
    props.navigation.navigate('Barcode');
  }

  const onPressBack = () => {
    props.navigation.navigate('Main');
  }

  return (
    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      {/* NAVIGATION BUTTONS */}
      <Pressable onPress={onPressBarcode} style={styles.button}>
        <Text style={{ fontSize: 15, color: 'white' }}>Use Barcode Scanner</Text>
      </Pressable>
      <Pressable onPress={onPressDropdown} style={styles.button}>
        <Text style={{ fontSize: 15, color: 'white' }}>Manually Enter Food</Text>
      </Pressable>
      <Pressable onPress={onPressBack} style={styles.button}>
        <Text style={{ fontSize: 15, color: 'white' }}>BACK</Text>
      </Pressable>

    </View>
  )
}

// MANUALLY ADD FOOD
const AddFood = (props) => {

  // DROPDOWN MENU CONST
  const [selected, setSelected] = React.useState("");

  // QUANTITY CONST
  const [quantity, setQuantity] = React.useState("");
  const [metric, setMetric] = React.useState("");

  // DATE CONST
  const [day, setDay] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  // DROPDOWN MENU DATA
  const data = [
    {key:'Test1',value:'Test1'},
    {key:'Test2',value:'Test2'},
    {key:'Test3',value:'Test3'},
  ]

  const metricData = [
    {key:'ml',value:'ml'},
    {key:'g',value:'g'},
    {key:'litres',value:'litres'},
  ]

  const dayData = [
    {key:'1',value:'01'},
  ]

  const monthData = [
    {key:'1',value:'01'},
  ]

  const yearData = [
    {key:'2023',value:'2023'},
  ]

  const onPressBack = () => {
    props.navigation.navigate('BarcodeOrManual');
  }

  // VALIDATION AND PASS DATA TO DATABASE
  const showAlert = () => {
    if (selected && quantity && metric && day && month && year) {

      Alert.alert (
        "Food entered successfully"
      );

      // ADD TO DATABASE

    } else {

      Alert.alert (
        "Please fill in all the fields"
      );

    }
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 50, flex: 1, justifyContent: 'center' }}>

      {/* DROPDOWN MENU FOR FOOD */}
      <SelectList
        data={data}
        // onSelect={() => alert(selected)}
        // setSelected={setSelected}
        setSelected={(val) => setSelected(val)}
        dropdownItemStyles={{marginHorizontal:10}}
        dropdownTextStyles={{color:'black'}}
        searchPlaceholder="Enter item"
        placeholder="Enter item"
        inputStyles={{color:'darkgrey'}}
        maxHeight={100}
      />

      {/* FOOD QUANTITY */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 500 }}>Quantity:</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          onChangeText={setQuantity}
          value={quantity}
          keyboardType="numeric"
        />
        <SelectList
          data={metricData}
          // onSelect={() => alert(selected)}
          // setSelected={setSelected}
          setSelected={(val) => setMetric(val)}
          dropdownItemStyles={{ marginHorizontal:10 }}
          dropdownTextStyles={{ color:'black' }}
          searchPlaceholder="(ml, g, etc.)"
          placeholder="Enter metric"
          inputStyles={{color:'darkgrey'}}
          maxHeight={100}
        />
      </View>

      {/* DATE */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 500 }}>Use by date:</Text>
      <View style={{ flexDirection: "row" }}>
        <SelectList
          data={dayData}
          // onSelect={() => alert(selected)}
          // setSelected={setSelected}
          setSelected={(val) => setDay(val)}
          dropdownItemStyles={{marginHorizontal:10}}
          dropdownTextStyles={{color:'black'}}
          placeholder=" "
          maxHeight={100}
        />
        <Text style={{ alignSelf: 'center', marginHorizontal: 6 }}>DD /</Text>
        <SelectList
          data={monthData}
          // onSelect={() => alert(selected)}
          // setSelected={setSelected}
          setSelected={(val) => setMonth(val)}
          dropdownItemStyles={{marginHorizontal:10}}
          dropdownTextStyles={{color:'black'}}
          placeholder=" "
          maxHeight={100}
        />
        <Text style={{ alignSelf: 'center', marginHorizontal: 6 }}>MM /</Text>
        <SelectList
          data={yearData}
          // onSelect={() => alert(selected)}
          // setSelected={setSelected}
          setSelected={(val) => setYear(val)}
          dropdownItemStyles={{marginHorizontal:10}}
          dropdownTextStyles={{color:'black'}}
          placeholder=" "
          maxHeight={100}
        />
        <Text style={{ alignSelf: 'center', marginHorizontal: 6 }}>YY</Text>
      </View>

      <Pressable onPress={showAlert} style={styles.button}>
        <Text style={{ fontSize: 15, color: 'white' }}>Add Item</Text>
      </Pressable>

      <Pressable onPress={onPressBack} style={styles.button}>
        <Text style={{ fontSize: 15, color: 'white' }}>BACK</Text>
      </Pressable>

    </View>
  )

  // VARIABLE STORES:
  // selected -> Food dropdown menu selection
  // quantity -> Quantity of food
  // metric -> The relevant metric for the quantity of food
  // day, month, year -> Use by date

}

const Pantry = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >

        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="AddFood" component={AddFood} />
        <Stack.Screen name="BarcodeOrManual" component={BarcodeOrManual} />

      </Stack.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pantryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 9,
    backgroundColor: "#056835",
    marginTop: 48,
    marginLeft: 6,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 9,
    backgroundColor: "#056835",
    flexDirection: "row",
    marginVertical: 6,
    alignSelf: 'stretch',
  },

  input: {
    height: 45,
    borderWidth: 0.5,
    padding: 10,
    minWidth: 60,
    marginRight: 12,
    borderRadius: 9,
  },

  // bottomButton: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 12,
  //   paddingHorizontal: 32,
  //   backgroundColor: "#056835",
  //   bottom: 0,
  // }

});

export default Pantry
