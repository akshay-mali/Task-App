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

export default new Realm({schema: [Category]});