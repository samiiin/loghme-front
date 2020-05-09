import React from "react";
import ReactDOM from 'react-dom';
import '../css/signup.css'
import {Login} from "./Login";
import pageImage from "../images/3.jpg";
import {BrowserRouter, Redirect} from "react-router-dom";
import {Home} from './Home'

export function validateUserName(str){
    var errors = "";

    if(str.length < 4){
        errors = errors.concat("طول نام کاربری حداقل 4 باشد.")
        errors = errors.concat("\n");
    }
    return errors;
}

export function validateName(str) {
    var errors = "";
    var p = /^[\u0600-\u06ff\s]+$|[\u0750-\u077f\s]+$|[\ufb50-\ufc3f\s]+$|[\ufe70-\ufefc\s]+$|[\u06cc\s]+$|[\u067e\s]+$|[\u06af\s]$|[\u0691\s]+$|^$/;
    if(!p.test(str)){
        errors = errors.concat("نام وارد شده معتبر نیست.");
        errors = errors.concat("\n");
    }

    return errors;

}

export function validateLastName(str) {
    var errors = "";
    var p = /^[\u0600-\u06ff\s]+$|[\u0750-\u077f\s]+$|[\ufb50-\ufc3f\s]+$|[\ufe70-\ufefc\s]+$|[\u06cc\s]+$|[\u067e\s]+$|[\u06af\s]$|[\u0691\s]+$|^$/;
    if(!p.test(str)){
        errors = errors.concat("نام خانوادگی وارد شده معتبر نیست.");
        errors = errors.concat("\n");
    }

    return errors;

}

export function validatePassword(pass,secpass) {
    var errors ="";
    var passw = /^(?=.*\d)(?=.*[a-zA-Z\u0600-\u06FF\s]).{6,20}$/;
    if(!pass.match(passw)){
        errors = errors.concat("رمز عبور باید حداقل شامل یک حرف و یک عدد باشد و طول آن بین 6 تا 20 باشد.");
        errors = errors.concat("\n");
    }

    if(!(pass === secpass)){
        errors = errors.concat("تکرار رمز با رمز تطابق ندارد.");
        errors = errors.concat("\n");
    }

    return errors;

}

export function validateEmail(email) {
    var errors ="";
    var emailreg = /\S+@\S+\.\S+/;
    if(!emailreg.test(email)){
        errors = errors.concat("ایمیل نا معتبر است");
        errors = errors.concat("\n");
    }

    return errors;

}

export function validatePhone(phone) {
    var errors ="";
    var phonereg = /^(\+98|0)?9\d{9}$/g;
    if(!phonereg.test(phone)){
        errors = errors.concat("شماره موبایل نامعتبر است.");
        errors = errors.concat("\n");
    }

    return errors;

}

export class Signup extends React.Component{
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            name : "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            secondPassword: "",
            redirect:false
        };
    }

    componentDidMount() {
        const reqOptions = {
            method: "GET",
            headers: new Headers({'Authorization' : "Bearer"+localStorage.getItem('userInfo')})
        }
        fetch('http://localhost:8080/IE/checkSignUp', reqOptions )
            .then(response => response.json())
            .then(data =>{
                    if(data.status === -1){
                        this.setState({loading:false, redirect:true, redirectPage:data.message,})
                    }
                    else{
                        localStorage.clear();
                        this.setState({loading:false,})
                    }
                }
            )
    }


    signup(){
        var errors = "";
        if((this.state.name === "") || (this.state.lastName === "") || (this.state.username === "")
            || (this.state.email === "") || (this.state.phone === "")
            || (this.state.password === "") || (this.state.secondPassword === "")){
            errors = errors.concat("خطا! همه ی فیلد ها را پر کنید.");
            errors = errors.concat("\n");
            window.alert(errors);
            return;
        }

        errors = errors.concat(validateName(this.state.name));
        errors = errors.concat(validateLastName(this.state.lastName));
        errors = errors.concat(validateUserName(this.state.username));
        errors = errors.concat(validatePassword(this.state.password,this.state.secondPassword));
        errors = errors.concat(validateEmail(this.state.email));
        errors = errors.concat(validatePhone(this.state.phone));
        if(!(errors === "")){
            window.alert(errors);
            return;
        }

        var params = {
            "name": this.state.name,
            "lastName": this.state.lastName,
            "username": this.state.username,
            "email": this.state.email,
            "phone": this.state.phone,
            "password": this.state.password,
        };

        var queryString = Object.keys(params).map(function(key) {
            return key + '=' + params[key]
        }).join('&');
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-length' : queryString.length,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: queryString
        };


        fetch('http://localhost:8080/IE/signup', requestOptions)
            .then(response => response.json())
            .then(data =>{window.alert(data.message);
                    if(data.message === "به لقمه خوش آمدید."){
                        this.setState({redirect:true})
                    }
                }
            )
    }

    login(){
        ReactDOM.render(<BrowserRouter><Redirect to="/login"/><Login /></BrowserRouter>, document.getElementById("root"))
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render(){
        if(this.state.redirect){
            ReactDOM.render(<BrowserRouter><Home /></BrowserRouter>, document.getElementById("root"))
            return <Redirect to="/home"/>
        }
        else {
            return (
                <div className="page-container">
                    <div className="page-top">
                        <div className="register">ثبت نام</div>
                        <div onClick={this.login} className="login"> ورود</div>

                    </div>
                    <img className="picture-page" src={pageImage} alt="login"/>
                    <div className="right-part">
                        <div className="page-title">ثبت نام</div>
                        <div className="page-input">
                            <div className="input-group">
                                <input type="text" className="form-input" name="name" id="name" placeholder="نام"
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-input" name="lastName" id="lastName"
                                       placeholder="نام خانوادگی" onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-input" name="username" id="username"
                                       placeholder="نام کاربری" onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-input" name="email" id="email" placeholder="ایمیل"
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-input" name="phone" id="phone"
                                       placeholder="شماره موبایل" onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="password" className="form-input" name="password" id="password"
                                       placeholder="رمز عبور" onChange={this.handleChange}/>
                            </div>

                            <div className="input-group">
                                <input type="password" className="form-input" name="secondPassword" id="secondPassword"
                                       placeholder="تکرار رمز عبور " onChange={this.handleChange}/>
                            </div>
                        </div>
                        <button type="button" className="btn-login" onClick={this.signup}>ثبت نام</button>
                    </div>

                </div>
            );
        }

    }
}

