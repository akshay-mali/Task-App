import React, { useEffect, useState } from 'react';
import { ScrollView ,View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;

import realm from '../components/realm';

const CategoryCard = (cardInfo, index, navigation) => {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Tasks', cardInfo)} key={index}>
            <View style={{...styles.categoryCardCotainer, width: (windowWidth - 48)/2}}>
                <View style={{...styles.categoryCardIconBox, backgroundColor: cardInfo.color}}>
                    <Feather name={cardInfo.iconName} size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryCardTitle}>{cardInfo.title}</Text>
                <Text style={styles.categoryCardTotalTasks}>{cardInfo.totalTasks} Tasks</Text>
                <Text style={styles.categoryCardTotalCompleted}>{cardInfo.totalCompleted} Completed</Text>
            </View>
        </TouchableOpacity>
    )
}

function HomeScreen({ navigation }) {
    const categories = realm.objects('Category');
    const tasks = realm.objects('Task');

    const [categoryList, setCategoryList] = useState([])

    const cat = [
        {
            color: '#78E3D5',
            title: 'All Tasks',
            totalTasks: 0,
            totalCompleted: 0,
            iconName: 'list'
        },
        {
            color: '#789CE3',
            title: 'Home',
            totalTasks: 0,
            totalCompleted: 0,
            iconName: 'home'
        },
        {
            color: '#E6CE6A',
            title: 'Studies',
            totalTasks: 0,
            totalCompleted: 0,
            iconName: 'book'
        },
        {
            color: '#DE87EB',
            title: 'Work',
            totalTasks: 0,
            totalCompleted: 0,
            iconName: 'briefcase'
        },
        {
            color: '#B1EB77',
            title: 'Shoping',
            totalTasks: 0,
            totalCompleted: 0,
            iconName: 'shopping-bag'
        },
    ]

    useEffect(() => {

        if(categories.length < 1){
            realm.write(() => {
                cat.forEach(category => {
                    realm.create('Category', category);
                })
            })
        }

        realm.write(() => {
            categories.forEach(category => {
                if(category.title === "All Tasks"){
                    category.totalTasks = tasks.length;
                    category.totalCompleted = tasks.filtered("done == true").length;
                }else{
                    let catTask = tasks.filtered("category == '" + category.title + "'");
                    category.totalTasks = catTask.length;
                    category.totalCompleted = catTask.filtered("done == true").length;
                }
            })
        })

        setCategoryList([...categories]);
        categories.addListener(() => {
            setCategoryList([...categories]);
        })

        // realm.write(()=> {

        //     realm.deleteAll();
        // })
        return ()=>{
            categories.removeAllListeners()
        }
    }, [])

    return (
        <View style={styles.screenContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {/* <View style={styles.headerContainer}>
                    <View style={styles.profileIcon}></View>
                </View> */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome</Text>
                    <Text style={styles.usernameText}>Akshay</Text>
                </View>
                <View style={styles.categoriesContainer}>
                    {
                        categoryList.map((categoryInfo, index) => CategoryCard(categoryInfo, index, navigation))
                    }
                </View>
            </ScrollView>
            <View style={styles.newTaskBtnContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('NewTask')}>
                    <View style={styles.newTaskBtn}><Feather name="plus" size={28} color="#FFFFFF" /></View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer : {
        backgroundColor: '#FCFCFD',
        flex: 1,
    },
    scrollViewContainer : {
        paddingVertical: 24,
        paddingHorizontal: 8,
    },
    headerContainer : {
        height: 52,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    profileIcon : {
        height: 40,
        width: 40,
        backgroundColor: '#7AA9EF',
        borderRadius: 20,
    },
    welcomeContainer : {
        paddingVertical: 16,
        paddingHorizontal: 8
    },
    welcomeText : {
        fontSize: 18,
        color: '#848484'
    },
    usernameText : {
        fontSize: 32,
        color: '#141414',
        fontWeight: 'bold'
    },
    categoriesContainer : {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    categoryCardCotainer : {
        backgroundColor : '#fff',
        padding: 20,
        borderRadius: 24,
        shadowColor: '#385882',
        shadowOffset: {width:0, height:2},
        shadowOpacity: 8,
        shadowRadius: 12,
        elevation: 8,
        margin: 8,
    },
    categoryCardIconBox : {
        height: 44,
        width: 44,
        borderRadius: 22,
        backgroundColor: '#78E3D5',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryCardTitle : {
        fontSize: 20,
        color: '#141414',
        fontWeight: '700',
        marginBottom: 2
    },
    categoryCardTotalTasks : {
        fontSize: 12,
        color: '#A5A5A5'
    },
    categoryCardTotalCompleted : {
        fontSize: 12,
        color: '#A5A5A5',
        marginBottom: 8
    },
    newTaskBtnContainer:{
        position: 'absolute',
        bottom: 40,
        right: 40,
    },
    newTaskBtn : {
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: '#0D0D0D',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 20
    }
})

export default HomeScreen
