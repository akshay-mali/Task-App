import React, {useState} from 'react';
import {View, Button, Platform, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import uuid from 'react-native-uuid';

import realm from '../components/realm';

function NewTaskScreen({ navigation }) {
    // DateTime Picker
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset())
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const categories = realm.objects('Category');

    // Dropdown Picker
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([
        {label: 'Home', value: 'Home'},
        {label: 'Studies', value: 'Studies'},
        {label: 'Work', value: 'Work'},
        {label: 'Shoping', value: 'Shoping'}
    ]);

    // Input States
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    
    const handleCreateTask = () => {
        const newTask = {
            _id: uuid.v4(),
            title: title,
            note: note,
            date: date,
            category: category,
            done: false 
        }
        realm.write(() => {
            realm.create('Task', newTask);
            categories.filtered('title == "' + category + '"')[0].totalTasks += 1;
            categories.filtered('title == "All Tasks"')[0].totalTasks += 1;

        })
        navigation.goBack();
    }


    return (
        <View style={styles.screenContainer}>
            <View style={styles.upperContainer}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}> 
                    <View style={styles.cancleBtn}><Feather name="arrow-left" size={28} color="#222" /></View>
                </TouchableOpacity>
                <Text style={styles.addNoteText}>Add Note</Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Title</Text>
                <View style={styles.titleInputContainer}>
                    <TextInput
                        placeholder='Write the title'
                        placeholderTextColor='#c2c6c3'
                        onChangeText={text => setTitle(text)}
                        defaultValue={title}
                    />
                </View>
                <Text style={styles.inputLabel}>Note</Text>
                <View style={styles.noteInputContainer}>
                    <TextInput
                        placeholder='Write a note for the future you'
                        placeholderTextColor='#c2c6c3'
                        multiline={true}
                        style={{textAlignVertical: "top"}}
                        onChangeText={text => setNote(text)}
                        defaultValue={note}
                    />
                </View>
                <Text style={styles.inputLabel}>Category</Text>
                <DropDownPicker
                    open={open}
                    value={category}
                    items={items}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setItems}
                    style={{marginBottom: 14}}
                />
                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.pickerContainer}>
                    {/* <Button 
                        onPress={showDatepicker} 
                        title=" Select date " 
                        color='#333'
                    /> */}
                    <TouchableOpacity onPress={showDatepicker}>
                        <View style={styles.pickerButton}>
                            <Text style={{color: '#fff'}}>Select Date</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.pickerText}>{date.toISOString().slice(0, 10)}</Text>
                </View>
                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.pickerContainer}>
                    {/* <Button 
                        onPress={showTimepicker} 
                        title=" Select time " 
                        color='#333'
                    /> */}
                    <TouchableOpacity onPress={showTimepicker}>
                        <View style={styles.pickerButton}>
                            <Text style={{color: '#fff'}}>Select Time</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.pickerText}>{date.toISOString().slice(11,16)}</Text>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <View style={styles.addTaskBtnContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleCreateTask}>
                    <View style={styles.addTaskBtn}><Text style={{color: '#fff', fontSize: 20}}>Save</Text></View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingTop: 24,
        backgroundColor: '#ffffff'
    },
    upperContainer: {
        paddingHorizontal: 24
    },
    cancleBtn: {
        height: 28,
        width: 28,
        marginBottom: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addNoteText: {
        fontSize: 22,
        color: '#222',
        fontWeight: 'bold',
        marginBottom: 16
    },
    formContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8
    },
    titleInputContainer: {
        height: 48,
        backgroundColor: '#f4f5f4',
        borderRadius: 16,
        paddingHorizontal: 12,
        justifyContent: 'center',
        marginBottom: 14
    },
    noteInputContainer: {
        height: 74,
        backgroundColor: '#f4f5f4',
        borderRadius: 16,
        paddingHorizontal: 12,
        marginBottom: 14
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14
    },
    pickerButton: {
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4
        
    },
    pickerText: {
        marginLeft: 12,
        color: '#445'
    },
    addTaskBtnContainer:{
        position: 'absolute',
        bottom: 40,
        right: 24,
    },
    addTaskBtn : {
        height: 52,
        paddingHorizontal: 32,
        borderRadius: 32,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#385882',
    }
})

export default NewTaskScreen
