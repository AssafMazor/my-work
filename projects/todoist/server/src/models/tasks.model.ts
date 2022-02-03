import { ITaskItem } from '@interfaces/tasks.interface';

const taskModel: ITaskItem[] = [
    {
        userId:"88",
        taskId:"123",
        data:{
            name: "assaf",    
            title:"mazor",
            parentId:"-1",
            isToday:false,
            sentTime:new Date().getTime(),
            labels:["1"],
            isfinished:false,
            priority:1,
            category:1,
            children:[],
            sectionId:"-1"
        }
    }
];

export default taskModel;
