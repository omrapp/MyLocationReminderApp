import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useDispatch } from "react-redux";
import { LocationItem } from "../types/LocationItem";
import { deleteLocation, updateLocation } from "../slices/locationSlice";
import { openMapWithCoordinates } from "../utils/Utils";

const LocationItemView = ({ item }: { item: LocationItem }) => {

    const dispatch = useDispatch();

    const [editingItem, setEditingItem] = useState<LocationItem | null>(null);
    const [editedLatitude, setEditedLatitude] = useState('');
    const [editedLongitude, setEditedLongitude] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Location",
            "Are you sure you want to delete this location?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        dispatch(deleteLocation(id));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleEdit = (item: LocationItem) => {
        setEditingItem(item);
        setEditedLatitude(item.latitude.toString());
        setEditedLongitude(item.longitude.toString());
        setEditModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (!editingItem) return;

        const latitude = parseFloat(editedLatitude);
        const longitude = parseFloat(editedLongitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for latitude and longitude');
            return;
        }

        if (latitude < -90 || latitude > 90) {
            Alert.alert('Invalid Latitude', 'Latitude must be between -90 and 90');
            return;
        }

        if (longitude < -180 || longitude > 180) {
            Alert.alert('Invalid Longitude', 'Longitude must be between -180 and 180');
            return;
        }

        dispatch(updateLocation({
            ...editingItem,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        }));

        setEditModalVisible(false);
        setEditingItem(null);
    };

    const handleOpen = (item: LocationItem) => {
        openMapWithCoordinates(item.latitude, item.longitude);
    };

    const handleShare = async (item: LocationItem) => {
        try {
            await Share.share({
                message: `Check out this location: ${item.location}`,
                title: item.location,
            });
        } catch (error) {
            Alert.alert("Error", "Failed to share location " + error);
        }
    };

    return (
        <View style={styles.item}>
            <TouchableOpacity
                style={styles.titleContainer}
                onPress={() => handleOpen(item)}
            >
                <Text>Latitude: {item.latitude.toFixed(4)}</Text>
                <Text>Longitude: {item.longitude.toFixed(4)}</Text>
                <Text>Timestamp: {item.timestamp}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={styles.actionButton}
                >
                    <Icon name="edit" size={24} color="#111212ff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleShare(item)}
                    style={styles.actionButton}
                >
                    <Icon name="share" size={24} color="#111212ff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.actionButton}
                >
                    <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Location</Text>

                        <Text style={styles.inputLabel}>Latitude</Text>
                        <TextInput
                            style={styles.input}
                            value={editedLatitude}
                            onChangeText={setEditedLatitude}
                            keyboardType="numeric"
                            placeholder="Enter latitude"
                        />

                        <Text style={styles.inputLabel}>Longitude</Text>
                        <TextInput
                            style={styles.input}
                            value={editedLongitude}
                            onChangeText={setEditedLongitude}
                            keyboardType="numeric"
                            placeholder="Enter longitude"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                style={[styles.modalButton, styles.saveButton]}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

};


const styles = StyleSheet.create({
    headerButton: {
        marginRight: 16,
        padding: 8,
    },
    listContainer: {
        paddingVertical: 10,
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#999',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});


export default LocationItemView;