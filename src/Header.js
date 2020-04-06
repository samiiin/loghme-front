import React from "react";
import ReactDOM from "react-dom";
import logo from "./images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './restaurant'
import {Credit} from "./Credit"
import {Home} from "./Home";
import './css/header.css';


export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false}
        this.getBasket = this.getBasket.bind(this)
        this.goToCredit = this.goToCredit.bind(this)
        this.goTohome = this.goToHome.bind(this)
    }


    getBasket() {
        fetch('http://localhost:8080/back_master_war_exploded/currentBasket')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    ordinaryFoods : data.foods,
                    partyFoods : data.discountFoods,
                    modalShow: true
                }
            )))

    }

    goToCredit(){
        ReactDOM.render(<Credit />,document.getElementById("root"))
    }

    goToHome(){
        ReactDOM.render(<Home />,document.getElementById("root"))
    }

    render() {
        let modalClose = () => this.setState({modalShow:false})
        return (
            <header className="header">
                <div className="exit">خروج</div>
                {(this.props.page==="restaurant" || this.props.page==="home" )&&
                <div id="Profile" onClick={this.goToCredit}>حساب کاربری</div>}
                <i className="flaticon-smart-cart" onClick={this.getBasket}></i>
                <div className="logo-container"><img onClick={this.goToHome} src={logo} alt="Logo" id="logo" className="rounded mx-auto d-block"/>
                </div>

                <BasketModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    ordinary={this.state.ordinaryFoods}
                    party={this.state.partyFoods}
                />

            </header>
        );
    }

}

class BasketModal extends React.Component {

    render() {
        return (
            <Modal
                {...this.props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                id="basket-modal"
            >

                <Modal.Body closeButton id="contained-modal-title-vcenter">
                    <div class="basket-container"></div>
                    {CurrentBasket("basket-container")}

                </Modal.Body>
            </Modal>

        );
    }
}

