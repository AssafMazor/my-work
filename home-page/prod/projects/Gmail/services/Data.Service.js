const { Subject } = rxjs;

export class DataService {
    onDataChangeSubject =  new Subject();
    onSelectedItemQueueEvent =  new Subject();
    selectedItems = []
    data;

    constructor() {
        this.getDefaultData();
    }

    getDefaultData(){
        $.getJSON("./data/data-mail.json", (data) => {
            this.data = data;
        });
    }

    getMail(mailId){
        var fillterd = this.data.filter((item)=> {
            return item.id === mailId
        });
        return fillterd[0];
    }

    getMails(categoryType){
        if(!categoryType){
            categoryType = 1;
        }
        var fillterd = this.data.filter((obj)=> {
            return obj.category === categoryType && obj.sysLabel.includes(1) && !obj.sysLabel.includes(2)
        });

        this.onDataChangeSubject.next(fillterd);
        return fillterd
    }

    addNewMail(mail){
        this.data.push(mail);
        this.getMails(1)
        app.composeDialog = null
        $(".compose-dialog-wrap").addClass("hide");
    }

    toggleImportant(mailId){
        var mail = this.getMail(mailId);
        if(mail.sysLabel.includes(3)){
            mail.sysLabel = mail.sysLabel.filter((id) => {
                return id !== 3
            })
        }else {
            mail.sysLabel.push(3)
        }
    }

    fillterItems(inputVal){
        var fillterd = this.data.filter((item)=> {
            return item.email === inputVal
        });
        this.data = fillterd;
        this.onDataChangeSubject.next(this.data);
    }

    deleteMail(mailId , silent){
        var mail = this.getMail(parseInt(mailId));
        mail.sysLabel.push(2);
        if(!silent){
            this.getMails(1)
        }
    }

    getDeleted(){
        var fillterd = this.data.filter((obj)=> {
            return obj.sysLabel.includes(2);
        });
        this.onDataChangeSubject.next(fillterd);
    }

    getImportant(){
        var fillterd = this.data.filter((obj)=> {
            return !obj.sysLabel.includes(2) && obj.sysLabel.includes(3);
        }); 
        this.onDataChangeSubject.next(fillterd);
    }

    toggleSelectedItem(itemId){
        const found = this.selectedItems.find(objId => objId === parseInt(itemId));

        if(!found){
            this.addSelectedItem(parseInt(itemId));   
        }else {
            this.removeSelectedItem(parseInt(itemId));
        } 
    }

    addSelectedItem(itemId){
        const found = this.selectedItems.find(objId => objId === itemId);

        if(!found){
            this.selectedItems.push(itemId);

            this.onSelectedItemQueueEvent.next(this.selectedItems.length);
        }
    }

    removeSelectedItem(itemId){
        var fillterd = this.selectedItems.filter((objId)=> {
            return objId !== itemId
        });
        this.selectedItems = fillterd;
        
        this.onSelectedItemQueueEvent.next(this.selectedItems.length);
    }

    removeSelectedArray(){
        this.selectedItems.forEach((itemId)=>{
            this.deleteMail(itemId , "silent");
        });
        this.selectedItems = [];
        this.getMails(1)
    }

    markSelectedAsImportant(important){
        if(important){
            this.selectedItems.forEach((itemId)=>{
                var mail = this.getMail(itemId);
                if(!mail.sysLabel.includes(3)){
                    mail.sysLabel.push(3)
                }
            });
        }else {
        this.selectedItems.forEach((itemId)=>{
            var mail = this.getMail(itemId);
            mail.sysLabel = mail.sysLabel.filter((id) => {
                return id !== 3
            })
        });
        }
        this.getMails(1)
    }

    isItemSelected(itemId){
        const found = this.selectedItems.find( (objId) => {
            return objId === itemId;
        });
        return !! found;
    }

    createNewLabel(newLabelId){
        this.selectedItems.forEach(id => {
            let mail = this.getMail(parseInt(id));
            mail.labels.push(newLabelId)
        });
        this.getMails(1);
    }

    addMailLabel(chosenLabelId){
        this.selectedItems.forEach((id) => {
            let mail = this.getMail(parseInt(id));
            if(!mail.labels.includes(chosenLabelId[0])){
                mail.labels.push(chosenLabelId[0])
            }
        })
        this.getMails();
    }   

    getMailsLabel(id){
        var fillterd = this.data.filter((mail) => {
            return mail.labels.includes(id);
        })
        this.onDataChangeSubject.next(fillterd);
    }
}