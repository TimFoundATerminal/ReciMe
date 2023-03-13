// How to Add or Remove FlatList Item with Animation
// https://aboutreact.com/add-or-remove-flatlist-item-with-animation/

// import React in our code
import React from 'react';

// import all the components we are going to use
import {
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
//Import basic react native components

const Card = (props) => {
  const {removeItem, item} = props;
  const {uri, title, description, key} = item;
  return (
    <Animated.View
      style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10
      }}
    >
      <View style={styles.container}>
        <View style={styles.metaDataContainer}>
          <View style={styles.metaDataContent}>
            <Text style={styles.title}>
                 {title}
            </Text>
            <Text style={styles.description}>
                 {description}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeItem(key)}>
          <Image
              style={styles.thumbnail}
              source={{uri}}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    elevation: 3,
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  metaDataContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 70,
    height: 70,
  },
  metaDataContent: {
    marginTop: 10,
    marginLeft: 0,
  },
  title: {
    color: '#444',
    fontSize: 30,
    fontWeight: 'bold',
    //textAlign: 'center'
  },
  description: {
    fontSize: 16,
    color: '#888',
    fontWeight: '700',
  },
});

export default Card;