import React from "react";
import logo from "../images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './Restaurant'
import {foodPartySet} from "./Home";
import '../css/header.css';
import {Link} from "react-router-dom";

export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false}
        this.showBasket = this.showBasket.bind(this)
    }


    showBasket() {
        this.setState(prevState => ({modalShow: true}))
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
                <div><Link id="Profile" to="/credit">حساب کاربری</Link></div>}
                <i className="flaticon-smart-cart" onClick={this.showBasket}></i>
                {this.props.page!=="home" && <Link to="/home"><div className="logo-container"><img to="/home" src={logo}  alt="Logo" id="logo" className="img rounded mx-auto d-block"/>
                </div></Link>}

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


