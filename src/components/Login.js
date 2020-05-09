import React from "react";
import '../css/login.css'
import pageImage from '../images/3.jpg'
import {Redirect, BrowserRouter} from "react-router-dom";
import {Spinner} from './Spinner'
import {Home} from './Home'
import ReactDOM from "react-dom";
import {Signup} from "./Signup";
import glogo from "../images/google-logo.png"

export function validatePassword(pass) {
    var errors ="";
    var passw = /^(?=.*\d)(?=.*[a-zA-Z\u0600-\u06FF\s]).{6,20}$/;
    if(!pass.match(passw)){
        errors = errors.concat("رمز عبور باید حداقل شامل یک حرف و یک عدد باشد و طول آن بین 6 تا 20 باشد.");
        errors = errors.concat("\n");
    }
    return errors;

}

export class Login extends React.Component{

    constructor() {
        super();
        this.goTohome = this.goTohome.bind(this)
        this.signup = this.signup.bind(this)
        this.signIn = this.signIn.bind(this)
        this.state = {
            username : "",
            password: "",
            redirect:false,
            loading: true,
            redirectPage:"",
            auth2:null,
        };
    }

    goTohome(){
        var errors = "";
        if((this.state.username === "") || (this.state.password === "")){
            errors = errors.concat("خطا! همه ی فیلد ها را پر کنید.");
            errors = errors.concat("\n");
            window.alert(errors);
            return;
        }

        errors = errors.concat(validatePassword(this.state.password));
        if(!(errors === "")){
            window.alert(errors);
            return;
        }

        var params = {
            "username": this.state.username,
            "password": this.state.password,
        };

        var queryString = Object.keys(params).map(function(key) {
            return key + '=' + params[key]
        }).join('&');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization' : "Bearer"+localStorage.getItem('userInfo'),
                'content-length' : queryString.length,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: queryString
        };

        fetch('http://localhost:8080/IE/login', requestOptions)
            .then(response => response.json())
            .then(data =>{
                    if(data.message === "سلام!"){
                        localStorage.setItem("userInfo", data.token);
                        this.setState({redirect:true})
                    }
                    else{
                        window.alert(data.message);
                    }
                }
            )

    }

    componentDidMount() {
        const reqOptions = {
            method: "GET",
            headers: new Headers({'Authorization' : "Bearer"+localStorage.getItem('userInfo')})
        }
        fetch('http://localhost:8080/IE/checkLogin', reqOptions )
            .then(response => response.json())
            .then(data =>{
                    if(data!=null && data.status === -1){
                        this.setState({loading:false, redirect:true})
                    }
                    else{
                        /*this.googleSDK()*/
                        localStorage.clear();
                        try {
                            const params = {
                                client_id: "805689182939-0ga0omqkur2mmmo22066rphmi97d1qkt.apps.googleusercontent.com",
                            };
                            window['gapi'].load('auth2', () => {
                                window['gapi'].auth2.init(params);

                            });
                        } catch (error) {
                            console.log(error.name, ':', error.message);
                        }

                        this.setState({loading:false});
                    }
                }
            )

    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    signup = () => {
        ReactDOM.render(<BrowserRouter><Redirect to="/signup"/><Signup /></BrowserRouter>, document.getElementById("root"))
    }

    signOut(){
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(auth2.disconnect())
    }

    signIn = () => {

        const auth2 = window['gapi'].auth2.getAuthInstance();
        auth2.signIn()
            .then((res) => {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': "Bearer" + res.getAuthResponse().id_token,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                };
                fetch('http://localhost:8080/IE/loginByGoogle', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                            if (data.message === "سلام!") {
                                localStorage.setItem("userInfo", data.token);
                                this.setState({redirect: true, redirectPage: "home"})

                            } else {
                                this.setState({redirect: true, redirectPage: "signup"})
                            }
                        }
                    )


            })
    }

    render(){
        if(this.state.loading){
            return <div className = "spinner-page" ><Spinner /></div>
        }

        else if(this.state.redirect && this.state.redirectPage===""){
            ReactDOM.render(<BrowserRouter  history={"/home"}><Home /></BrowserRouter>, document.getElementById("root"))
            return (<Redirect to={"/home"}/>)
        }
        else if(this.state.redirect && this.state.redirectPage==="home"){
            ReactDOM.render(<BrowserRouter  history={"/home"}><Home /></BrowserRouter>, document.getElementById("root"))
            return (<Redirect to={"/home"}/>)
        }
        else if(this.state.redirect && this.state.redirectPage==="signup"){
            ReactDOM.render(<BrowserRouter  history={"/signup"}><Signup /></BrowserRouter>, document.getElementById("root"))
            return (<Redirect to={"/signup"}/>)
        }
        else
        {
            return (
                <div class="page-container">
                    <script src="https://apis.google.com/js/platform.js?onload=onLoad'" async defer></script>
                    <meta name="google-signin-client_id" content="805689182939-0ga0omqkur2mmmo22066rphmi97d1qkt.apps.googleusercontent.com"/>
                    <div class="page-top">
                        <div  class="register" onClick={this.signup}>ثبت نام</div>
                        <div class="login"> ورود</div>
                    </div>
                    <img class="picture-page" src={pageImage} alt="login"/>
                    <div className="right-part">
                        <div className="page-title">ورود</div>
                        <div className="page-input">
                            <div className="input-group">
                                <input type="text" className="form-input" name="username" id="username"
                                       placeholder="نام کاربری" onChange={this.handleChange}/>
                            </div>
                            <div className="input-group">
                                <input type="password" required="" name="password" id="password"
                                       placeholder="رمز عبور" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <button type="button" className="btn-login" onClick={this.goTohome}>ورود</button>
                        <div className="google-sign" onClick={this.signIn}>
                            <div className="btn-text">Sign in</div>
                            <img className="google-img" alt={"google"} src={glogo}/>

                        </div>
                        <div class="google-signout" onClick={this.signOut}>
                            sign out
                        </div>


                    </div>
                </div>

            );
        }
    }
}
