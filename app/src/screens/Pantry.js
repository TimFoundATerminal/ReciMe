import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

import * as Constants from '../Constants';

import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';

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

  //HTTPS REQUEST (FETCH)
  goForFetch = () => {
      fetch(Constants.API_FIXED_URL + 'pantry', {
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

  //REMOVE ITEM FUNCTIONALITY
  removeItem = (itemToDelete) => {
    fetch(Constants.API_FIXED_URL + 'pantry' + '/' + itemToDelete, {
        method: 'DELETE'
    })
    .then(response => response.json())
      .then((responseJson) => {
          console.log('getting data from fetch', responseJson)
      })
    .catch(error => console.log(error))
  }

  deleteItemByID = (itemToDelete) => {
    const filteredData = this.state.dataSource.filter(item => item.itemID != itemToDelete);
    this.setState({ dataSource: filteredData });
    this.removeItem(itemToDelete);
  }

  // UPDATE WHETHER ITEM IS FROZEN OR NOT
  updateItem = (itemToUpdate, getIngredientID, getQuantity, getDateExpiry, freezeValue) => {

    const putURL = Constants.API_FIXED_URL + 'pantry' + '/' + itemToUpdate;

    fetch(putURL, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredientID: getIngredientID,
        quantity: getQuantity,
        dateExpiry: getDateExpiry,
        frozen: freezeValue
      }),
    })
    .then(response => response.json())
    .then((responseJson) => {
        console.log('getting data from fetch', responseJson)
        this.goForFetch()
    })
    .catch(error => console.log(error))
  }

  // UI COMPONENT FOR EACH FOOD ITEM
  render() {

      const Item = ({ name, quantity, standardUnit, itemID, frozen, ingredientID, dateExpiry }) => {

        let frozenButton;
        let updatedExpiry;
        if (frozen) {
          updatedExpiry = <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Frozen</Text>
          frozenButton = <Text style={{ fontSize: 15, color: 'white' }}>Unfreeze</Text>
          frozen = 0;
        } else {
          updatedExpiry = <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Use by Date: {dateExpiry.toString().slice(0,4)}/{dateExpiry.toString().slice(4,6)}/{dateExpiry.toString().slice(6)}</Text>
          frozenButton = <Text style={{ fontSize: 15, color: 'white' }}>Freeze</Text>
          frozen = 1;
        }

        return (
          <View style={{ paddingVertical: 4, margin: 5, backgroundColor: "#fff" }}>
            <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>{name}</Text>
            <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Quantity: {quantity} {standardUnit}</Text>
            {updatedExpiry}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Pressable onPress={() => this.deleteItemByID(itemID)} color='#056835' style={styles.button}>
                  <Text style={{ fontSize: 15, color: 'white' }}>-</Text>
              </Pressable>
              <Pressable onPress={() => this.updateItem(itemID, ingredientID, quantity, dateExpiry, frozen)} color='#056835' style={styles.button}>
                {frozenButton}
              </Pressable>
            </View>
          </View>
        )
      };
      
      const renderItem = ({ item }) => (
        <Item name={item.name} quantity={item.quantity} standardUnit={item.standardUnit} itemID={item.itemID} frozen={item.frozen} ingredientID={item.ingredientID} dateExpiry={item.dateExpiry} />
      );

      // NAVIGATION FUNCTIONS
      const onPressChoose = () => {
        this.props.navigation.navigate('AddFood');
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
                          <Text style={{ fontSize: 15, color: 'white' }}>Click to refresh your pantry</Text>
                      </Pressable>
                  </View>
                </>}

                data={dataSource}
                ItemSeparatorComponent={this.FlatListSeparator}
                renderItem={renderItem}
                keyExtractor={item => item.itemID}

              />
              
              {/* LOADING UI WHILST FETCHING */}
              {/* {loading &&
                  <View style={styles.loader}>
                      <ActivityIndicator size="large" color="#056835" />
                      <Text>Fetching Data</Text>
                  </View>
              } */}
        
          </View>
      )
  }

}

// MANUALLY ADD FOOD
const AddFood = (props) => {

  const today = new Date();

  const startDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState('')

  // OPENS UP CALENDAR
  function handleOnPress () {
    setOpen(!open)
  }

  function handleChange (propDate) {
    setDate(propDate)
  }

  // DROPDOWN MENU CONST (1 - for dropdown menu, 2 - for API call, 3 - for getting the standard unit)
  const [getSelected, setSelected] = React.useState("");
  const [ingredientData, setData] = React.useState([]);
  const [SUData, setSUData] = React.useState("");

  // QUANTITY CONST
  const [getQuantity, setQuantity] = React.useState("");

  // DROPDOWN MENU DATA
  React.useEffect(() => {
    //(async () => {
    try {
      fetch(Constants.API_FIXED_URL + 'ingredients', {
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
        // Set data variable
        setData(newArray)
      })
    }
    catch (error) {
      console.log(error)
    }
    //})
  },[])

  const onPressBack = () => {
    props.navigation.navigate('Main');
  }

  const concatDate = date.slice(0,4) + date.slice(5,7) + date.slice(8);

  // ASYNC COMPONENT TO POST DATA TO API  
  const storeData = async () => {
    try {
      await fetch(Constants.API_FIXED_URL + 'pantry', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredientID: getSelected,
          quantity: getQuantity,
          dateExpiry: concatDate,
          frozen: 0
        })
      })
      .then(response => response.json())
      .then(responseJson => console.log(responseJson))
    }
    catch (error) {
      console.log(error)
    }
  }

  const ingredientURL = Constants.API_FIXED_URL + 'ingredients' + '/' + getSelected;

  //ASYNC COMPONENT TO GET CORRESPONDING STANDARD UNIT FOR ID
  const getStandardUnit = async () => {
    try {
      await fetch(ingredientURL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then((responseJson) => {
        setSUData(responseJson.standardUnit)
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  // VALIDATION AND PASS DATA TO DATABASE
  const showAlert = () => {
    if (getSelected && getQuantity && date) {

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

  return (

    <View style={{ paddingHorizontal: 20, paddingVertical: 50, flex: 1, justifyContent: 'center' }}>

      {/* DROPDOWN MENU FOR FOOD */}
      <SelectList
        data={ingredientData}
        onSelect={getStandardUnit}
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
        <Text style={{ marginTop: 15 }}>{SUData}</Text>
      </View>

      {/* DATE */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 'bold' }}>Use by date:</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={handleOnPress} style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'gray', width: '50%' }}>
          <Text>Select Date</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <DatePicker
                mode='calendar'
                minimumDate={startDate}
                selected={date}

                onDateChange={handleChange}
              />

              <TouchableOpacity onPress={handleOnPress}>
                <Text>Save</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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