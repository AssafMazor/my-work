const { Subject } = rxjs;

export class DataService {
  onDataChangeSubject = new Subject();
  onMessageChangeSubject = new Subject();
  onBlockChangeSubject = new Subject();
  contactList;
  messageList = {};
  blockList;

  constructor() {
    this.getContactList();
  }

  getContactList() {
    if(!this.contactList) {
      $.getJSON("./data/groups.json", (data) => {
        this.contactList = data;
        this.activeContactList = this.getActive();
        this.onDataChangeSubject.next(this.activeContactList);
      });
    } else {
      this.activeContactList = this.getActive();
      this.onDataChangeSubject.next(this.contactList);
    }
  }

  getActive(){
    var fillterd = this.contactList.filter((item)=> {
      return !item.isBlocked
    });
    return fillterd;
  }

  getBlocked(){
    debugger;
    var fillterd = this.contactList.filter((item)=> {
      return item.isBlocked
    });
    return fillterd;
  }

  getMessageList(id) {
    if(this.messageList[id]){
      this.onMessageChangeSubject.next({
        messages:this.messageList[id], 
        id:id
      })
    }else {
      $.getJSON(`./data/history-messages_${id}.json`, (data) => {
        this.messageList[id] = data;
        this.onMessageChangeSubject.next({
          messages:this.messageList[id], 
          id:id
        })
      }); 
    }
  }
  
  getContactBlockList(){
    $.getJSON("./data/groups.json", (data) => {
      var fillterd = data.filter((item)=> {
        return item.isBlocked === true
      });
      this.blockList = fillterd;
      this.onBlockChangeSubject.next(this.blockList);
    });
  }

  getContact(contactId){
    var fillterd = this.contactList.filter((contact)=> {
      return contact.id === contactId
    });
    return fillterd[0];
  }

  fillterContactItem(inputVal){
    var fillterd = this.contactList.filter((item)=> {
      return item.name.includes(inputVal) 
    });

    this.onDataChangeSubject.next(fillterd);
  }

  addNewMessage(message , userId){
      this.messageList[userId].push(message);
      this.onMessageChangeSubject.next({
        messages:this.messageList[userId], 
        id:userId
      })
  }

  fillterMessageHistory(inputVal , userId){
    var fillterd = this.messageList[userId].filter((item)=> {
      return item.content.includes(inputVal)
    });

    return fillterd;
  }

  setBlockItem(contactId){
    var contact = this.getContact(contactId);
    contact.isBlocked = !contact.isBlocked 
    this.onBlockChangeSubject.next();
  }

  clearChat(userId){
    this.messageList[userId] = []
    this.onMessageChangeSubject.next({
      messages:this.messageList[userId], 
      id:userId
    })
  }

  deleteChat(userId){
    let contact = this.getContact(userId);

    if(contact.groups){
      contact.groups.forEach((groupId) => {
        this.removeContactFromGroups(contact.id ,groupId);
      })
    }
    
    this.contactList = this.contactList.filter((obj) => {
      return obj.id !== contact.id
    })

    delete this.messageList[userId];

    this.onMessageChangeSubject.next({messages:null});
    this.onDataChangeSubject.next(this.contactList);
  }

  exitGroup(userId){
    var contact = this.getContact(userId);
    contact.isExit = true

    this.messageList[userId].isExit = true

    this.onMessageChangeSubject.next({
      messages:this.messageList[userId], 
      id:userId
    })
  }

  addNewContact(contact){
    this.contactList.push(contact);
    this.onBlockChangeSubject.next(this.contactList);
  }

  getContactMembers(id){
    let obj = this.getContact(id);
    let res = []

    obj.members.forEach((id) => {
      res.push(this.getContact(id));
    }) 
    
    return res;
  }

  removeContactFromGroups(contactId , groupId){
    let group = this.getContact(groupId);

    group.members = group.members.filter((id)=> {
      return id !== contactId;
    });
  }
}
