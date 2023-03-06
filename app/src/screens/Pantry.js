import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

//Navigation import
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// MAIN PAGE
class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
        dataSource: [],
    };
  }

  // HTTPS REQUEST (FETCH)
  goForFetch = () => {
      fetch('http://172.20.10.2:3000/api/pantry', {
        method: 'GET'
      })
      .then(response => response.json())
      .then((responseJson) => {
          console.log('getting data from fetch', responseJson)
          this.setState({
              dataSource: responseJson
          })
      })
      .catch(error => console.log(error))
  }

  // FLATLIST SEPARATOR
  FlatListSeparator = () => {
      return (
          <View style={{
              height: .5,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
          }}
          />
      );
  }
  

  // UI COMPONENT FOR EACH FOOD ITEM
  render() {

      const Item = ({ name, quantity, standardUnit }) => (
        <View style={{ paddingVertical: 4, margin: 5, backgroundColor: "#fff" }}>
          <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>{name}</Text>
          <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Quantity: {quantity} {standardUnit}</Text>
        </View>
      );
      
      const renderItem = ({ item }) => (
        <Item name={item.name} quantity={item.quantity} standardUnit={item.standardUnit} />
      );

      // NAVIGATION FUNCTIONS
      const onPressChoose = () => {
        this.props.navigation.navigate('BarcodeOrManual');
      }

      // DESTRUCTURE STATE <- so don't have to repeat certain syntax (ex: this.state)
      const { dataSource } = this.state

      return (
          <View style={{ justifyContent: 'center' }}>

              <FlatList
                ListHeaderComponent={
                <>
                  <Pressable onPress={onPressChoose} style={styles.pantryButton}>
                      <Text style={{ fontSize: 15, color: 'white' }}>Add Food</Text>
                  </Pressable>

                  <View
                    style={{
                      marginTop: 12,
                      height: 3,
                      width: '80%',
                      alignSelf: 'center',
                      backgroundColor: '#98DC14'
                    }}
                  />

                  <View style={{ margin: 6 }}>
                      <Pressable onPress={this.goForFetch} color='#056835' style={styles.button}>
                          <Text style={{ fontSize: 15, color: 'white' }}>Click to see your pantry</Text>
                      </Pressable>
                  </View>
                </>}

                data={dataSource}
                ItemSeparatorComponent={this.FlatListSeparator}
                renderItem={renderItem}
                keyExtractor={item => item.ingredientID}
              />
              
              {/* LOADING UI WHILST FETCHING */}
              {/* {loading &&
                  <View style={styles.loader}>
                      <ActivityIndicator size="large" color="#0c9" />
                      <Text>Fetching Data</Text>
                  </View>
              } */}
        
          </View>
      )
  }

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

  // const initialState = [
  //   {key: "", standardUnit: ""},
  // ]
  // DROPDOWN MENU CONST (1 - for dropdown menu, 2 - for API call, 3 - for getting the standard unit)
  const [getSelected, setSelected] = React.useState("");
  const [ingredientData, setData] = React.useState([]);
  const [getStandardUnit, setStandardUnit] = React.useState([]);
  const temp = [];

  // QUANTITY CONST
  const [getQuantity, setQuantity] = React.useState("");

  // DATE CONST
  const [getDay, setDay] = React.useState("");
  const [getMonth, setMonth] = React.useState("");
  const [getYear, setYear] = React.useState("");

  // DROPDOWN MENU DATA
  React.useEffect(() => {
    //(async () => {
    try {
      fetch('http://172.20.10.2:3000/api/ingredients', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then((responseJson) => {
        //console.log('getting data from fetch (dropdown)')
        //console.log(responseJson)
        // Store values in temporary array (newArray)
        let newArray = responseJson.map((item) => {
          return {key: item.ingredientID, value: item.name}
        })
        let newArraySU = responseJson.map((item) => {
          return {key: item.ingredientID, standardUnit: item.standardUnit}
        })
        // Set data variable
        setStandardUnit(newArraySU)
        setData(newArray)
        console.log(getStandardUnit)
      })
    }
    catch (error) {
      console.log(error)
    }
    //})
  },[])

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

  const concatDate = getDay + getMonth + getYear

  // ASYNC COMPONENT TO POST DATA TO API  
  const storeData = async () => {
    try {
      await fetch('http://172.20.10.2:3000/api/pantry', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredientID: {getSelected},
          quantity: {getQuantity},
          dateExpiry: {concatDate},
          frozen: 1
        })
      })
      .then(response => response.json())
      .then(responseJson => console.log(responseJson))
    }
    catch (error) {
      console.log(error)
    }
  }

  // VALIDATION AND PASS DATA TO DATABASE
  const showAlert = () => {
    if (getSelected && getQuantity && getDay && getMonth && getYear) {

      Alert.alert (
        "Food entered successfully"
      );

      storeData();

    } else {

      Alert.alert (
        "Please fill in all the fields"
      );

    }
  }

  var index = getStandardUnit.findIndex(function(item) {
    return item.key == getSelected
  });

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 50, flex: 1, justifyContent: 'center' }}>

      {/* DROPDOWN MENU FOR FOOD */}
      <SelectList
        data={ingredientData}
        // onSelect={() => alert(selected)}
        // setSelected={setSelected}
        setSelected={setSelected}
        dropdownItemStyles={{marginHorizontal:10}}
        dropdownTextStyles={{color:'black'}}
        searchPlaceholder="Enter item"
        placeholder="Enter item"
        maxHeight={100}
      />

      {/* FOOD QUANTITY */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 'bold' }}>Quantity:</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          onChangeText={setQuantity}
          value={getQuantity}
          keyboardType="numeric"
        />
        <Text>{index}</Text>
        {/* <Text style={{ marginTop: 15 }}>{getStandardUnit[index].standardUnit}</Text> */}
      </View>

      {/* DATE */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 'bold' }}>Use by date:</Text>
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >

      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="AddFood" component={AddFood} />
      <Stack.Screen name="BarcodeOrManual" component={BarcodeOrManual} />

    </Stack.Navigator>
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
    marginTop: 12,
    marginHorizontal: 6,
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