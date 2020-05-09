import React from 'react';
import ReactDOM from 'react-dom';
import '../css/credit.css';
import {Header} from './Header'
import {BrowserRouter, Link, Redirect} from "react-router-dom";
import {Orders} from "./Orders"
import {Login} from "./Login";
export class Credit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            lastName: null,
            phoneNumber: null,
            emailAddress: null,
            credit: null,
            redirect:false,
        };
    }

    componentDidMount() {
        const reqOptions = {
            method: "GET",
            headers: new Headers({'Authorization' : "Bearer"+localStorage.getItem('userInfo')})
        }
        fetch('http://localhost:8080/IE/User',reqOptions)
            .then(resp => resp.json())
            .then(data => {
                if(data.status!=null && data.status===-1){
                    this.setState({redirect:true})
                    this.forceUpdate()
                }
                else{
                    this.setState(prevState => ({
                        name: data.name,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                        emailAddress: data.emailAddress,
                        credit: data.credit,

                    }))}
                }
          );
    }

    goToOrders(){
        ReactDOM.render(<BrowserRouter history="/orders"><Orders /></BrowserRouter> ,document.getElementById("root"))
    }

    render(){
        if(this.state.redirect){
            ReactDOM.render(<BrowserRouter
                history="/login"><Login/></BrowserRouter>, document.getElementById("root"))
            return <Redirect to="/login" />
        }
        else {
            return (


                <div>
                    <Header page="credit"/>
                    <UserInf name={this.state.name} lastName={this.state.lastName} phoneNumber={this.state.phoneNumber}
                             emailAddress={this.state.emailAddress} credit={this.state.credit}/>
                    <div id="tab">
                        <Link class="orders" to="/orders" onClick={this.goToOrders}>سفارش ها</Link>
                        <div class="addCredit">افزایش اعتبار</div>
                    </div>
                    <CreditTab credit={this.state.credit}/>
                    <div id="footer">
                        &copy; تمامی حقوق متعلق به لقمه است
                    </div>
                </div>
            );
        }
    }
}

export class UserInf extends React.Component{
    render(){
        return(
            <div class="user-environment">
                <div class="profileInformation">
                    <i class="flaticon-account"></i>
                    <div class="user-name">{this.props.name}</div>
                </div>
                <div class="contactUs">
                    <div>{this.props.phoneNumber}<i class="flaticon-phone"></i></div>
                    <div>{this.props.emailAddress}<i class="flaticon-mail"></i></div>
                    <div ><i class="flaticon-card"></i> <span id="credit" dir="rtl">{this.props.credit} تومان</span></div>
                </div>
            </div>

        );
    }
}

export class CreditTab extends React.Component{
    constructor(props){
        super(props);
        this.addCredit = this.addCredit.bind(this);
        this.state = {
            credit: this.props.credit,
            input: 0,
            redirect:false,
        };
    }

    addCredit(event){

        event.preventDefault();
        var params = {
            "credit": this.state.input,
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

        fetch('http://localhost:8080/IE/addCredit', requestOptions)
            .then(response => response.json())
            .then(data =>{
                if(data.status!=null && data.status===-1){
                    this.setState({redirect:true})
                }
                else{
                    ReactDOM.render(<>{data.credit} تومان </>,document.getElementById('credit'))
                }
            }
            );
        document.getElementById('text').value =''
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render(){
        if(this.state.redirect){
            ReactDOM.render(<BrowserRouter
                history="/login"><Login/></BrowserRouter>, document.getElementById("root"))
            return <Redirect to="/login"/>
        }
        else {
            return (
                <div class="credit-box">
                    <div>
                        <input id="text" name="input" class="rounded increase-input" type="text"
                               placeholder="میزان افزایش اعتبار" onChange={this.handleChange}/>
                        <button class="increase-credit rounded" onClick={this.addCredit}>افزایش</button>
                    </div>
                </div>

            );
        }
    }
}





