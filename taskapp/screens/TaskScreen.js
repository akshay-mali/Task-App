import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import realm from '../components/realm';

function TaskScreen({ route, navigation }) {
    const { color, title, totalTasks, totalCompleted, iconName } = route.params;

    const tasks = realm.objects('Task');
    const categoryTasks = title==="All Tasks" ? tasks : tasks.filtered("category == '" + title + "'");

    const [categoryTasksList, setCategoryTasksList] = useState([]);

    useEffect(() => {
        setCategoryTasksList([...categoryTasks]);
        categoryTasks.addListener(() => {
            setCategoryTasksList([...categoryTasks]);
        })

        return () => {
            categoryTasks.removeAllListeners();
        }
    }, [])

    const today = new Date();
    today.setHours(0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTom = new Date(today);
    dayAfterTom.setDate(dayAfterTom.getDate() + 2);
    const withinWeek = new Date(today);
    withinWeek.setDate(withinWeek.getDate() + 7);

    const DATA = [
        {
            title: 'Late',
            data: [],
        },
        {
            title: 'Today',
            data: [],
        },
        {
            title: 'Tomorrow',
            data: [],
        },
        {
            title: 'Within a week',
            data: [],
        },
        {
            title: 'Latter',
            data: [],
        },
    ];

    categoryTasksList.forEach(task => {
        if(task.date < today){
            DATA[0].data.push(task);
        }else if(task.date < tomorrow){
            DATA[1].data.push(task)
        }else if(task.date < dayAfterTom){
            DATA[2].data.push(task);
        }else if(task.date < withinWeek){
            DATA[3].data.push(task);
        }else{
            DATA[4].data.push(task);
        }
    })

    const categories = realm.objects('Category');
    const handleCheckbox =  (id) => {
        const currentTask = tasks.filtered('_id = "' + id + '"')[0];
        realm.write(()=> {
            if(currentTask.done){
                if(title !== 'All Tasks'){
                    categories.filtered('title == "' + title + '"')[0].totalCompleted -= 1;
                }
                categories.filtered('title == "All Tasks"')[0].totalCompleted -= 1;
            }else{
                if(title !== 'All Tasks'){
                    categories.filtered('title == "' + title + '"')[0].totalCompleted += 1;
                }
                categories.filtered('title == "All Tasks"')[0].totalCompleted += 1;
            }
            currentTask.done = !currentTask.done;
        })
    }

    const ListItem = ({ item }) => {

        const handleDelete = () => {
            const currentTask = tasks.filtered('_id = "' + item._id + '"')[0];
            realm.write(()=> {
                if(currentTask.done){
                    if(title !== 'All Tasks'){
                        categories.filtered('title == "' + title + '"')[0].totalCompleted -= 1;
                    }
                    categories.filtered('title == "All Tasks"')[0].totalCompleted -= 1;
                }
                if(title !== 'All Tasks'){
                    categories.filtered('title == "' + title + '"')[0].totalTasks -= 1;
                }
                categories.filtered('title == "All Tasks"')[0].totalTasks -= 1;
                realm.delete(currentTask);
            })
        };

        const reghtSwipe = () => {
            return (
            <TouchableOpacity onPress={handleDelete} activeOpacity={0.6}>
                <View style={styles.deleteBox}>
                <Text style={{color:'#fff'}}>
                    Delete
                </Text>
                </View>
            </TouchableOpacity>
            );
        };

        return (
            <Swipeable renderRightActions={reghtSwipe}>
                <View style={styles.listItem}>
                <View>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskDue}>{item.date.toISOString()}</Text>
                </View>
                <TouchableOpacity onPress={() => {handleCheckbox(item._id)}}>
                    <View style={item.done ? {...styles.checkboxSelected, backgroundColor: color} : styles.checkboxNotSelected}></View>
                </TouchableOpacity>
                </View>
            </Swipeable>
        )
    };
    
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
        paddingTop: 4,
        paddingBottom: 8,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    sectionHeader: {
        fontSize: 16,
        color: '#C2C2C2',
        marginBottom: 8,
        marginTop: 16,
        fontWeight: '600',
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
        paddingTop: 16,
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
        backgroundColor: '#333',
        borderWidth: 0,
        borderRadius: 4
    },
    gobackBtn: {
        marginBottom: 24,
    },
    deleteBox: {
        backgroundColor: '#fa3456',
        width: 64,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default TaskScreen
