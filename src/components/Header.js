import React from "react";
import logo from "../images/LOGO.png";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from './Restaurant'
import {foodPartySet} from "./Home";
import '../css/header.css';
import {Link, Redirect} from "react-router-dom";

export class Header extends React.Component{

    constructor() {
        super();
        this.state = { ordinaryFoods:[],partyFoods:[],modalShow:false, redirect:false, redirectPage:"",}
        this.showBasket = this.showBasket.bind(this)
    }


    showBasket() {
        this.setState(prevState => ({modalShow: true}))
    }

    logOut() {
        localStorage.removeItem("userInfo");
        //return axios.post(USER_API_BASE_URL + 'logout', {}, this.getAuthHeader());
        fetch('http://localhost:8080/IE/logout')
            .then(resp => resp.json())
            .then(data => {
                    this.setState({redirect:true, redirectPage:"login",})
                }
            );
    }

    render() {

        if(this.state.redirect){
            return <Redirect to={"/"+this.state.redirectPage}/>
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
                    <div className="exit" onClick={this.logOut}>خروج</div>
                    {(this.props.page === "restaurant" || this.props.page === "home") &&
                    <div><Link id="Profile" to="/credit">حساب کاربری</Link></div>}
                    <i className="flaticon-smart-cart" onClick={this.showBasket}></i>
                    {this.props.page !== "home" && <Link to="/home">
                        <div className="logo-container"><img to="/home" src={logo} alt="Logo" id="logo"
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


