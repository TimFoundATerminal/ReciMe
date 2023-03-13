// How to Add or Remove FlatList Item with Animation
// https://aboutreact.com/add-or-remove-flatlist-item-with-animation/

// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  //Text,
  View,
  //StyleSheet,
  FlatList,
  UIManager,
  LayoutAnimation,
  //TouchableOpacity,
  SafeAreaView,
  Platform,
  //Button,
} from 'react-native';

import { SelectList } from 'react-native-dropdown-select-list'

import Card from './Card';
console.disableYellowBox = true;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const imageUrl =
  'https://www.pngkey.com/png/full/432-4322160_cancel-close-cross-delete-for-multiplication-remove-cross.png';

const BlackList = () => {

  const [selected, setSelected] = useState("");
  
  const data = [
      {key:'1', value:'Vegetarian'},
      {key:'2', value:'Vegan'},
      {key:'3', value:'Red meat'},
      {key:'4', value:'Eggs'},
      {key:'5', value:'Milk'},
      {key:'6', value:'Nuts'},
      {key:'7', value:'Dairy'},
  ]

  const [dataSource, setDataSource] = useState([]);

  const setAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeIn,
        springDamping: 0.7,
      },
    });
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
  };

  const addItem = (() => {
    let key = dataSource.length;
    return () => {
      dataSource.unshift({
        key,
        uri: imageUrl,
        title: selected,
        //description: 'Description',
        animated: true,
      });
      setAnimation();
      setDataSource(dataSource.slice(0));
      key++;
    };
  })();

  const removeItem = (key) => {
    setAnimation();
    setDataSource(
         dataSource.slice().filter((item) => item.key !== key)
    );
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <Card item={item} removeItem={removeItem} />
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  // const getItem = (item) => {
  //   // Function for click on an item
  //   alert('Id : ' + item.id + ' Title : ' + item.title);
  // };

  //const [selected, setSelected] = React.useState("");

  return (
    <SafeAreaView style={{flex: 1}}>
      <SelectList 
        setSelected={(val) => setSelected(val)} 
        data={data} 
        save="value"
        onSelect={addItem}
        notFoundText="Try different wording or scroll"
        //val={{ key:'0', value:"Click to add blacklist item" }}
        placeholder="Click to add blacklist item"
        //defaultOption={{ key:'0', value:"Click to add blacklist item" }}
      />
      {/* <TouchableOpacity
        style={styles.addButtonStyle}
        onPress={addItem}>
        <Text style={styles.addIconStyle}>
            Click to add list item
        </Text>
      </TouchableOpacity> */}
      <FlatList
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   addButtonStyle: {
//     width: '100%',
//     elevation: 3,
//     backgroundColor: '#808080',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   addIconStyle: {
//     color: 'white',
//     padding: 10,
//     fontSize: 20,
//     textAlign: 'center',
//   },
// });

export default BlackList;
