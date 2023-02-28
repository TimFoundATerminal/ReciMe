import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

//Navigation import
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// GET API CONTAINER
class GetAPIContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        dataSource: [],
    };
  }

  // HTTPS REQUEST (FETCH)
  goForFetch = () => {
      this.setState({
          loading: true,

      })
      fetch('http://localhost:3000/api/pantry', {
        method: 'GET'
      })
      .then(response => response.json())
      .then((responseJson) => {
          console.log('getting data from fetch', responseJson)
          this.setState({
              loading: false,
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
  renderItem = (data) => {
      return (
          <TouchableOpacity style={styles.list}>
              <Text style={styles.lightText}>{data.item.ingredientID}</Text>
              <Text style={styles.lightText}>{data.item.quantity}</Text>
              <Text style={styles.lightText}>{data.item.dateExpiry}</Text></TouchableOpacity>
      )
  }

  // RENDER / CREATE COMPONENT
  render() {
    const { dataSource, loading } = this.state
    return (
        <ApiView
            goForFetch={this.goForFetch}
            dataSource={dataSource}
            loading={loading}
            FlatListSeparator={this.FlatListSeparator}
            renderItem={this.renderItem}
        />
    );
}
}

// MAIN PAGE
const Main = (props) => {

  // VARIABLES FROM APICONTAINER
  const { goForFetch, renderItem, FlatListItemSeparator, dataSource, loading } = props

  // VARIABLES FOR ADDING FOOD TO PANTRY (passed from pantry upon entry)
  //let { selected, quantity, metric, day, month, year } = route.params;

  // FOR LOOP TO GET ALL FOOD ITEMS IN PANTRY
  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql (
  //       'line here',
  //       [],
  //       (tx, results) => {
  //         var temp = [];
  //         for (let i = 0; i < results.row.length; ++i)
  //           temp.push(results.rows.item(i));
  //         setFlatListItems(temp);
  //       }
  //     )
  //   })
  // })

  // let listItemView = (item) => {
  //   return (
  //     <View
  //       // key={selected} <-- set as the food ID
  //       style={{ backgroundColor: "#98DC14", padding: 20 }}>
  //       {/* <Text>{item.quantity} {item.FOOD}</Text> <-- LIST VIEW GOES HERE */}
  //     </View>
  //   )
  // };

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

      <View style={{ margin: 18 }}>
          <Pressable onPress={goForFetch} color='#056835' style={styles.button}>
            <Text>Click to use Fetch</Text>
          </Pressable>
      </View>

      {/* LIST FOR FOOD ITEMS */}
      <FlatList
          data={dataSource}
          ItemSeparatorComponent={FlatListItemSeparator}
          renderItem={item => renderItem(item)}
          keyExtractor={item => item.ingredientID.toString()}
      />

      {/* LOADING UI WHILST FETCHING */}
      {loading &&
          <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0c9" />
              <Text>Fetching Data</Text>
          </View>
      }

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
  const [getSelected, setSelected] = React.useState("");

  // QUANTITY CONST
  const [getQuantity, setQuantity] = React.useState("");
  const [getMetric, setMetric] = React.useState("");

  // DATE CONST
  const [getDay, setDay] = React.useState("");
  const [getMonth, setMonth] = React.useState("");
  const [getYear, setYear] = React.useState("");

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

  // ASYNC COMPONENT TO POST DATA TO API
  async function storeData() {
    try {
      await fetch('http://localhost:3000/api/pantry', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredientID: {getSelected},
          quantity: {getQuantity}, // ADD GETMETRIC
          dateExpiry: {getDay}, // ADD GETMONTH AND GETYEAR
          frozen: ''
        })
      })
    } catch(e) {
      console.log(e);
    }
  }

  // VALIDATION AND PASS DATA TO DATABASE
  const showAlert = () => {
    if (getSelected && getQuantity && getMetric && getDay && getMonth && getYear) {

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
        data={data}
        // onSelect={() => alert(selected)}
        // setSelected={setSelected}
        setSelected={(val) => setSelected(val)}
        dropdownItemStyles={{marginHorizontal:10}}
        dropdownTextStyles={{color:'black'}}
        searchPlaceholder="Enter item"
        placeholder="Enter item"
        maxHeight={100}
      />

      {/* FOOD QUANTITY */}
      <Text style={{ marginTop: 9, marginBottom: 3, fontWeight: 500 }}>Quantity:</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          onChangeText={setQuantity}
          value={getQuantity}
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