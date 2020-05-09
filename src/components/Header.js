import React from "react";
import ReactDOM from 'react-dom';
import logo from "../images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './Restaurant'
import {foodPartySet, Home} from "./Home";
import '../css/header.css';
import {Link, Redirect,BrowserRouter} from "react-router-dom";
import {Credit} from "./Credit";
import {Login} from "./Login";

export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false, redirect:false}
        this.showBasket = this.showBasket.bind(this)
    }


    showBasket() {
        this.setState(prevState => ({modalShow: true}))
    }

    logOut() {
        localStorage.removeItem("userInfo");
        const reqOptions = {
            method: "POST",
            headers: new Headers({'Authorization' : "Bearer"+localStorage.getItem('userInfo')})
        }
        fetch('http://localhost:8080/IE/logout',reqOptions)
            .then(resp => resp.json())
           .then(ReactDOM.render(<BrowserRouter><Redirect to="/login"/><Login /></BrowserRouter>, document.getElementById("root")))
    }

    goToHome(){
        ReactDOM.render(<BrowserRouter history={"/home"}><Home /></BrowserRouter> ,document.getElementById("root"))
    }
    goToCredit(){
        ReactDOM.render(<BrowserRouter history={"/credit"}><Credit /></BrowserRouter> ,document.getElementById("root"))
    }

    render() {

        if(this.state.redirect){
            ReactDOM.render(<BrowserRouter  history="/login"><Login /></BrowserRouter>, document.getElementById("root"))
            return <Redirect to={"/login"}/>
        }
        else {
            let modalClose
            if (this.props.page === "home") {
                modalClose = () => {
                    this.setState({modalShow: false});
                    foodPartySet("party-box");
                }
            } else {
                modalClose = () => this.setState({modalShow: false})
            }

            return (
                <header className="header">
                    <Link to={"/login"}><div className="exit" onClick={this.logOut}>خروج</div></Link>
                    {(this.props.page === "restaurant" || this.props.page === "home") &&
                    <div><Link id="Profile" to="/credit" onClick={this.goToCredit}>حساب کاربری</Link></div>}
                    <i className="flaticon-smart-cart" onClick={this.showBasket}></i>
                    {this.props.page !== "home" && <Link to="/home">
                        <div className="logo-container"><img onClick={this.goToHome} src={logo} alt="Logo" id="logo"
                                                             className="img rounded mx-auto d-block"/>
                        </div>
                    </Link>}

                    <BasketModal
                        show={this.state.modalShow}
                        onHide={modalClose}
                    />

                </header>
            );
        }
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


