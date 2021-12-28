const { Subject } = rxjs;

let inbox = {
    "name":"inbox",
    id:1
}

let bin = {
    name:"bin",
    "id":2
}

let important = {
    "name":"important",
    id:3
}

const sysLables = {
    1:inbox,
    2:bin,
    3:important
}

export class LabelsService {
    onLabelChangeSubjectEvents = new Subject();
    labels;

    constructor() {
        this.getLabelsArray() 
    }

    getLabelsArray() {
        if(!this.labels) {
        $.getJSON("./data/labels.json", (labels) => {
            this.labels = labels;
            this.getLabels()
        });
        }else {
            this.getLabels()
        }
    }

    getLabels(){
        this.onLabelChangeSubjectEvents.next(this.labels);
    }

    createNewLabel(newLabel){
        this.labels.push(newLabel)
        this.getLabels()
    }

    getMailLabels(labelId){
        return this.labels.filter((label) => {
            return label.id === labelId
        })
    }

    isLabelNameExist(LabelName){
        let fillterd = this.labels.filter((label) => {
            return label.name === LabelName
        })
        return fillterd
    }
}