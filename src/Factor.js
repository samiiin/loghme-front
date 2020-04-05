import React from 'react';
import {Header} from './Header'
import './css/factor.css'
export class Factor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            lastName: null,
            phoneNumber: null,
            emailAddress: null,
            credit: null,
            id: null,
        };
    }

    componentDidMount() {
        fetch('http://localhost:8080/server_war/getUser')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    name: data.name,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    emailAddress: data.emailAddress,
                    credit: data.credit,
                    id: data.id,
                }
            )));

    }

    render(){
        return (
            <div id="wrapper">
                <Header page="Factor"/>
                <UserInf name={this.state.name} lastName={this.state.lastName} phoneNumber={this.state.phoneNumber} emailAddress={this.state.emailAddress} credit={this.state.credit}/>
                <div id="content">
                    <div id="tab">
                        <div className="orders-tab" >سفارش ها</div>
                        <div className="addCredit-tab" >افزایش اعتبار</div>
                    </div>
                    <div class="orders-box">
                        <Table userID={this.state.id} />
                    </div>
                </div>
            </div>
        );
    }
}

export class Table extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orders : [],
        };
    }

    fetchOrders(){
        fetch('http://localhost:8080/server_war/getOrders')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    orders: data,
                }
            )))
    }

    componentDidMount() {
        this.fetchOrders();
        this.timerId = setInterval(
            () => {this.fetchOrders()}
            , 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render(){
        var i=0;
        return(
            <table class="orders-table">
               {this.state.orders.map(function (order,index) {
                   i=i+1
                   return <Order orderInf={order} number={i}/>
               } )}
            </table>

        );
    }

}

export class Order extends React.Component{

    render(){
        if(this.props.orderInf.status==="FindingDelivery"){
           var text = "درجست و جوی پیک"
        }
        else if(this.props.orderInf.status==="Delivering"){
            text = "پیک در مسیر"
        }
        else{
            text="مشاهده فاکتور"
        }
        return(
        <tr>
            <td class="number rounded-right">{this.props.number}</td>
            <td class="name">{this.props.orderInf.restaurantName}</td>
            <td class={this.props.orderInf.status +" rounded-left"}><div class="rounded">{text}</div></td>
        </tr>

        );
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
                    <div ><span  dir="rtl">{this.props.credit} تومان</span><i className="flaticon-card"></i></div>
                </div>
            </div>

        );
    }
}

