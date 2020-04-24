import React from "react";
import ReactDOM from "react-dom";
import logo from "../images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './Restaurant'
import {Credit} from "./Credit"
import {Home} from "./Home"
import {foodPartySet} from "./Home";
import '../css/header.css';


export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false}
        this.showBasket = this.showBasket.bind(this)
        this.goToCredit = this.goToCredit.bind(this)
        this.goTohome = this.goToHome.bind(this)
    }


    showBasket() {
        this.setState(prevState => ({modalShow: true}))
    }

    goToCredit(){
        ReactDOM.render(<Credit />,document.getElementById("root"))
    }

    goToHome(){
        ReactDOM.render(<Home />,document.getElementById("root"))
    }

    render() {
        let modalClose
        if(this.props.page === "home") {
            modalClose = () => {
                this.setState({modalShow: false});
                foodPartySet("party-box");
            }
        }
        else {
            modalClose = () => this.setState({modalShow:false})
        }
        return (
            <header className="header">
                <div className="exit">خروج</div>
                {(this.props.page==="restaurant" || this.props.page==="home")&&
                <div id="Profile" onClick={this.goToCredit}>حساب کاربری</div>}
                <i className="flaticon-smart-cart" onClick={this.showBasket}></i>
                {this.props.page!=="home" && <div className="logo-container"><img onClick={this.goToHome} src={logo} alt="Logo" id="logo" className="rounded mx-auto d-block"/>
                </div>}

                <BasketModal
                    show={this.state.modalShow}
                    onHide={modalClose}
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


