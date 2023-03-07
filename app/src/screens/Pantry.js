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

  //HTTPS REQUEST (FETCH)
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

  //REMOVE ITEM FUNCTIONALITY
  removeItem = (itemToDelete) => {
    fetch('http://172.20.10.2:3000/api/pantry/' + itemToDelete, {
        method: 'DELETE'
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

    const putURL = 'http://172.20.10.2:3000/api/pantry/' + itemToUpdate

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
        let freezeText;
        if (frozen) {
          freezeText = <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Frozen</Text>
          frozenButton = <Text style={{ fontSize: 15, color: 'white' }}>Unfreeze</Text>
          frozen = 0;
        } else {
          freezeText = <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Not Frozen</Text>
          frozenButton = <Text style={{ fontSize: 15, color: 'white' }}>Freeze</Text>
          frozen = 1;
        }

        return (
          <View style={{ paddingVertical: 4, margin: 5, backgroundColor: "#fff" }}>
            <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>{name}</Text>
            <Text style={{ textAlign:'center', paddingVertical: 10, paddingHorizontal: 60 }}>Quantity: {quantity} {standardUnit}</Text>
            {freezeText}
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

  // DROPDOWN MENU CONST (1 - for dropdown menu, 2 - for API call, 3 - for getting the standard unit)
  const [getSelected, setSelected] = React.useState("");
  const [ingredientData, setData] = React.useState([]);
  const [SUData, setSUData] = React.useState("");

  // QUANTITY CONST
  const [getQuantity, setQuantity] = React.useState("");

  // DATE CONST
  const [getDay, setDay] = React.useState("");
  const [getMonth, setMonth] = React.useState('1');
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
    {key:'1',value:'01'},
    {key:'2',value:'02'},
    {key:'3',value:'03'},
    {key:'4',value:'04'},
    {key:'5',value:'05'},
    {key:'6',value:'06'},
    {key:'7',value:'07'},
    {key:'8',value:'08'},
    {key:'9',value:'09'},
    {key:'10',value:'10'},
    {key:'11',value:'11'},
    {key:'12',value:'12'},
  ]

  const dayData = [
    {key:'1',value:'01'}
  ]

  const yearData = [
    {key:'2023',value:'2023'},
    {key:'2024',value:'2024'},
    {key:'2025',value:'2025'},
  ]

  const onPressBack = () => {
    props.navigation.navigate('BarcodeOrManual');
  }

  const concatDate = getYear + getDay + getMonth;

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

  const ingredientURL = 'http://172.20.10.2:3000/api/ingredients/' + getSelected;

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