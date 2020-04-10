import React from "react";
import ReactDOM from 'react-dom';
import '../css/login.css'
import {Home} from "./Home";
import {Signup} from "./Signup";
import pageImage from '../images/3.jpg'

export class Login extends React.Component{
    constructor() {
        super();
        this.goTohome = this.goTohome.bind(this)
        this.register = this.register.bind(this)
    }

    goTohome(){
        ReactDOM.render(<Home />,document.getElementById("root"))
    }

    register(){
        ReactDOM.render(<Signup />,document.getElementById("root"))
    }

    render(){
        return(
        <div class="page-container">
            <div class="page-top">
                <div class="register" onClick={this.register}>ثبت نام</div>
                <div class="login"> ورود </div>

            </div>
            <img class="picture-page" src={pageImage} alt="login"/>
            <div className="right-part">
                <div className="page-title">ورود</div>
                <div className="page-input">
                <div className="input-group">
                    <input type="text" className="form-input" placeholder="نام کاربری"/>
                </div>
                <div className="input-group">
                    <input type="password" required="" placeholder="رمز عبور"/>
                </div>
                </div>
                <button type="button" className="btn-login" onClick={this.goTohome}>ورود</button>
            </div>

        </div>


        );
    }
}

//