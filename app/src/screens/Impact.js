import React, { useState, useEffect } from "react";
import moment from "moment";
import { SafeAreaView, Text, Dimensions, View, Pressable, StatusBar, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import tw from 'twrnc';
import * as Constants from '../Constants';

export default function Impact() {
  
  // get the screenwidth for all components
  const screenWidth = Dimensions.get('window').width;
  
  // sudo testing data
  let weekData = [12, 17, 8, 14, 21, 3, 15];
  let monthData = [12, 17, 8, 14];
  let monthLabels = ["Jan", "Feb", "Mar", "Apr"]
  let weekObj = getWeekDays(0);
  let pressedView = 0;
  
  const switchActiveColor = "bg-green-700";
  const switchInactiveColor = "bg-zinc-300";

  // updates when the page has finished loading
  const [loading, setLoading] = useState(true);
  
  // setup hook states
  const [numberOfWeeksAgo, setNumberOfWeeksAgo] = useState(0);
  const [weekViewColor, setWeekViewColor] = useState(switchActiveColor);
  const [monthViewColor, setMonthViewColor] = useState(switchInactiveColor);
  const [graphObj, updateGraph] = useState(createGraphObj(weekObj.week, new Array(7).fill(0.0)));
  const [weekStartDate, updateWeekStartDate] = useState(moment(weekObj.startDate, "YYYYMMDD").format('L'));
  const [weekEndDate, updateWeekendDate] = useState(moment(weekObj.endDate, "YYYYMMDD").format('L'));
  const [nextWeekColor, updateWeekColor] = useState(switchInactiveColor);
  const [weekButtonsShow, setWeekButtonsVisability] = useState("");

  // API call in hook
  let getWasteData = (update, dateObj) => {
    // build api request
    let wasteApiUrl = Constants.API_FIXED_URL + `/waste?`
    if (dateObj.startDate != null) {
      wasteApiUrl += `dateAfter=${dateObj.startDate}&`
    }
    if (dateObj.endDate != null) {
      wasteApiUrl += `dateBefore=${dateObj.endDate}&`
    }

    // fetch with API request
    fetch(wasteApiUrl, { method: "GET" })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
      .then(pantryData => {
        // process the return data
        let wasteWeekData = new Array(7).fill(0.0);
        const startDate = moment(dateObj.startDate, "YYYYMMDD")
        // loop through all waste items and sum on dates
        for (let i = 0; i < pantryData.length; i++) {
          const wasteItem = pantryData[i]
          const wasteDate = moment(wasteItem.dateThrownAway, "YYYYMMDD")
          const daysFromWeekStart = parseInt(wasteDate.diff(startDate, 'days'))
          wasteWeekData[daysFromWeekStart] += parseFloat(wasteItem.carbonWasted)
        }
        // update interface with new data
        setNumberOfWeeksAgo(update);
        updateWeekColor(getNextWeekColor(update));
        updateGraph(createGraphObj(dateObj.week, wasteWeekData));
        updateWeekStartDate(moment(dateObj.startDate, "YYYYMMDD").format('L'));
        updateWeekendDate(moment(dateObj.endDate, "YYYYMMDD").format('L'));
        setLoading(false);
      })
      .catch(error => {
        // will log and show error prompt to user
        console.error('Error:', error)
        Alert.alert('Network Error', 'Please check your internet connection and try again', [
          {
            text: 'OK', 
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
        ]);
      });
  };

  // updates page when first loaded
  useEffect(() => {
    console.log("this ran")
    getWasteData(0, getWeekDays(0));
  }, []);

  function createGraphObj(labels, data) {
    // builds a graph object that can be passed to the graph to display
    return (
      {
        labels: labels, 
        datasets: [
          {data: data}
        ]
      }
    );
  }

  function getNextWeekColor(numWeeks) {
    // unhighlights next button if on current week
    if (numWeeks == 0) { 
      return switchInactiveColor;
    } else {
      return switchActiveColor;
    }
  }

  const previousWeek = () => {
    // updates all related components to the previous week
    const update = numberOfWeeksAgo + 1; 
    const dateObj = getWeekDays(update);
    
    // fetch waste data from server and update interface
    getWasteData(update, dateObj);
  }

  const nextWeek = () => {
    // updates all related components to the next week
    if (numberOfWeeksAgo <= 0) { return; }
    const update = numberOfWeeksAgo - 1; 
    const dateObj = getWeekDays(update);

    // fetch waste data from server and update interface
    getWasteData(update, dateObj);
  }

  function getWeekDays(numberOfWeeksAgo) {
    let weekDays = new Array(7);
    for (let i = 0; i < 7; i++) {
      weekDays[i] = moment().subtract(i, 'days').format('ddd');
    }
    weekDays.reverse()
    return {
      startDate: moment().subtract((numberOfWeeksAgo * 7) + 6, 'days').format('YYYYMMDD'), 
      endDate: moment().subtract(numberOfWeeksAgo * 7, 'days').format('YYYYMMDD'), 
      week: weekDays
    };
  }

  const chartConfig={
    backgroundColor: '#0d7529',
    backgroundGradientFrom: '#1c521b',
    backgroundGradientTo: '#29e329',
    decimalPlaces: 1, // optional, defaults to 2dp
    strokeWidth: 10,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  }
  const graphStyle={
    marginVertical: 4,
    borderRadius: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  }

  const weekClickHandler = () => {
    // updates the switch button
    pressedView = 0;
    setWeekViewColor(switchActiveColor);
    setMonthViewColor(switchInactiveColor);
    setWeekButtonsVisability("");

    // updates the graph with respect to the week the user was looking at before
    getWasteData(numberOfWeeksAgo, getWeekDays(numberOfWeeksAgo));
    console.log(pressedView);

    console.log(pressedView);
  }

  const monthClickHandler = () => {
    // updates the switch button
    pressedView = 1;
    setWeekViewColor(switchInactiveColor);
    setMonthViewColor(switchActiveColor);
    setWeekButtonsVisability("hidden");
    updateGraph(createGraphObj(monthLabels, monthData))
    console.log(pressedView);
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      {loading ? (
        <View>
          <ActivityIndicator 
            size="large" 
            color="#1c521b"
            style={tw`min-h-[100%] `}/>
        </View>
        ) : (
        <View>
          <View>
            <Text style={tw`text-2xl pt-3 pl-3 pr-3 bg-white`}>Carbon Footprint</Text>
            <Text style={tw`bg-white pl-3 pr-3, pt-1`}>{weekStartDate} - {weekEndDate}</Text>
          </View>
          <View style={tw`p-3 android:pt-2 bg-white dark:bg-black`}>
          {/* Creates a basic line graph in react native */}
          <BarChart
              style={graphStyle}
              data={graphObj}
              width={screenWidth*0.92}
              height={220}
              yAxisSuffix={"kg"}
              chartConfig={chartConfig}
          />
          </View>
          <View style={tw`bg-white pb-3 flex flex-row`}>
            {/* Box 1 */}
            <View style={tw`bg-white basis-1/3 flex-row justify-center`}>
              <Pressable
                  onPress={previousWeek}
                >
                <View style={tw`p-2 ${switchActiveColor} rounded-lg w-20 justify-center ${weekButtonsShow}`}>
                  <Text style={tw`text-center`}>Previous</Text>
                </View>
              </Pressable>
            </View>
            {/* Box 2 */}
            <View style={tw`bg-white basis-1/3 flex-row justify-center`}>
              <Pressable
                onPress={weekClickHandler}
              >
                <View style={tw`p-2 flex ${weekViewColor} rounded-l-lg w-15`}>
                  <Text style={tw`text-center`}>Week</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={monthClickHandler}
              >
                <View style={tw`p-2 flex ${monthViewColor} rounded-r-lg w-15`}>
                  <Text style={tw`text-center`}>Month</Text>
                </View>
              </Pressable>
            </View>
            {/* Box 3 */}
            <View style={tw`bg-white basis-1/3 flex-row justify-center`}>
            <Pressable
                  onPress={nextWeek}
                >
                <View style={tw`p-2 ${nextWeekColor} rounded-lg w-20 justify-center ${weekButtonsShow}`}>
                  <Text style={tw`text-center`}>Next</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
})
