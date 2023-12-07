import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import BackgroundFetch from 'react-native-background-fetch';
import { API_KEY } from "@env";

const DashboardScreen = () => {
    const [headlines, setHeadlines] = useState([]);
    const [displayedHeadlines, setDisplayedHeadlines] = useState([]);
    const renderRightActions = (headline) => {
        // You can customize this function to render the swipe action UI
        return (
            <View style={styles.deleteBox}>
                <Text style={styles.deleteText}>Delete</Text>
            </View>
        );
    };
    const onSwipeableOpen = (headline, direction) => {
        if (direction === 'right') {
            handleDeleteHeadline(headline);
        }
    };
    const fetchHeadlines = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&pageSize=100`);
            const json = await response.json();
            const headlinesFromApi = json.articles.map(article => article.title).slice(0, 100);
            await AsyncStorage.setItem('headlines', JSON.stringify(headlinesFromApi));
            setHeadlines(headlinesFromApi);
            setDisplayedHeadlines(headlinesFromApi.slice(0, 10)); // Initially display first 5 headlines
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteHeadline = async (headline) => {
        // Update displayed headlines
        const newDisplayedHeadlines = displayedHeadlines.filter(h => h !== headline);
        setDisplayedHeadlines(newDisplayedHeadlines);

        // Update full headline list
        const newHeadlines = headlines.filter(h => h !== headline);
        setHeadlines(newHeadlines);

        // Update local storage
        try {
            await AsyncStorage.setItem('headlines', JSON.stringify(newHeadlines));
        } catch (e) {
            console.error('Failed to update headlines in local storage', e);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const storedHeadlines = await AsyncStorage.getItem('headlines');
                if (storedHeadlines !== null) {
                    const storedHeadlinesArray = JSON.parse(storedHeadlines);
                    setHeadlines(storedHeadlinesArray);
                    setDisplayedHeadlines(storedHeadlinesArray.slice(0, 10));
                } else {
                    fetchHeadlines();
                }
            } catch (e) {
                console.error(e);
            }
        };

        init();

        // Set an interval to update headlines every 10 seconds
        const interval = setInterval(() => {
            updateHeadlines();
        }, 10000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [headlines.length]);

    const updateHeadlines = async () => {
        if (headlines.length === 0) {
            await AsyncStorage.removeItem('headlines'); // Clear local storage if all headlines have been displayed
            await fetchHeadlines();
            return;
        }
        // Randomly pick 5 new headlines that have not been displayed yet
        let newHeadlines = [];
        let updatedHeadlines = [...headlines]; // Create a copy of the headlines array to modify

        while (newHeadlines.length < 5 && updatedHeadlines.length > 0) {
            const randomIndex = Math.floor(Math.random() * updatedHeadlines.length);
            newHeadlines.push(updatedHeadlines[randomIndex]);
            updatedHeadlines.splice(randomIndex, 1); // Remove the selected headline from the copied array
        }

        // Update the displayed headlines - add new headlines to the start and keep the total length at 10
        setDisplayedHeadlines(newHeadlines.concat(displayedHeadlines.slice(0, 5)));

        // Update headlines in local storage and state
        try {
            await AsyncStorage.setItem('headlines', JSON.stringify(updatedHeadlines));
            setHeadlines(updatedHeadlines); // Update the headlines state with the new array
        } catch (e) {
            console.error('Failed to update headlines in local storage', e);
        }
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {displayedHeadlines.map((headline, index) => (
                    <Swipeable
                        key={index}
                        renderRightActions={() => renderRightActions(headline)}
                        onSwipeableOpen={(direction) => onSwipeableOpen(headline, direction)}
                    >
                        <Text style={styles.headline}>
                            {headline}
                        </Text>
                    </Swipeable>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
        padding: 10,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    headline: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#1c1c1e', // A slightly different background for contrast
        borderWidth: 1,
        borderColor: '#2a2a2a', // Light border color
        borderRadius: 5, // Rounded corners
        shadowColor: '#000', // Shadow for a subtle depth effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevation for Android
    },
    scrollView: {
        flexGrow: 1,
    },
});

export default DashboardScreen;
