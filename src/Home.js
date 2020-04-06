import React from 'react';
import ReactDOM from 'react-dom';
import logo from './images/LOGO.png';
import './css/home.css';
import {CurrentBasket, Restaurant} from './restaurant';
import {Header} from './Header'
import {Modal} from 'react-bootstrap'
import star from './images/star.png'
import {Credit} from "./Credit";



export function foodPartySet (id){
    fetch('http://localhost:8080/back_master_war_exploded/getDiscountFoods')
        .then(resp => resp.json())
        .then(data => {
                ReactDOM.render(<FoodParty discounts={data} />,document.getElementById(id))
            }
        )
}


export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants : [],
        };
    }
    render(){
        return (

            <div id="wrapper">
                <HeaderHome />
                <HomeDescription />
                <div id="tt">
                    {foodPartySet ("tt")}
                </div>
                <div id="restaurants-container">
                    <div class="titre">رستوران ها</div>
                    <div id="restaurants">
                        {this.state.restaurants.map(function (restaurants,index) {
                                return <RestaurantIcon restaurantid={restaurants.id} restaurantname={restaurants.name} restaurantlogo={restaurants.logo} />
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

    componentDidMount() {

        fetch('http://localhost:8080/back_master_war_exploded/restaurants')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    restaurants: data,
                }
            )));

    }


}

export class RestaurantIcon extends React.Component{
    constructor (props){
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.state = {
            restaurantname : this.props.restaurantname,
            restaurantlogo : this.props.restaurantlogo,
            restaurantid: this.props.restaurantid,
        };
    }

    showMenu(event, id){
        ReactDOM.render(
            <Restaurant id={id} />,
            document.getElementById('root')
        );
    }
    render(){
        return(
            <div class="restaurant rounded">
                <img src={this.state.restaurantlogo} alt="Logo" id="logo" class="rounded mx-auto d-block" />
                <div class="restaurantname">{this.state.restaurantname}</div>
                <button class="form-button rounded" type="submit" onClick={(e) => this.showMenu(e, this.props.restaurantid)}>نمایش منو</button>
            </div>

        );

    }
}


export class HomeDescription extends React.Component{

    render(){
        return(
            <div class="home-logo-environment">
                <div id="content">
                    <div id="description">
                        <img src={logo} alt="Logo" id="logo" class="rounded mx-auto d-block" />
                        اولین و بزرگ ترین وب سایت سفارش آنلاین غذا در دانشگاه تهران
                    </div>
                    <div id="serach-box">
                        <div>
                            <input class="rounded" type="text" placeholder="نام غذا" />
                            <input class="rounded" type="text" placeholder="نام رستوران" />
                            <button class="form-button rounded" type="submit">جست و جو</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export class FoodParty extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            discountFoods : [],
            time : 0,
        };
    }


    render(){
        var discountfoods = this.props.discounts;
        return(
            <div id="food-party">
                <div class="titre">جشن غذا!</div>
                <div class="rounded timer">زمان باقی مانده: &nbsp;<span >{Math.floor((this.state.time) / 60)}</span>:<span>{(this.state.time) % 60}</span>&nbsp;</div>
                <div class="scrollmenu">
                    {discountfoods.map(function (discountfoods,index) {
                            return <DiscountFood discountfood={discountfoods} />
                        }
                    )}
                </div>
            </div>
        );
    }

    /*fetchFoods(){
        fetch('http://localhost:8080/back_master_war_exploded/getDiscountFoods')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    discountFoods: data,
                }
            )))
    }*/

    getTime(){
        fetch('http://localhost:8080/back_master_war_exploded/getFoodPartyTime')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    time: data.remainingTime + 1,
                }
            )));

    }

    componentDidMount() {

        foodPartySet("tt")
        this.getTime()
        this.myInterval = setInterval(() => {
            if(this.state.time > 0){
                //this.setState({ time: this.state.time - 1 })
                this.getTime()
            }

            if(this.state.time <= 2){
                foodPartySet("tt")
                this.getTime()
            }
        }, 1000);
    }

}

export class DiscountFood extends React.Component{

    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
        this.showModal = this.showModal.bind(this);
        this.state = {
            count: this.props.discountfood.discountFood.count,
            addToCartMsg : '',
            modalShow: false,
        };
    }

    addToCart(event,restaurantid,foodname){
        event.preventDefault();
        var params = {
            "id": restaurantid,
            "food" : foodname,
            "count" : 1,
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

        fetch('http://localhost:8080/back_master_war_exploded/addDiscountFoodToBasket', requestOptions)
            .then(response => response.json())
            .then(data => {this.setState(prevState => ({addToCartMsg: data.message,})); window.alert(this.state.addToCartMsg);});

    }


    showModal(){
        this.setState(prevState => ({modalShow: true}))
    }

    render(){
        let modalClose = () => this.setState({modalShow:false})
        return(
            <div class="discountFood rounded">
                <div class="restaurant-photo-name">
                    <img src={this.props.discountfood.discountFood.image} onClick={this.showModal} alt="discountFoodImage" id="discountFoodImage" class="rounded mx-auto d-block square" />
                    <div class="discountFoodName">{this.props.discountfood.discountFood.name}<br/> {this.props.discountfood.discountFood.popularity}  ⭐</div>
                </div>
                <div class="prices">
                    <span class="old-Price">{this.props.discountfood.discountFood.oldPrice}</span> &nbsp; &nbsp;<span>{this.props.discountfood.discountFood.price}</span>
                </div>
                <div class="buttons">
                    <span class="remained rounded">موجودی: {this.props.discountfood.discountFood.count}</span> &nbsp; <button class="form-button rounded" type="submit"  onClick={(e) => this.addToCart(e, this.props.discountfood.ownerRestaurant.id, this.props.discountfood.discountFood.name)}>خرید</button>

                </div>
                <div dir="rtl"class="restaurantName">
                    {this.props.discountfood.ownerRestaurant.name}
                </div>
                <FoodPartyModal show={this.state.modalShow} onHide={modalClose} restaurant={this.props.discountfood.ownerRestaurant}  price={this.props.discountfood.discountFood.price} oldPrice={this.props.discountfood.discountFood.oldPrice}
                                count={this.props.discountfood.discountFood.count} image={this.props.discountfood.discountFood.image} description={this.props.discountfood.discountFood.description} name={this.props.discountfood.discountFood.name} popularity={this.props.discountfood.discountFood.popularity}
                />

            </div>
        );

    }

}

class FoodPartyModal extends React.Component {
    constructor() {
        super();
        this.state = {count:0, addToCartMsg : '', inventory: -1,}
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
        this.addToCart = this.addToCart.bind(this)
        //this.getInventory = this.getInventory.bind(this)
    }

    increase(){
        if(this.props.count > this.state.count){
            this.setState({count:this.state.count+1})
        }
    }

    decrease(){
        if(this.state.count>0){
            this.setState({count:this.state.count-1})

        }
    }


    addToCart(){
        if(this.state.count<=0){
            window.alert("غذایی انتخاب نشده است!")
        }
        else{
            var params = {
                "id": this.props.restaurant.id,
                "food" : this.props.name,
                "count" : this.state.count,
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

            fetch('http://localhost:8080/back_master_war_exploded/addDiscountFoodToBasket', requestOptions)
                .then(response => response.json())
                .then(data => {if(data.status === 200) {
                    this.setState(prevState => ({count: 0, addToCartMsg: data.message,}))
                }
                    window.alert(data.message);
                })
        }
    }

    render() {
        return (
            <Modal
                {...this.props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                id="discountFood-info-modal"
            >
                <Modal.Body id="contained-modal-title-vcenter">
                    <div className="food-info">
                        <div className="info-rname">{this.props.restaurant.name}</div>
                        <div className="food-image-info">
                            <img src={this.props.image} alt="Logo" id="logo" className="rounded "/>
                            <div className="food-info-col">
                                <div className="food-name-info">
                                    <div>{this.props.name}</div>
                                    <span>{this.props.popularity}&nbsp;&nbsp;&nbsp;</span>⭐</div>
                                <div className="description">{this.props.description}
                                </div>
                                <div className="food-price-info" dir="rtl"><span className="old-Price">{this.props.oldPrice} </span><span>{this.props.price} تومان</span></div>
                            </div>
                        </div>
                        <div className="info-footer">
                            <div dir="rtl">موجودی: {this.props.count}</div>
                            <div className="minus-plus-info"><i className="flaticon-plus" onClick={this.increase}></i>
                                <div>{this.state.count}</div>
                                <i className="flaticon-minus" onClick={this.decrease}></i></div>
                            <button type="button" className="add-food-btn" onClick={this.addToCart}>اضافه کردن به سبدخرید</button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>



        );
    }

    /*getInventory(){
        fetch('http://localhost:8080/back_master_war_exploded/getDiscountFood/' + this.props.restaurant.id + '-' + this.props.name)
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    inventory: data.count,
                }
            )));
    }

    componentDidMount(){
        this.getInventory()
    }*/
}


export class HeaderHome extends React.Component{

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
        let modalClose = () => { this.setState({modalShow:false}); foodPartySet("tt"); }
        return (
            <header className="header">
                <div className="exit">خروج</div>
                {(this.props.page==="restaurant" || this.props.page==="home" )&&
                <div id="Profile" onClick={this.goToCredit}>حساب کاربری</div>}
                <i className="flaticon-smart-cart" onClick={this.getBasket}></i>
                <div className="logo-container"><img onClick={this.goToHome} src={logo} alt="Logo" id="logo" className="rounded mx-auto d-block"/>
                </div>

                <BasketModalHome
                    show={this.state.modalShow}
                    onHide={modalClose}
                    ordinary={this.state.ordinaryFoods}
                    party={this.state.partyFoods}
                />

            </header>
        );
    }

}

class BasketModalHome extends React.Component {

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










