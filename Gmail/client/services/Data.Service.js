
class DataService {
    onDataChangeQueueEvents = [];
    data;

    constructor() {
        this.getDefaultData();
    }


    getDefaultData(){
        $.getJSON("./data/data-mail.json", (data) => {
            this.data = data;
        });
    }

    search(val){
        this.next(val)
    }

    getMail(mailId){
        var fillterd = this.data.filter((item)=> {
            return item.id == mailId
        });
        return fillterd[0];
    }

    getMails(){
        return this.data;
    }

    addNewMail(mail){
        this.data.push(mail)
        this.onDataChangeQueueEvents.forEach((fn)=>{
            fn();
        })
        
    }

    toggleImportant(mailId){
        var mail = this.getMail(mailId);
        mail.isImportant = !mail.isImportant;
    }


}