import React from "react";
import ReactDOM from "react-dom";
import {Factor} from "./Factor";
import logo from "./images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './restaurant'
import './css/header.css';


export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false}
        this.getBasket = this.getBasket.bind(this)
        this.goToCredit = this.goToCredit.bind(this)
    }


    getBasket() {
        fetch('http://localhost:8080/server_war/currentBasket')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    ordinaryFoods : data.foods,
                    partyFoods : data.discountFoods,
                    modalShow: true

                }
            )))


    }

    goToCredit(){
        ReactDOM.render(<Factor />,document.getElementById("root"))
    }

    render() {
        let modalClose = () => this.setState({modalShow:false})
        return (
            <header className="header">
                <div className="exit">خروج</div>
                {(this.props.page==="restaurant")&&
                <div id="Profile" onClick={this.goToCredit}>حساب کاربری</div>}
                <i className="flaticon-smart-cart" onClick={this.getBasket}></i>
                <div className="logo-container"><img src={logo} alt="Logo" id="logo" className="rounded mx-auto d-block"/>
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

