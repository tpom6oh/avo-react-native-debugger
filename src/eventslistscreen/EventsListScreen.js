import React from 'react';
import { View, FlatList, BackHandler, Image, TouchableOpacity } from 'react-native';
import { Component } from 'react';
import RootSiblings from 'react-native-root-siblings';
import PropTypes from 'prop-types';
import EventsListItem from './EventListItem';
import { images } from '../images';
import { topOffset, eventsHaveErrors } from '../utils';
import { styles } from './EventsListScreenStyles';
import { baseStyles } from '../BaseStyles';

export default class EventsListScreen extends Component {

    static logScreen = null;

    static toggleDebuggerLogScreen = (items, newItemsCount) => {
        if (EventsListScreen.logScreen == null) {
            EventsListScreen.logScreen = new RootSiblings(<EventsListScreen items={items} newItemsCount={newItemsCount} />);
        } else {
            EventsListScreen.logScreen.destroy();
            EventsListScreen.logScreen = null;
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        EventsListScreen.toggleDebuggerLogScreen();
        return true;
    }

    listRow = ({ item }) => (<EventsListItem item={item} expended={
        this.props.items[0] === item || eventsHaveErrors([item])
    } />);

    render() {
        return <View style={[styles.screenContainer, { marginTop: topOffset() }]}>
            <View style={styles.avoLabelContainer}>
                <Image source={images.avo_logo} />
                <TouchableOpacity style={styles.closeButtonTouchableArea}
                    onPress={() => {
                        EventsListScreen.toggleDebuggerLogScreen();
                    }} >
                    <Image style={styles.closeButton}
                        source={images.close_button}
                    />
                </TouchableOpacity>
            </View>
            <View style={baseStyles.divider} />

            <FlatList 
                style={styles.list}
                data={this.props.items.sort((a, b) => a.timestamp < b.timestamp)}
                renderItem={this.listRow}
            />
        </View>
    }
}

EventsListScreen.propTypes = {
    items: PropTypes.arrayOf(PropTypes.exact({
        key: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        messages: PropTypes.arrayOf(
            PropTypes.exact({
                propertyId: PropTypes.string.isRequired,
                message: PropTypes.string.isRequired,
                allowedTypes: PropTypes.arrayOf(PropTypes.string),
                providedType: PropTypes.string.isRequired
            })
        ),
        eventProps: PropTypes.arrayOf(PropTypes.exact({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })),
        userProps: PropTypes.arrayOf(PropTypes.exact({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        }))
    })),
    newItemsCount: PropTypes.number.isRequired,
}
