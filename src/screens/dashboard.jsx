import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import BackgroundFetch from 'react-native-background-fetch';
import { API_KEY } from "@env";

const DashboardScreen = () => {
    const [headlines, setHeadlines] = useState([]);
    const [displayedHeadlines, setDisplayedHeadlines] = useState([]);
    const [pinnedHeadlines, setPinnedHeadlines] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const renderRightActions = (headline) => {
        return (
            <View style={styles.deleteBox}>
                <Text style={styles.deleteText}>Delete</Text>
            </View>
        );
    };
    const renderLeftActions = (headline) => {
        return (
            <View style={styles.pinBox}>
                <Text style={styles.pinText}>Pin</Text>
            </View>
        );
    };
    const onSwipeableOpen = (headline, direction) => {
        if (direction === 'right') {
            handleDeleteHeadline(headline);
        }
        if (direction === 'left') {
            handlePinnedHeadline(headline);
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
    const handlePinnedHeadline = async (headline) => {
        setPinnedHeadlines([headline, ...pinnedHeadlines])
    }

    // Function to initialize or reset the timer
    const initializeUpdateTimer = () => {
        clearInterval(intervalRef.current); // Clear existing timer
        intervalRef.current = setInterval(() => {
            updateHeadlines();
        }, 10000); // Set new timer
    };

    // Reference to store the interval ID
    const intervalRef = useRef(null);


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
        initializeUpdateTimer();

        return () => clearInterval(intervalRef.current); // Clear interval on component unmount
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

    const onRefresh = async () => {
        setIsRefreshing(true);
        // Call your update function here
        await updateHeadlines();
        setIsRefreshing(false);
        initializeUpdateTimer();
    };

    const renderHeadlineItem = ({ item: headline, index }) => {
        return (
            <Swipeable
                key={index + headline}
                renderRightActions={() => renderRightActions(headline)}
                onSwipeableOpen={(direction) => onSwipeableOpen(headline, direction)}
                renderLeftActions={() => renderLeftActions(headline)}
            >
                <Text style={styles.headline}>
                    {headline}
                </Text>
            </Swipeable>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            {pinnedHeadlines.length ? (
                <View style={{ maxHeight: '40%' }}>
                    <Text style={styles.pinnedHeading}>Pinned Headlines</Text>
                    <ScrollView >
                        {pinnedHeadlines.map((headline, index) => (
                            <Text key={index + headline} style={styles.headline}>
                                {headline}
                            </Text>
                        ))}
                    </ScrollView>
                    <Text style={styles.pinnedHeading}>Other Headlines</Text>
                </View>
            ) : null}
            <FlatList
                data={displayedHeadlines}
                renderItem={renderHeadlineItem}
                keyExtractor={(headline, index) => `${index}-${headline}`}
                style={[styles.scrollView, { padding: 5 }]}
                showsVerticalScrollIndicator={true}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
        padding: 10,
        paddingHorizontal: 20
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
        backgroundColor: '#1c1c1e',
        borderWidth: 1,
        borderColor: '#2a2a2a',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollView: {
        flexGrow: 1,
        // minHeight:'60%'
    },
    deleteBox: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginBottom: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        width: '30%'
    },
    deleteText: {
        color: '#fff',
        fontWeight: '700',
    },
    pinBox: {
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        width: '30%'
    },
    pinText: {
        color: '#fff',
        fontWeight: '700',
    },
    pinnedHeading: {
        color: '#c7c7c7',
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 2
    },
    pinnedBox: {
        // backgroundColor:'#2a2a2a',
        // marginVertical:10,
        // padding:10,
    }
});

export default DashboardScreen;
