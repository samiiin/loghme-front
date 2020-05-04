import React from 'react';
import {Header} from './Header'
import '../css/factor.css'
import {Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import {UserInf} from "./Credit"
export class Orders extends React.Component {

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
        fetch('http://localhost:8080/IE/User')
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
            <div>
                <Header page="Factor"/>
                <UserInf name={this.state.name} lastName={this.state.lastName} phoneNumber={this.state.phoneNumber} emailAddress={this.state.emailAddress} credit={this.state.credit}/>
                <div id="content">
                    <div id="tab">
                        <div className="orders-tab" >سفارش ها</div>
                        <Link to="/credit" className="addCredit-tab">افزایش اعتبار</Link>
                    </div>
                    <div class="orders-box">
                        <Table userID={this.state.id} />
                    </div>
                </div>
                <div id="footer">
                    &copy; تمامی حقوق متعلق به لقمه است
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
        fetch('http://localhost:8080/IE/Orders')
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
                   return <Order order={order} number={i}/>
               } )}
            </table>

        );
    }

}

class OrderModal extends React.Component {

    render() {
        var foods = this.props.order.foods
        var discountFoods = this.props.order.discountFoods
        var i=0;
        var price=0
        return (
            <Modal
                {...this.props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                id="order-modal"
            >

                <Modal.Body closeButton id="contained-modal-title-vcenter">
                    <div class="order-modal">
                    <div class="order-restaurant-name">{this.props.order.restaurantName}</div>
                    <div class="line"></div>
                    <table >
                        <tr>
                            <th className="order-modal-header">ردیف</th>
                            <th class="order-modal-header">نام غذا</th>
                            <th class="order-modal-header">تعداد</th>
                            <th class="order-modal-header">قیمت</th>
                        </tr>
                        {foods.map(function (food,index) {
                            i+=1
                            price+=(food.foodPrice)*(food.count)
                            return (
                                <tr>
                                    <td className="order-modal-cell">{i}</td>
                                    <td class="order-modal-cell">{food.foodName}</td>
                                    <td class="order-modal-cell">{food.count}</td>
                                    <td class="order-modal-cell">{food.foodPrice}</td>
                                </tr>
                            );
                        })}

                        {discountFoods.map(function (dfood,index) {
                            i+=1
                            price+=(dfood.foodPrice)*(dfood.count)
                            return (
                                <tr>
                                    <td className="order-modal-cell">{i}</td>
                                    <td class="order-modal-cell">*{dfood.foodName}</td>
                                    <td class="order-modal-cell">{dfood.count}</td>
                                    <td class="order-modal-cell">{dfood.foodPrice}</td>
                                </tr>
                            );
                        })}

                    </table>
                    <div class="order-price"> جمع کل:{price}تومان</div>
                    </div>

                </Modal.Body>
            </Modal>

        );
    }
}

export class Order extends React.Component{
    constructor() {
        super();
        this.state = {modalShow:false}
        this.showModal = this.showModal.bind(this)
    }

    showModal(){
        this.setState({modalShow:true})
    }

    render(){
        let modalClose = () => this.setState({modalShow:false})
        if(this.props.order.status==="FindingDelivery"){
           var text = "درجست و جوی پیک"
        }
        else if(this.props.order.status==="Delivering"){
            text = "پیک در مسیر"
        }
        else{
            text="مشاهده فاکتور"
        }
        return(
            <tr >
                <td class="number rounded-right" onClick={this.showModal}>{this.props.number}</td>
                <td class="name" onClick={this.showModal}>{this.props.order.restaurantName}</td>
                <td class={this.props.order.status +" rounded-left"} onClick={this.showModal}><div class="rounded">{text}</div></td>
                <OrderModal order={this.props.order} show={this.state.modalShow} onHide={modalClose}/>
            </tr>

        );
    }
}

//
