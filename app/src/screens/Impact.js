import React, { useState, useEffect } from "react";
import moment from "moment";
import { SafeAreaView, Text, Dimensions, View, Pressable, StatusBar, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import tw from 'twrnc';
import * as Constants from '../Constants';

export default function Impact() {
  
  // get the screenwidth for all components
  const screenWidth = Dimensions.get('window').width;
  
  const switchActiveColor = "bg-green-700";
  const switchInactiveColor = "bg-zinc-300";
  
  // updates when the page has finished loading
  const [loading, setLoading] = useState(true);
  
  // setup graph hook states
  let weekObj = getWeekDays(0);
  const [pressedView, setPressedView] = useState(0);
  const [numberOfWeeksAgo, setNumberOfWeeksAgo] = useState(0);
  const [weekViewColor, setWeekViewColor] = useState(switchActiveColor);
  const [monthViewColor, setMonthViewColor] = useState(switchInactiveColor);
  const [graphObj, updateGraph] = useState(createGraphObj(weekObj.week, new Array(7).fill(0.0)));
  const [timeframeStartDate, updateTimeframeStartDate] = useState(moment(weekObj.startDate, "YYYYMMDD").format('L'));
  const [timeframeEndDate, updateTimeframeEndDate] = useState(moment(weekObj.endDate, "YYYYMMDD").format('L'));
  const [nextWeekColor, updateWeekColor] = useState(switchInactiveColor);
  const [weekButtonsShow, setWeekButtonsVisability] = useState("");
  const [monthGraphObj, setMonthGraphObj] = useState();
  const [monthsStartDate, setMonthsStartDate] = useState();
  const [monthsEndDate, setMonthsEndDate] = useState();

  // setup insights hook states
  const [insightName, setInsightName] = useState();
  const [insightQuantity, setInsightQuantity] = useState();
  const [insightUnit, setInsightUnit] = useState();
  const [insightcarbonPercentage, setInsightcarbonPercentage] = useState();

  // API call to the remote backend for the data
  let getWasteWeekData = (update, dateObj) => {
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
        updateTimeframeStartDate(moment(dateObj.startDate, "YYYYMMDD").format('L'));
        updateTimeframeEndDate(moment(dateObj.endDate, "YYYYMMDD").format('L'));
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

  // API call to the remote backend for the data
  let getWasteMonthData = () => {
    // build api request
    const monthsObj = getMonthSpan();
    let wasteApiUrl = Constants.API_FIXED_URL + `/waste?`
    if (monthsObj.startDate != null) {
      wasteApiUrl += `dateAfter=${monthsObj.startDate}&`
    }
    if (monthsObj.endDate != null) {
      wasteApiUrl += `dateBefore=${monthsObj.endDate}&`
    }

    // fetch with API request
    fetch(wasteApiUrl, { method: "GET" })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
      .then(wasteData => {
        // process the return data into months and sum carbon wasted
        let monthRanges = new Array(7);
        // creates a range of dates to test between
        monthRanges[0] = parseInt(moment().startOf('month').add(1,'month').format('YYYYMMDD'))
        for (let i = 1; i < monthRanges.length; i++) {
          monthRanges[i] = parseInt(moment().startOf('month').subtract(i-1,'months').format('YYYYMMDD'))
        }
        monthRanges.reverse()

        // create date ranges and sum accross those ranges into wasteMonthData
        let wasteMonthData = new Array(6).fill(0.0);
        for (let i = 0; i < wasteData.length; i++) {
          const wasteItem = wasteData[i];
          const monthIndex = getMonthRangeIndex(wasteItem.dateThrownAway, monthRanges)
          wasteMonthData[monthIndex] += wasteItem.carbonWasted
        }

        // set MonthGraphObj in state so won't require another API call
        setMonthsStartDate(moment(monthsObj.startDate, "YYYYMMDD").format('L'));
        setMonthsEndDate(moment(monthsObj.endDate, "YYYYMMDD").format('L'));
        setMonthGraphObj(createGraphObj(monthsObj.months, wasteMonthData))

        // process data for insights
        console.log(wasteData);
        const carbonWaste = new Object();
        let totalCarbonWasted = 0.0;
        
        for (let i = 0; i < wasteData.length; i++) {
          const wasteItem = wasteData[i];
          totalCarbonWasted += wasteItem.carbonWasted;
          const key = wasteItem.ingredientID;
          if (key in carbonWaste) {
            carbonWaste[key] += wasteItem.carbonWasted;
          } else {
            carbonWaste[key] = wasteItem.carbonWasted;
          }
        }
        const ingredientId = Object.keys(carbonWaste).reduce((a, b) => carbonWaste[a] > carbonWaste[b] ? a : b)
        
        let quantityWaste = 0.0;
        let ingredientName;
        let ingredientUnit;
        for (let i = 0; i < wasteData.length; i++) {
          const wasteItem = wasteData[i];
          if (wasteItem.ingredientID == ingredientId) {
            quantityWaste += wasteItem.quantity
            ingredientName = wasteItem.name
            ingredientUnit = wasteItem.standardUnit
          }
        }
        
        console.log(ingredientName)
        setInsightName(ingredientName)
        console.log(quantityWaste)
        setInsightQuantity(quantityWaste)
        console.log(ingredientUnit)
        setInsightUnit(ingredientUnit)
        const carbonPercentage = parseInt(100*(carbonWaste[ingredientId]/totalCarbonWasted))
        console.log(carbonPercentage)
        setInsightcarbonPercentage(carbonPercentage)

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
    getWasteWeekData(0, getWeekDays(0));
  }, []);

  // updates monthData in the background
  useEffect(() => {
    getWasteMonthData();
  }, []);

  // given a date and range of dates will tell you the index it lies within
  function getMonthRangeIndex(date, dateRanges) {
    for (let i = 0; i < dateRanges.length-1; i++) {
      if ((dateRanges[i] <= date) && (date < dateRanges[i+1])) {
        return i;
      }
    }
    console.error("Date not in range");
  }

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
    getWasteWeekData(update, dateObj);
  }

  const nextWeek = () => {
    // updates all related components to the next week
    if (numberOfWeeksAgo <= 0) { return; }
    const update = numberOfWeeksAgo - 1; 
    const dateObj = getWeekDays(update);

    // fetch waste data from server and update interface
    getWasteWeekData(update, dateObj);
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

  function getMonthSpan() {
    let months = new Array(6);
    for (let i = 0; i < months.length; i++) {
      months[i] = moment().subtract(i, 'months').format('MMM');
    }
    months.reverse()

    return {
      startDate: moment().startOf('month').subtract(5, 'months').format('YYYYMMDD'), 
      endDate: moment().endOf('month').format('YYYYMMDD'), 
      months: months
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
    if (pressedView == 0) {
      return
    }
    setPressedView(0);
    setWeekViewColor(switchActiveColor);
    setMonthViewColor(switchInactiveColor);
    setWeekButtonsVisability("");

    // updates the graph with respect to the week the user was looking at before
    getWasteWeekData(numberOfWeeksAgo, getWeekDays(numberOfWeeksAgo));
  }

  const monthClickHandler = () => {
    // updates the switch button
    if (pressedView == 1) {
      return
    }
    setPressedView(1);
    setWeekViewColor(switchInactiveColor);
    setMonthViewColor(switchActiveColor);
    setWeekButtonsVisability("hidden");

    // updates the graph with the month data
    updateGraph(monthGraphObj)
    updateTimeframeStartDate(monthsStartDate)
    updateTimeframeEndDate(monthsEndDate)
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
            <Text style={tw`bg-white pl-3 pr-3, pt-1`}>{timeframeStartDate} - {timeframeEndDate}</Text>
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
          <View>
            <Text style={tw`text-2xl pt-3 pl-3 pr-3 bg-white`}>Insights</Text>
            <Text style={tw`bg-white pt-3 pl-3 pr-3`}>
            Your biggest contributor to your carbon footprint was wasted {insightName}.
            </Text>
            <Text style={tw`bg-white p-3`}>
            Where in the last 6 months you have throw away {insightQuantity} {insightUnit} which makes
            up around {insightcarbonPercentage}% of your total waste.
            </Text>
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
