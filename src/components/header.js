import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomHeader = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const getTitle = () => {
        // Define a way to determine the title based on the route
        // For example, you can use route.name or any custom logic
        const routeName = route.name;
        switch (routeName) {
            case 'Dashboard':
                return 'Headlines';
            // Add more cases as needed for other screens
            default:
                return 'App';
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{getTitle()}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        backgroundColor: '#000000',
        // alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
        
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#c7c7c7',
        marginLeft:20,
        marginTop:30
    },
});

export default CustomHeader;
