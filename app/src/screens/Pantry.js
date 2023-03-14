import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

import * as Constants from '../Constants';

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

  // DROPDOWN MENU CONST (1 - for dropdown menu, 2 - for API call, 3 - for getting the standard unit)
  const [getSelected, setSelected] = React.useState("");
  const [ingredientData, setData] = React.useState([]);
  const [SUData, setSUData] = React.useState("");

  // QUANTITY CONST
  const [getQuantity, setQuantity] = React.useState("");

  // DATE CONST
  const [getDay, setDay] = React.useState('01');
  const [getMonth, setMonth] = React.useState('01');
  const [getYear, setYear] = React.useState("");

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

  const monthData = [
    {key:'01',value:'01'},
    {key:'02',value:'02'},
    {key:'03',value:'03'},
    {key:'04',value:'04'},
    {key:'05',value:'05'},
    {key:'06',value:'06'},
    {key:'07',value:'07'},
    {key:'08',value:'08'},
    {key:'09',value:'09'},
    {key:'10',value:'10'},
    {key:'11',value:'11'},
    {key:'12',value:'12'},
  ]

  const dayDataOne = [
    {key:'01',value:'01'},
    {key:'02',value:'02'},
    {key:'03',value:'03'},
    {key:'04',value:'04'},
    {key:'05',value:'05'},
    {key:'06',value:'06'},
    {key:'07',value:'07'},
    {key:'08',value:'08'},
    {key:'09',value:'09'},
    {key:'10',value:'10'},
    {key:'11',value:'11'},
    {key:'12',value:'12'},
    {key:'13',value:'13'},
    {key:'14',value:'14'},
    {key:'15',value:'15'},
    {key:'16',value:'16'},
    {key:'17',value:'17'},
    {key:'18',value:'18'},
    {key:'19',value:'19'},
    {key:'20',value:'20'},
    {key:'21',value:'21'},
    {key:'22',value:'22'},
    {key:'23',value:'23'},
    {key:'24',value:'24'},
    {key:'25',value:'25'},
    {key:'26',value:'26'},
    {key:'27',value:'27'},
    {key:'28',value:'28'},
    {key:'29',value:'29'},
    {key:'30',value:'30'},
    {key:'31',value:'31'},
  ]

  const dayDataTwo = [
    {key:'01',value:'01'},
    {key:'02',value:'02'},
    {key:'03',value:'03'},
    {key:'04',value:'04'},
    {key:'05',value:'05'},
    {key:'06',value:'06'},
    {key:'07',value:'07'},
    {key:'08',value:'08'},
    {key:'09',value:'09'},
    {key:'10',value:'10'},
    {key:'11',value:'11'},
    {key:'12',value:'12'},
    {key:'13',value:'13'},
    {key:'14',value:'14'},
    {key:'15',value:'15'},
    {key:'16',value:'16'},
    {key:'17',value:'17'},
    {key:'18',value:'18'},
    {key:'19',value:'19'},
    {key:'20',value:'20'},
    {key:'21',value:'21'},
    {key:'22',value:'22'},
    {key:'23',value:'23'},
    {key:'24',value:'24'},
    {key:'25',value:'25'},
    {key:'26',value:'26'},
    {key:'27',value:'27'},
    {key:'28',value:'28'},
    {key:'29',value:'29'},
    {key:'30',value:'30'},
  ]

  const dayDataThree = [
    {key:'01',value:'01'},
    {key:'02',value:'02'},
    {key:'03',value:'03'},
    {key:'04',value:'04'},
    {key:'05',value:'05'},
    {key:'06',value:'06'},
    {key:'07',value:'07'},
    {key:'08',value:'08'},
    {key:'09',value:'09'},
    {key:'10',value:'10'},
    {key:'11',value:'11'},
    {key:'12',value:'12'},
    {key:'13',value:'13'},
    {key:'14',value:'14'},
    {key:'15',value:'15'},
    {key:'16',value:'16'},
    {key:'17',value:'17'},
    {key:'18',value:'18'},
    {key:'19',value:'19'},
    {key:'20',value:'20'},
    {key:'21',value:'21'},
    {key:'22',value:'22'},
    {key:'23',value:'23'},
    {key:'24',value:'24'},
    {key:'25',value:'25'},
    {key:'26',value:'26'},
    {key:'27',value:'27'},
    {key:'28',value:'28'},
  ]

  const yearData = [
    {key:'2023',value:'2023'},
    {key:'2024',value:'2024'},
    {key:'2025',value:'2025'},
  ]

  const onPressBack = () => {
    props.navigation.navigate('BarcodeOrManual');
  }

  // CHOOSES THE CORRECT DAYS IN A MONTH
  const ChooseDate = () => {

    let chooseMonthComponent;

    if (getMonth == '01' || getMonth == '03' || getMonth == '05' || getMonth == '07' || getMonth == '08' || getMonth == '10' || getMonth == '12') {
      chooseMonthComponent =  <SelectList
                                data={dayDataOne}
                                //onSelect={() => alert(getDay)}
                                // setSelected={setSelected}
                                setSelected={(val) => setDay(val)}
                                dropdownItemStyles={{marginHorizontal:10}}
                                dropdownTextStyles={{color:'black'}}
                                placeholder=" "
                                maxHeight={100}
                              />
    }

    if (getMonth == '04' || getMonth == '06' || getMonth == '09' || getMonth == '11') {
      chooseMonthComponent =  <SelectList
                                data={dayDataTwo}
                                // onSelect={() => alert(selected)}
                                // setSelected={setSelected}
                                setSelected={(val) => setDay(val)}
                                dropdownItemStyles={{marginHorizontal:10}}
                                dropdownTextStyles={{color:'black'}}
                                placeholder=" "
                                maxHeight={100}
                              />
    }

    if (getMonth == '02') {
      chooseMonthComponent =  <SelectList
                                data={dayDataThree}
                                // onSelect={() => alert(selected)}
                                // setSelected={setSelected}
                                setSelected={(val) => setDay(val)}
                                dropdownItemStyles={{marginHorizontal:10}}
                                dropdownTextStyles={{color:'black'}}
                                placeholder=" "
                                maxHeight={100}
                              />
    }

    return (
      <View>
        {chooseMonthComponent}
      </View>
    )

  }

  const concatDate = getYear + getDay + getMonth;

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
        {/* <ChooseDate /> */}
        <SelectList
          data={dayDataOne}
          //onSelect={() => alert(getDay)}
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