import {contactItem} from '../contact-items-componets/contact-items-componets.js';
import {profileComponent} from '../../settings/profileComponents/profileComponents.js';
import {chatBackgroundComponent} from '../../settings/chatBgColorComponents/chatBgColorComponents.js';
import {ContactBlockListComponent} from '../../settings/block-contact/contactBlockListComponents/contactBlockListComponents.js';
import {selectContactsGroupComponents} from '../addContactItemComponents/selectContactsGroupComponents/selectContactsGroupComponents.js';
import {chooseThemeComponent} from '../../settings/chooseThemeComponent/chooseThemeComponent.js';


export class ContactListComponent {
  data = {
    contacts: [],
  };

  constructor() {
    this.setHtml();

    app.dataService.onDataChangeSubject.subscribe((contactsList) => {
      this.data.contacts = contactsList;
      this.renderContactList();
    });

    this.subscription = app.dataService.onBlockChangeSubject.subscribe(() => {
      this.data.contacts = app.dataService.getActive();
      this.renderContactList();
    });
  }

  setHtml() {
    $.get("./components/contact/contactListComponents/contactListComponents.hbs",(result) => {
          this.template = Handlebars.compile(result);
          $(".left").html(this.template({ isDesktop: $( window ).width() > 600 }));

          app.dataService.getContactList();

          this.initEvents();
      }
    );
  }

  renderContactList() {
    $(".left .list").html("");
    this.data.contacts.forEach((contact) => {
      new contactItem(contact , $(".input .search-input").val());
    });
  }

  initEvents(){
    $(".search-input").on("input", (e) => {
      this.onSearchInputChange(e)
    });
    $(".settings").on("click" , (e) => {
      this.onSettingsClick(e)
    })
    $(".exit-btn").on("click" , (e) => {
      this.onExitBtnClick(e)
    })
    $(".settings-menu .profile").on("click" , (e) => {
      this.onProfileClick(e)
    })
    $(".item-bg").on("click" , (e) => {
      this.itemBgClick(e)
    })
    $(".item-blocked").on("click" , (e) => {
      this.onItemBlockClick(e)
    })
    $(".logo").on("click" , (e) => {
      this.onLogoBtnClick(e)
    })
    $(".add-conatct").on("click" , (e) => {
      this.onAddContactClick(e)
    })
    $(".item-choose-theme").on("click" , (e) => {
      this.onChooseThemeClick(e)
    })
  }
    
  //----------------------------------
  // onSearchInputChange
  //----------------------------------

  onSearchInputChange(e){
    app.dataService.fillterContactItem($(".inside-input .search-input").val());
  }

  //----------------------------------
  // onSettingsClick
  //----------------------------------

  onSettingsClick(e){
    $(".contactListHide").addClass("hide")
    $(".settings-menu").addClass("show");
  }

  //----------------------------------
  // onExitBtnClick
  //----------------------------------

  onExitBtnClick(e){
    $(".settings-menu").removeClass("show");
  }

  //----------------------------------
  // onProfileClick
  //----------------------------------

  onProfileClick(e){
    $(".profile-menu").addClass("show")
    new profileComponent();
  }

  //----------------------------------
  // itemBgClick
  //----------------------------------

  itemBgClick(e){
    $(".chat-Background").addClass("show");
    $(".right").addClass("hide");
    $(".message-wrap").removeClass("hide");
    new chatBackgroundComponent();
  }

  //----------------------------------
  // onItemBlockClick
  //----------------------------------

  onItemBlockClick(e){
    $(".contact-block-list").addClass("show")
    new ContactBlockListComponent(this.data.contacts);
  }

  //----------------------------------
  // onLogoBtnClick
  //----------------------------------

  onLogoBtnClick(e){
    $(".profile-menu").addClass("show");
    new profileComponent();
  }

  //----------------------------------
  // onAddContactClick
  //----------------------------------

  onAddContactClick(e){
    $(".select-contacts").addClass("show")
    new selectContactsGroupComponents(this.data.contacts);
  }

  //----------------------------------
  // onAddContactClick
  //----------------------------------

  onChooseThemeClick(e){
    new chooseThemeComponent()
    $(".choose-theme-dialog").addClass("show")
  }
}
