'use strict';
//表单验证常用方法集合
        function FormValidate(){

        }
        FormValidate.prototype.setArg=function(arg){
            this.arg=arg;
        };
        FormValidate.prototype.IsNull=function(obj){
            if(!obj){
                return true;
            }
        };
        FormValidate.prototype.IsPhone=function(num){
            if(!/^1\d{10}$/i.test(num)){
                return true;
            }
        };
        FormValidate.prototype.IsBankNum=function(num){
            if(!/^(\d{16}|\d{19})$/.test(num)){
                return true;
            }
        };
        FormValidate.prototype.getArg=function(){
            return this.arg;
        };

        var fv=new FormValidate();



