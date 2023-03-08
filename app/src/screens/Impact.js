import React, { useState, useEffect } from "react";
import moment from "moment";
import { Button, SafeAreaView, Text, Dimensions, View, Pressable, StatusBar, Platform } from "react-native";
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import tw from 'twrnc';
import * as Constants from '../Constants';

export default function Impact() {
  
  const [loading, setLoaing] = useState(true)
  const [recipes, setRecipes] = useState([])

  // formats dates into API request format
  function buildWasteFilter(dateAfter, dateBefore) {
    return `?dateBefore=${dateBefore}&datefter=${dateAfter}`
  }

  // change this (IPV4 address from ipconfig in constants file)
  const wasteBaseURL = Constants.API_FIXED_URL + `/waste`

  //get request to API to get waste data
  function apiWasteCall(wasteURL) {
    useEffect(() => {
      fetch(wasteURL, { method: "GET" })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(pantryData => {
          // insert functionality to handle API call here
          console.log(pantryData)
        })
        .catch(error => console.error('Error:', error));
    })
  }

  // get the screenwidth for all components
  const screenWidth = Dimensions.get('window').width;
  
  // sudo testing data
  let weekData = [12, 17, 8, 14, 21, 3, 15];
  let weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let monthData = [12, 17, 8, 14];
  let monthLabels = ["Jan", "Feb", "Mar", "Apr"]
  let weekObj = getWeekDays(0);
  
  let pressedView = 0;
  
  const switchActiveColor = "bg-green-700";
  const switchInactiveColor = "bg-zinc-300";
  
  // setup hook states
  const [numberOfWeeksAgo, setNumberOfWeeksAgo] = useState(0);
  const [weekViewColor, setWeekViewColor] = useState(switchActiveColor);
  const [monthViewColor, setMonthViewColor] = useState(switchInactiveColor);
  const [graphObj, updateGraph] = useState(createGraphObj(weekObj.week, weekData));
  const [weekStartDate, updateWeekStartDate] = useState(weekObj.startDate);
  const [weekEndDate, updateWeekendDate] = useState(weekObj.endDate);
  const [nextWeekColor, updateWeekColor] = useState(switchInactiveColor);
  const [weekButtonsShow, setWeekButtonsVisability] = useState("");

  function createGraphObj(labels, data) {
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
    if (numWeeks == 0) { 
      return switchInactiveColor;
    } else {
      return switchActiveColor;
    }
  }

  const previousWeek = () => {
    // updates all related components to the previous week
    const update = numberOfWeeksAgo + 1; 
    setNumberOfWeeksAgo(update);
    updateWeekColor(getNextWeekColor(update));
    const dateObj = getWeekDays(update);

    // remove slashes anc convert to integer
    const afterDate = parseInt(dateObj.startDate.replace(/\D/g, ''))
    const beforeDate = parseInt(dateObj.endDate.replace(/\D/g, ''))

    // fetch waste data from server
    const completeURL = wasteBaseURL + buildWasteFilter(afterDate, beforeDate);
    apiWasteCall(completeURL);

    // update graph based on the data
    updateGraph(createGraphObj(dateObj.week, weekData));
    updateWeekStartDate(dateObj.startDate);
    updateWeekendDate(dateObj.endDate);
    console.log(update);
  }

  const nextWeek = () => {
    // updates all related components to the next week
    if (numberOfWeeksAgo <= 0) { return; }
    const update = numberOfWeeksAgo - 1; 
    setNumberOfWeeksAgo(update);
    updateWeekColor(getNextWeekColor(update));
    const dateObj = getWeekDays(update);
    updateGraph(createGraphObj(dateObj.week, weekData));
    updateWeekStartDate(dateObj.startDate);
    updateWeekendDate(dateObj.endDate);
    console.log(update);
  }

  function getWeekDays(numberOfWeeksAgo) {
    let weekDays = new Array(7);
    for (let i = 0; i < 7; i++) {
      weekDays[i] = moment().subtract(i, 'days').format('ddd');
    }
    weekDays.reverse()
    return {
      startDate: moment().subtract((numberOfWeeksAgo * 7) + 6, 'days').format('L'), 
      endDate: moment().subtract(numberOfWeeksAgo * 7, 'days').format('L'), 
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
    // if (pressedView == 0) { return; }
    pressedView = 0;
    setWeekViewColor(switchActiveColor);
    setMonthViewColor(switchInactiveColor);
    setWeekButtonsVisability("");
    updateGraph(createGraphObj(weekLabels, weekData))
    console.log(pressedView);
  }

  const monthClickHandler = () => {
    // if (pressedView == 1) { return; }
    pressedView = 1;
    setWeekViewColor(switchInactiveColor);
    setMonthViewColor(switchActiveColor);
    setWeekButtonsVisability("hidden");
    updateGraph(createGraphObj(monthLabels, monthData))
    console.log(pressedView);
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Creates a basic line graph in react native */}
      <View>
        <Text style={tw`text-2xl pt-3 pl-3 pr-3 bg-white`}>Carbon Footprint</Text>
        <Text style={tw`bg-white pl-3 pr-3, pt-1`}>{weekStartDate} - {weekEndDate}</Text>
      </View>
      <View style={tw`p-3 android:pt-2 bg-white dark:bg-black`}>
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
    </SafeAreaView>
  );
}


// function formatWeekDays(weekDays) {
//   let arrayLength = weekDays.length;
//   for (let i = 0; i < arrayLength; i++) {
//     const element = array[i];
//     switch (element) {
//       case "Monday":
//         array[i] = "Mon";
//         break;
//       case "Tuesday":
//         array[i] = "Tue";
//         break;
//       case "Wednesday":
//         array[i] = "Wed";
//         break;
//       case "Thursday":
//         array[i] = "Thu";
//         break;
//       case "Friday":
//         array[i] = "Fri";
//         break;
//       case "Saturday":
//         array[i] = "Sat";
//         break;
//       case "Sunday":
//         array[i] = "Sun";
//         break;
    
//       default:
//         console.log("Error")
//         break;
//     }
//   }
// }