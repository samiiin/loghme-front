import React from 'react';
import ReactDOM from 'react-dom';
import logo from './img/LOGO.png';
/*import logo from './img/foodpizza.jpg';*/
/*import logo from './img/star.png';
import logo from './img/Restaurant.png';*/
import './credit.css';
import {Factor} from './Factor';
import Modal, {closeStyle} from 'simple-react-modal'


export class Credit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           name: null,
           lastName: null,
           phoneNumber: null,
           emailAddress: null,
           credit: null,
        };
    }

           showOrders(event){

            ReactDOM.render(<Factor />,document.getElementById('root'));
           }



    render(){
      return (
        <div id="wrapper">
            <Header />
            <UserInf name={this.state.name}
            lastName={this.state.lastName} phoneNumber={this.state.phoneNumber} emailAddress={this.state.emailAddress} credit={this.state.credit}/>
                        <div id="tab">
                            <a class="orders-tab" onClick={(e) => this.showOrders(e)}>سفارش ها</a>
                            <a class="addCredit-tab" href="#">افزایش اعتبار</a>
                        </div>
            <Credittab credit={this.state.credit} />
        </div>
      );
  }


        fetchUser(){
                fetch('http://localhost:8080/back_master_war_exploded/getUser')
                    .then(resp => resp.json())
                    .then(data => this.setState(prevState => ({
                          name: data.name,
                          lastName: data.lastName,
                          phoneNumber: data.phoneNumber,
                          emailAddress: data.emailAddress,
                          credit: data.credit,
                        }
                        )));

        }


        componentDidMount() {
            this.fetchUser();

        }

}

export function Header() {

    return(
            <header class="header">
                <div class="exit">خروج</div>
                <i class="flaticon-smart-cart"></i>
                <div class="logo-container"><img src={logo} alt="Logo" id="logo" class="rounded mx-auto d-block" /></div>
            </header>

    );





}

export class UserInf extends React.Component{

  render(){
    return(
            <div class="restaurant-logo-environment">
        	  <div class="profileInformation">
        	    <i class="flaticon-account"></i>
        	    <div class="user-name">{this.props.name}</div>
        	  </div>
        	  <div class="contactUs">
        	    <div>{this.props.phoneNumber}<i class="flaticon-phone"></i></div>
        		<div>{this.props.emailAddress}<i class="flaticon-mail"></i></div>
        		<div > <i class="flaticon-card"></i> <span id="x" dir="rtl">{this.props.credit} تومان</span></div>
        	  </div>
            </div>

    );


  }


}

export class Credittab extends React.Component{

    constructor(props){
        super(props);
        this.addCredit = this.addCredit.bind(this);


        this.state = {
            credit: this.props.credit,
            input: -1,
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
            	        	'content-length' : queryString.length,
            	        	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            	        },
            	        body: queryString
            	    };

            	    fetch('http://localhost:8080/back_master_war_exploded/addCredit', requestOptions)
            	        .then(response => response.json())
            	        .then(data => ReactDOM.render(<>{data.credit} تومان </>,document.getElementById('x'))
            	        );


        }

handleChange = (e) => {
                       /*
                         Because we named the inputs to match their
                         corresponding values in state, it's
                         super easy to update the state
                       */
                       this.setState({ [e.target.name]: e.target.value });
                     }

  render(){
    return(



        	<div class="orders-box">
        	  <form onSubmit={this.addCredit}>
        		<input name="input" class="rounded" type="text" placeholder="میزان افزایش اعتبار" onChange={this.handleChange}/>
        		<button class="form-button rounded">افزایش</button>
        	  </form>
            </div>

    );


  }


}





