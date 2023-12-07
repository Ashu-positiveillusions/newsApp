import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomHeader = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const getTitle = () => {
        // display the title of the screen or any thing in the header based on the 
        // route name
        const routeName = route.name;
        switch (routeName) {
            case 'Dashboard':
                return 'Headlines';
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
