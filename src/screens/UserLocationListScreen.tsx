//react imports
import React, { useEffect, useLayoutEffect } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

//redux imports
import { clearLocations, fetchPaginatedData, setCurrentPage } from '../slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';

//component imports
import LocationTracker from '../managers/LocationTracker';
import { LocationItem } from '../types/LocationItem';

//utils imports
import LocationItemView from '../components/LocationItemView';
import { NotificationHandler } from '../managers/NotificationHandler';



const UserLocationListScreen = () => {

    const navigation = useNavigation();

    const dispatch = useDispatch();
    const { items, currentPage, totalPages, loading, error, pageSize } = useSelector((state) => state.locations);

    const handleClearAll = React.useCallback(() => {
        Alert.alert(
            "Clear All Locations",
            "Are you sure you want to clear all locations? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    onPress: () => {
                        dispatch(clearLocations());
                    },
                    style: "destructive"
                }
            ]
        );
    }, [dispatch]);

    // Move header button component outside render
    const HeaderRightButton = React.useCallback(() => (
        <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}>
            <Icon name="clear-all" size={24} color="#017cffff" />
        </TouchableOpacity>
    ), [handleClearAll]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRightButton,
        });
    }, [navigation, HeaderRightButton]);


    useEffect(() => {
        dispatch(fetchPaginatedData({ currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    };

    // const handlePrevPage = () => {
    //     if (currentPage > 1) {
    //         dispatch(setCurrentPage(currentPage - 1));
    //     }
    // };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }


    const listFooterComponent = () => (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color="#0875f2ff" />
        </View>
    );



    const renderItem = ({ item }: { item: LocationItem }) => (
        <LocationItemView item={item} />
    );

    return (
        <View style={styles.container}>
            <NotificationHandler />
            <LocationTracker />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                onEndReached={handleNextPage}
                onEndReachedThreshold={0.1} // Trigger when 10% from the end
                ListFooterComponent={loading ? listFooterComponent : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 16,
        padding: 8,
    },
    listContainer: {
        paddingVertical: 10,
    },
    container: {
        flex: 1
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserLocationListScreen;