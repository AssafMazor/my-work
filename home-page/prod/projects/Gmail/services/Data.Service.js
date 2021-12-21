
class DataService {
    onDataChangeQueueEvents = [];
    onSelectedItemQueueEvent = [];
    selectedItems = [];
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
            return item.id == mailId
        });
        return fillterd[0];
    }

    getMails(categoryType){
        if(!categoryType){
            categoryType = 1;
        }
        var fillterd = this.data.filter((obj)=> {
            return obj.category === categoryType && !obj.isDeleted
        });
        this.onDataChangeQueueEvents.forEach((fn)=>{
            fn(fillterd);
        })
    }

    addNewMail(mail){
        this.data.push(mail);
        this.getMails(1)
        app.composeDialog = null
        $(".compose-dialog-wrap").addClass("hide");
    }

    toggleImportant(mailId){
        var mail = this.getMail(mailId);
        mail.isImportant = !mail.isImportant;
    }

    fillterItems(inputVal){
        var fillterd = this.data.filter((item)=> {
            return item.email === inputVal
        });
        this.data = fillterd;
        this.onDataChangeQueueEvents.forEach((fn)=>{
            fn(this.data);
        })
    }

    deleteMail(mailId){
        var mail = this.getMail(mailId);
        mail.isDeleted = true;

        this.getMails();
    }

    getDeleted(){
        var fillterd = this.data.filter((obj)=> {
            return obj.isDeleted === true
        });
        this.onDataChangeQueueEvents.forEach((fn)=>{
            fn(fillterd);
        })
    }

    getImportant(){
        var fillterd = this.data.filter((obj)=> {
            return obj.isDeleted === false && obj.isImportant === true
        });
        this.onDataChangeQueueEvents.forEach((fn)=>{
            fn(fillterd);
        })
    }

    toggleSelectedItem(itemId){

        const found = this.selectedItems.find(objId => objId === itemId);

        if(!found){
            this.addSelectedItem(itemId);
        }else {
            this.removeSelectedItem(itemId);
        } 
    }

    addSelectedItem(itemId){
        const found = this.selectedItems.find(objId => objId === itemId);

        if(!found){
            this.selectedItems.push(itemId);

            this.onSelectedItemQueueEvent.forEach((fn)=>{
                fn(this.selectedItems.length);
            })
        }
    }

    removeSelectedItem(itemId){
        var fillterd = this.selectedItems.filter((objId)=> {
            return objId !== itemId
        });
        this.selectedItems = fillterd;

        this.onSelectedItemQueueEvent.forEach((fn)=>{
            fn(this.selectedItems.length);
        });
    }

    removeSelectedArray(){

        this.selectedItems.forEach((itemId)=>{
            this.deleteMail(itemId);
        });
        this.selectedItems = [];
        app.dataService.getMails();
    }

    markSelectedAsImportant(important){
        this.selectedItems.forEach((itemId)=>{
            var mail = this.getMail(itemId);
            mail.isImportant = important
        });
        app.dataService.getMails();
    }

    isItemSelected(itemId){
        const found = this.selectedItems.find( (objId) => {
            return objId === itemId;
        });
        return !! found;
    }


}