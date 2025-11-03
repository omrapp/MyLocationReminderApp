//react imports
import React, { useLayoutEffect } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

//redux imports
import { clearLocations } from '../slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';

//component imports
import LocationTracker from '../managers/LocationTracker';
import { LocationItem } from '../data/LocationItem';

//utils imports
import LocationItemView from '../components/LocationItemView';
import { NotificationHandler } from '../managers/NotificationHandler';



const UserLocationListScreen = () => {
    const navigation = useNavigation();
    const locations = useSelector((state) => state.locations.list);
    const dispatch = useDispatch();

    const handleClearAll = () => {
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
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleClearAll}
                    style={styles.headerButton}>
                    <Icon name="clear-all" size={24} color="#017cffff" />
                </TouchableOpacity>
            ),
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const renderItem = ({ item }: { item: LocationItem }) => (
        <LocationItemView item={item} />
    );

    return (
        <View style={styles.container}>
            <NotificationHandler />
            <LocationTracker />
            <FlatList
                data={locations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
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
    }
});

export default UserLocationListScreen;