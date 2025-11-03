import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 1, // Determines the thickness of the line
        backgroundColor: '#ccc', // Sets the color of the line
        width: '100%', // Makes the line span the full width of its parent container
        marginVertical: 10, // Adds vertical spacing above and below the line
    },
});

export default HorizontalLine;