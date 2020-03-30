import React from 'react';
import logo from './images/LOGO.png';
import star from './images/star.png'
import './css/Restaurant.css';


export class Restaurant extends React.Component{
    constructor(props) {
        super(props);
        this.state = {name: null, logo: null , location:null , menu:[], id:this.props.id};
    }

    componentDidMount() {

        fetch('http://localhost:8080/server_war/restaurantInfo/'+ this.state.id)
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    name : data.name ,
                    logo : data.logo,
                    location : data.location,
                    menu : data.menu,
                }
                )));

    }

    render() {
        console.log(this.state.menu);
        return(
            <div>
                <Header />
                <RestaurantLogo name={this.state.name} logo={this.state.logo}/>
                <div className="foodTitle"><span>منوی غذا</span></div>

                <div className="flex-container">
                    {this.state.menu.map(function (menu,index) {
                            return <Food name={menu.name} popularity={menu.popularity} price={menu.price} fimage={menu.image}/>
                        }

                    )}
                </div>
            </div>


        );
    }
}

class RestaurantLogo extends React.Component{
    render() {
        return(
            <div className="restaurant-logo-environment">
                <img src={this.props.logo} className="restaurant-logo" alt="logo"/>
                    <div className="restaurant-name">{this.props.name}</div>
            </div>
        );
    }
}

class Food extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            price: this.props.price ,
            popularity:this.props.popularity ,
            image:this.props.image};
    }

    render() {
        return(
            <div className="panel-body rounded" >
                <img src={this.props.fimage} className="food-image img-responsive rounded mx-auto d-block"
                     alt="food"/>
                <div class="food-name"><b>{this.props.name} </b><span>&nbsp;{this.props.popularity}<img src={star} class="star" alt="star"/></span> </div>
                <div class="food-price" dir="rtl">{this.props.price}تومان </div>
                <div class="food-cart-add rounded">افزودن به سبد خرید</div>
           </div>
        );
    }
}

export class Header extends React.Component{
    render() {
        return(
            <header className="header">
                <div className="exit">خروج</div>
                <div><a id="Profile" href="orders.html">حساب کاربری</a></div>
                <i className="flaticon-smart-cart"></i>
                <div className="logo-container"><img src={logo} alt="Logo" id="logo" className="rounded mx-auto d-block"/></div>
            </header>

        );
    }
}



