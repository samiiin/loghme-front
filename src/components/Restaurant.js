import React from 'react';
import star from '../images/star.png'
import '../css/restaurant.css';
import ReactDOM from "react-dom";
import {FoodModal} from './FoodModal'
import {Header} from './Header'

export function CurrentBasket (divclass){
    var ordinaryFoods=[];
    var partyFoods=[];
    fetch('http://localhost:8080/IE/currentBasket')
        .then(resp => resp.json())
        .then(data => {
                ordinaryFoods = data.foods
                partyFoods = data.discountFoods
                var x=document.getElementsByClassName(divclass)
            var i;
            for (i = 0; i < x.length; i++) {
                ReactDOM.render(<Basket ordinary={ordinaryFoods}
                                        party={partyFoods}/>, document.getElementsByClassName(divclass)[i])
            }
            }
        )
}

export class Restaurant extends React.Component{
    constructor(props) {
        super(props);
        this.state = {name: null, logo: null , location:null , menu:[], id : this.props.id ,};
    }


    componentDidMount() {
        fetch('http://localhost:8080/IE/restaurantInfo/'+ this.state.id)
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    name : data.name ,
                    logo : data.logo,
                    location : data.location,
                    menu : data.menu,
                    id : this.props.id
                }
            )));

    }

    render() {
        var id = this.state.id
        var name = this.state.name
        return(
            <div >
                <Header page="restaurant" />
                <RestaurantLogo name={this.state.name} logo={this.state.logo}/>
                <div className="foodTitle"><span>منوی غذا</span></div>
                <div id="food-basket">
                <div class="basket-container" id="inpage"></div>
                {CurrentBasket("basket-container")}
                <div className="flex-container">
                    {this.state.menu.map(function (menu,index) {
                            return <Food  rname={name} rid={id} name={menu.name} popularity={menu.popularity} price={menu.price} fimage={menu.image} description={menu.description}/>
                        }
                    )}
                </div>
                </div>
                <div id="footer">
                    &copy; تمامی حقوق متعلق به لقمه است
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
    constructor() {
        super();
        this.state = {modalShow:false}
        this.showDetail = this.showDetail.bind(this)
    }

    showDetail(){
        this.setState(prevState => ({
                modalShow: true

            }
        ))
    }

    render() {
        let modalClose = () => this.setState({modalShow:false})
        return(
            <div className="panel-body rounded" >
                <img class="food-image" onClick={this.showDetail} src={this.props.fimage} className="food-image rounded"
                     alt="food"/>
                <div class="food-name"><b>{this.props.name} </b><span> &nbsp;{this.props.popularity}</span> <img src={star} className="star" alt="star"/></div>
                <div class="food-price" dir="rtl">{this.props.price}تومان </div>
                <Buy rid={this.props.rid} food={this.props.name}/>
                <FoodModal show={this.state.modalShow} onHide={modalClose} rid={this.props.rid} rname={this.props.rname}  popularity={this.props.popularity} price={this.props.price} image={this.props.fimage}
                           type="ordinary" description={this.props.description} name={this.props.name}/>
            </div>

        );
    }
}



class Buy extends React.Component{

    constructor(props) {
        super(props);
        this.addFood = this.addFood.bind(this);
        this.state = {
            status:null
        }

        this.addFood = this.addFood.bind(this);

    }

    addFood(){
        var params = {
            "id": this.props.rid,
            "food" : this.props.food,
            "count" : 1
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
        fetch('http://localhost:8080/IE/buyFood', requestOptions)
            .then(response => response.json())
            .then(data => {this.setState(prevState => ({status: data.status}))})
            .then(data=>{
                if(this.state.status !== 200)
                    window.alert("غذا از رستوران دیگری انتخاب شده")
            })
            .then(()=>CurrentBasket("basket-container"))

    }

    render() {
        return(
            <button type="button" className="food-cart-add rounded" onClick={this.addFood}>خرید</button>

        );
    }
}

class BasketRow extends React.Component{
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this)
        this.state ={status: null , message:null}
    }

    handleClick(path){
        var params = {
            "food": this.props.name,
            "id" : "current",
            "count" : 1
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
        fetch('http://localhost:8080/IE/'+path, requestOptions)
            .then(response => response.json())
            .then(data => {this.setState(prevState => ({status: data.status,message:data.message}
            ))})
            .then(data=>{
                if(this.state.status !== 200)
                    window.alert(this.state.message)
            })
            .then(()=>CurrentBasket("basket-container"))

    }


    render(){
        if(!(this.props.party)){
            return(
                <div className="row-group">
                    <div className="order-name"><small>{this.props.name}</small></div>
                <div className="column-group">
                    <div className="minus-plus"><i className="flaticon-plus" onClick={()=>this.handleClick("buyFood")}></i>
                        <div>{this.props.count}</div>
                        <i className="flaticon-minus" onClick={()=>this.handleClick("decreaseOrdinaryFood")}></i>
                    </div>
                    <div className="price">{this.props.price * this.props.count}تومان</div>
                </div>
            </div>
            );
        }
        else{
            return(
                <div className="row-group">
                    <div className="order-name"><small>*{this.props.name}</small></div>
                    <div className="column-group">
                        <div className="minus-plus"><i className="flaticon-plus"  onClick={()=>this.handleClick("addDiscountFoodToBasket")}></i>
                            <div>{this.props.count}</div>
                            <i className="flaticon-minus" onClick={()=>this.handleClick("decreasePartyFood")}></i></div>
                        <div className="price">{this.props.price * this.props.count}تومان</div>
                    </div>
                </div>
            );

        }

    }
}




class Basket extends React.Component{
    constructor() {
        super();
        this.finalizeOrder = this.finalizeOrder.bind(this)
        this.state = {status : null ,message : null}
    }

    finalizeOrder(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
        };
        fetch('http://localhost:8080/IE/finalizeOrder',requestOptions)
            .then(response => response.json())
            .then(data => {this.setState(prevState => ({status: data.status,message:data.message}
            ))})
            .then(data=>{
                    window.alert(this.state.message)
            })
            .then(()=>CurrentBasket("basket-container"))


    }

    render(){
        var price=0;
        return(
            <div className="basket">
                <div className="basket-title">سبد خرید</div>
                <div className="orders-container">
                    {this.props.ordinary.map(function (ordinaryFood,index) {
                            price += ordinaryFood.foodPrice*ordinaryFood.count
                            return <BasketRow party={false} name={ordinaryFood.foodName} price={ordinaryFood.foodPrice} count={ordinaryFood.count}/>
                        }
                    )}

                    {this.props.party.map(function (discountFood,index) {
                            price += discountFood.foodPrice*discountFood.count
                            return <BasketRow  party={true} name={discountFood.foodName} price={discountFood.foodPrice} count={discountFood.count}/>
                        }
                    )}

                </div>
                <div className="total-price">جمع کل: <b>{price} تومان</b></div>
                <button type="button" className="btn-confirm" onClick={this.finalizeOrder}>تایید نهایی</button>
            </div>

        );

    }
}
