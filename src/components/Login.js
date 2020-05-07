import React from "react";
import '../css/login.css'
import pageImage from '../images/3.jpg'
import {Link,Redirect} from "react-router-dom";
import {Spinner} from './Spinner'
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
        this.state = {
            username : "",
            password: "",
            redirect:false,
            loading: true,
            redirectPage:"",
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
                        this.setState({redirect:true, redirectPage:"home"})

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
                    if(data.status === -1){
                        this.setState({loading:false, redirect:true, redirectPage:data.message,})
                    }
                    else{
                        //window.alert(data.message);
                        localStorage.clear();
                        this.setState({loading:false,})
                    }
                }
            )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render(){
        if(this.state.loading){
            return <Spinner />
        }
        else if(this.state.redirect){
            return <Redirect to={"/"+this.state.redirectPage}/>
        }
        else
        {
            return (
                <div class="page-container">
                    <div class="page-top">
                        <Link to="/signup" class="register">ثبت نام</Link>
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
                    </div>

                </div>

            );
        }
    }
}
