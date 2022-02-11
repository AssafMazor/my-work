import $ from 'jquery';
import '../login/login-component.scss';
const signUpTemplate = require('../login/login-component.hbs');

export class LoginComponent {
    private $el:any;

    constructor(){
      this.setHtml();
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(signUpTemplate({}));

      $(".main").html(this.$el);

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".login-button").on("click",(e)=>{
        this.onLoginBtnClick(e);
      });
      this.$el.find(".email-input").on("input",(e)=>{
        this.onEmailInputChange(e);
      })
    }

    //----------------------------------
    // onSignUpBtnClick
    //----------------------------------

    onLoginBtnClick(e){
      if(this.isMailCorrect()){
        let user = {
          email:this.$el.find(".email-input").val(),
          password:this.$el.find(".password-input").val()
        }
        $.ajax({
          type: "POST",
          url: 'http://localhost:3000/login',
          data:{
            data:JSON.stringify(user),
          },
          success: (result) => {
            window.localStorage.setItem('userId',result.id);
            window.localStorage.setItem('isLoggin','true');
            window.location.replace('http://localhost:4000');
          },
          error: () => {
              return;
          }
        });
      }else {
        this.$el.find(".error-message").removeClass("hide")
      }
    }

    //----------------------------------
    // isMailCorrect
    //----------------------------------

    isMailCorrect(){
      const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

      if(!regex.test(this.$el.find(".email-input").val())){
          return false
      }
      return true
    }

    //----------------------------------
    // onEmailInputChange
    //----------------------------------

    onEmailInputChange(e){
      this.$el.find(".error-message").addClass("hide")
    }
}