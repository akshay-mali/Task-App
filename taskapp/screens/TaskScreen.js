import React from 'react';
import { Text, View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

function TaskScreen({ route, navigation }) {

    const { color, title, totalTasks, totalCompleted, iconName } = route.params;

    const DATA = [
        {
            title: 'Late',
            data: [{ title: 'Call max', date: 'April 29', time: '20:15' }],
        },
        {
            title: 'Today',
            data: [
            { title: 'Get Up', date: 'Feb 23', time: '6:15' },
            { title: 'Do UI practice', date: 'Feb 23', time: '11:00' },
            { title: 'Learn React Native', date: 'Feb 23', time: '15:30' },
            ],
        },
        {
            title: 'Tomorrow',
            data: [
            { title: 'Attend IVP class', date: 'Feb  24', time: '10:00' },
            { title: 'Study LP', date: 'Feb 24', time: '16:10' },
            ],
        },
        {
            title: 'This Week',
            data: [
            { title: 'Complete CN Assignment', date: 'Feb 27', time: '19:15' },
            ],
        },
    ];

    const ListItem = ({ item }) => (
        <View style={styles.listItem}>
          <View>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDue}>{item.time + ' - ' + item.date}</Text>
          </View>
          <View style={styles.checkboxNotSelected}></View>
        </View>
    );
    
    const SectionHeader = ({ title }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={{...styles.screenContainer, backgroundColor: color}}>
            <View style={styles.upperContainer}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
                    <View style={styles.gobackBtn}>
                        <Feather name="arrow-left" size={28} color="#ffffff" />
                    </View>
                </TouchableOpacity>
                <View style={{...styles.categoryIconBox}}>
                    <Feather name={iconName} size={24} color={color} />
                </View>
                <Text style={styles.categoryName} >{title}</Text>
                <Text style={styles.categoryTotalTasks}>{totalTasks} Tasks</Text>
                <Text style={styles.categoryTotalCompleted}>{totalCompleted} Completed</Text>
            </View>
            <View style={styles.listContainer}>
                <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <ListItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <SectionHeader title={title} />
                )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    listItem: {
        paddingVertical: 4,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    sectionHeader: {
        fontSize: 16,
        color: '#C2C2C2',
        marginBottom: 8,
        marginTop: 16,
        fontWeight: '500',
    },
    taskTitle: {
        fontSize: 16,
        color: '#444444',
        fontWeight: 'bold',
    },
    taskDue: {
        fontSize: 14,
        color: '#ADADAD',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    upperContainer: {
        paddingHorizontal : 24,
        paddingTop: 24,
    },
    categoryIconBox : {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryName : {
        color : '#fff',
        fontSize : 26,
        fontWeight : 'bold'
    },
    categoryTotalTasks : {
        fontSize: 16,
        color: '#EBFBF9',
    },
    categoryTotalCompleted : {
        fontSize: 16,
        color: '#EBFBF9',
        marginBottom: 24
    },
    checkboxNotSelected: {
        height: 20,
        width: 20,
        borderColor: '#E5E5E5',
        borderWidth: 2,
        borderRadius: 4
    },
    checkboxSelected: {
        height: 20,
        width: 20,
        backgroundColor: '#5886FE',
        borderWidth: 0,
        borderRadius: 4
    },
    gobackBtn: {
        marginBottom: 24,
    }
})

export default TaskScreen
