import Realm from 'realm';

class Category extends Realm.Object {}
Category.schema = {
    name: 'Category',
    properties: {
        color: 'string',
        title: 'string',
        totalTasks: 'int',
        totalCompleted: 'int',
        iconName: 'string'
    },
};

class Task extends Realm.Object {}
Task.schema = {
    name: 'Task',
    properties: {
        _id: 'string',
        title: 'string',
        note: 'string',
        date: 'date',
        category: 'string',
        done: {type:'bool', default:false}
    },
};

export default new Realm({schema: [Category, Task]});