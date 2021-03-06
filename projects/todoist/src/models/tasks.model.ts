import { ITask } from '@interfaces/tasks.interface';

// password: password
const TaskModel: ITask[] = [
    {
        "name":"shaul",
        "title":"hgfh",
        "parentId": "-1",
        "isToday":false,
        "sentTime":1643010558000,
        "labels":["1" , "2"],
        "isfinished":false,
        "priority":4,
        "category":1,
        "id":"1642922816964",
        "children":["163880052700"],
        "sectionId":"-1"
    },
    {
        "name":"tutu",
        "title":"hgfh",
        "parentId": "1642922816964",
        "isToday":false,
        "sentTime":1642853681000,
        "labels":["1"],
        "isfinished":false,
        "priority":2,
        "category":1,
        "id":"163880052700",
        "children":["56375678345"],
        "sectionId":"-1"
    },
    {
        "name":"titi",
        "title":"hgfh",
        "parentId": "163880052700",
        "isToday":false,
        "sentTime":1642284000000,
        "labels":["1" , "2"],
        "isfinished":false,
        "priority":4,
        "category":1,
        "id":"56375678345",
        "children":[],
        "sectionId":"-1"
    },
    {
        "name":"assaf",
        "title":"hgfh",
        "parentId": "1686885756",
        "isToday":false,
        "sentTime":1642024800000,
        "labels":["2"],
        "isfinished":false,
        "priority":4,
        "category":1,
        "id":"565464654654",
        "children":[],
        "sectionId":"1642833842000"
    },
    {
        "name":"hilla",
        "title":"hgfh",
        "parentId": "-1",
        "isToday":false,
        "sentTime":1641765600000,
        "labels":["2"],
        "isfinished":false,
        "priority":4,
        "category":1,
        "id":"1686885756",
        "children":["565464654654"],
        "sectionId":"1642833842000"
    }
];

export default TaskModel;
