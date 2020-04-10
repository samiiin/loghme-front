import React from "react";
import ReactDOM from 'react-dom';
import '../css/signup.css'
import {Login} from "./Login";
import pageImage from "../images/3.jpg";

export class Signup extends React.Component{
    constructor() {
        super();
        this.login = this.login.bind(this)
    }

    login(){
        ReactDOM.render(<Login />,document.getElementById("root"))
    }

    render(){
        return(
            <div className="page-container">
                <div className="page-top">
                    <div className="register">ثبت نام</div>
                    <div className="login" onClick={this.login}> ورود</div>

                </div>
                <img className="picture-page" src={pageImage} alt="login"/>
                <div className="right-part">
                    <div className="page-title">ثبت نام</div>
                    <div className="page-input">
                        <div className="input-group">
                            <input type="text" className="form-input" placeholder="نام کاربری"/>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-input" placeholder="ایمیل یا شماره موبایل"/>
                        </div>
                        <div className="input-group">
                            <input type="password" className="form-input" placeholder="رمز عبور"/>
                        </div>

                        <div className="input-group">
                            <input type="password" className="form-input" placeholder="تکرار رمز عبور "/>
                        </div>
                    </div>
                    <button type="button" className="btn-login" onClick={this.login}>ثبت نام</button>
                </div>

            </div>
        );

        }
}

//
