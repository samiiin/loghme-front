import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../images/LOGO.png';
import '../css/home.css';
import {Restaurant} from './Restaurant';
import {FoodModal} from './FoodModal'
import {Header} from './Header'
import {Spinner} from './Spinner'

export function foodPartySet (id){
        fetch('http://localhost:8080/IE/DiscountFoods')
            .then(resp => resp.json())
            .then(data => {
                if(document.getElementById("party-box")) {
                    ReactDOM.render(<FoodParty discounts={data} loading={false}/>, document.getElementById(id))
                }
                }
            )
}



export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants : [],
            loading: false,
        };
    }
    render(){
        return (

            <div>
                <Header page="home" />
                <HomeDescription />
                <div id="party-box">
                    {foodPartySet ("party-box")}
                </div>
                <div id="restaurants-container">
                    <div className="titre">رستوران ها</div>
                    <RestaurantContainer loading={this.state.loading} restaurants={this.state.restaurants}/>
                </div>
                <div id="footer">
                    &copy; تمامی حقوق متعلق به لقمه است
                </div>

            </div>
        );
    }

    componentDidMount() {
        this.setState({loading:true,})
        fetch('http://localhost:8080/IE/restaurants')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    restaurants: data,
                    loading:false,
                }
            )));

    }

}

export class Restaurants extends React.Component{

    render() {
        return(
            <div id="restaurants">
                {this.props.restaurants.map(function (restaurants,index) {
                        return <RestaurantIcon restaurantid={restaurants.id} restaurantname={restaurants.name} restaurantlogo={restaurants.logo} />
                    }

                )}
            </div>
        );
    }
}

export class RestaurantContainer extends React.Component{

    render() {
        if(this.props.loading){
            return <Spinner />
        }
        else{
            return <Restaurants restaurants={this.props.restaurants}/>
        }
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
                <img src={this.props.restaurantlogo} alt="Logo" id="logo" class="rounded mx-auto d-block" />
                <div class="restaurantname">{this.props.restaurantname}</div>
                <button class="form-button rounded" type="submit" onClick={(e) => this.showMenu(e, this.props.restaurantid)}>نمایش منو</button>
            </div>

        );

    }
}


export class HomeDescription extends React.Component{

    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.state = {
            food: "",
            restaurant: "",
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }


    search(event){

        if((this.state.food === "") && (this.state.restaurant === "")){
            window.alert("خطا! حداقل یک فیلد را پر کنید.");
            return;
        }


        event.preventDefault();
        var params = {
            "food": this.state.food,
            "restaurant": this.state.restaurant,
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

        ReactDOM.render( <div><div className="titre">رستوران ها</div>
            <RestaurantContainer loading={true} restaurants={''}/></div>, document.getElementById("restaurants-container"));

        fetch('http://localhost:8080/IE/search', requestOptions)
            .then(response => response.json())
            .then(data =>{ReactDOM.render( <><div className="titre">رستوران ها</div>
                <RestaurantContainer loading={false} restaurants={data}/> </>, document.getElementById("restaurants-container"));}
            )
            .then(data => this.setState(prevState => ({
                    food: "",
                    restaurant: "",
                }
            )));
        document.getElementById('restaurantField').value =''
        document.getElementById('foodField').value =''
    }

    render(){
        return(
            <div class="home-logo-environment">
                <div class="layer"></div>
                <div class="enviroment-content">
                    <div id="description">
                        <img src={logo} alt="Logo" id="logo" class="rounded mx-auto d-block" />
                        <div class="description-text">اولین و بزرگ ترین وب سایت سفارش آنلاین غذا در دانشگاه تهران</div>
                    </div>
                </div>
                <div class="search-box-container">
                    <div className="search-box">
                        <input className="search-food rounded" name="food" id="foodField" onChange={this.handleChange} type="text" placeholder="نام غذا"/>
                        <input className="search-restaurant rounded" name="restaurant" id="restaurantField" onChange={this.handleChange} type="text" placeholder="نام رستوران"/>
                        <button className="search-button rounded" onClick={this.search} type="submit">جست و جو</button>
                    </div>
                </div>
            </div>
        );
    }

}

export class PartyFoods extends React.Component{
    render() {
        var discountfoods = this.props.discountfoods
        return(
            <>
                {discountfoods.map(function (discountfoods, index) {
                        return <DiscountFood discountfood={discountfoods}/>
                    }
                )}
            </>
        );
    }
}

export class FoodPartyContainer extends React.Component{
    render() {
        if(this.props.loading){
            return <Spinner />
        }
        else{
            return <PartyFoods discountfoods={this.props.discountfoods} />
        }
    }
}

export class FoodParty extends React.Component{
    myInterval = 0;
    constructor(props) {
        super(props);
        this.state = {
            discountFoods : [],
            time : 0,
            loading: false,
        };
    }
    render(){
        var discountfoods = this.props.discounts;
        let loadingAttr = false;
        if(this.state.loading){
            loadingAttr = true;
            this.setState({loading: false,})
        }

        if(loadingAttr === true){
            return <Spinner />
        }

        return(
            <div id="food-party">
                <div class="titre">جشن غذا!</div>
                <div class="rounded timer">زمان باقی مانده: &nbsp;<span >{Math.floor((this.state.time) / 60)}</span>:<span>{(this.state.time) % 60}</span>&nbsp;</div>
                <div className="scrollmenu">
                    {discountfoods.map(function (discountfoods, index) {
                            return <DiscountFood discountfood={discountfoods}/>
                        }
                    )}
                </div>
            </div>
        );
    }

    getTime() {
        fetch('http://localhost:8080/IE/FoodPartyTime')
            .then(resp => resp.json())
            .then(data => this.setState(prevState => ({
                    time: data.remainingTime,
                }
            )));
    }


    componentDidMount() {
        this.setState({loading: true,})
        foodPartySet("party-box")
        this.getTime()
        this.myInterval = setInterval(() => {
            if(document.getElementById("party-box")) {
                this.getTime()
                if (this.state.time === 85 || this.state.time === 1) {
                    foodPartySet("party-box")
                }
            }
            else{
                clearInterval(this.myInterval)
            }

        }, 1000);
    }
}


export class DiscountFood extends React.Component {

    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
        this.showModal = this.showModal.bind(this);
        this.state = {
            count: this.props.discountfood.discountFood.count,
            addToCartMsg: '',
            modalShow: false,
        };
    }

    addToCart(event, restaurantid, foodname) {
        event.preventDefault();
        var params = {
            "id": restaurantid,
            "food": foodname,
            "count": 1,
        };
        var queryString = Object.keys(params).map(function (key) {
            return key + '=' + params[key]
        }).join('&');
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-length': queryString.length,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: queryString
        };

        fetch('http://localhost:8080/IE/addDiscountFoodToBasket', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState(prevState => ({addToCartMsg: data.message,}));
                window.alert(this.state.addToCartMsg);
            });

    }


    showModal() {
        this.setState(prevState => ({modalShow: true}))
    }

    render() {
        let backgroundColor = '#4ECCC3';
        let disabled = false;
        let text = 'موجودی: ' + this.props.discountfood.discountFood.count;
        let modalClose = () => this.setState({modalShow: false})
        if (this.props.discountfood.discountFood.count === 0) {
            backgroundColor = '#B8B8B8';
            disabled = true;
            text = 'ناموجود';
        }
        return (
            <div class="discountFood rounded">
                <div class="restaurant-photo-name">
                    <img src={this.props.discountfood.discountFood.image} onClick={this.showModal}
                         alt="discountFoodImage" id="discountFoodImage" class="rounded mx-auto d-block square"/>
                    <div
                        class="discountFoodName">{this.props.discountfood.discountFood.name}<br/> {this.props.discountfood.discountFood.popularity} ⭐
                    </div>
                </div>
                <div class="prices">
                    <span class="old-Price">{this.props.discountfood.discountFood.oldPrice}</span> &nbsp; &nbsp;
                    <span>{this.props.discountfood.discountFood.price}</span>
                </div>
                <div class="buttons">
                    <span class="remained rounded">{text}</span> &nbsp;
                    <button style={{backgroundColor: backgroundColor}} disabled={disabled} class="form-button rounded"
                            type="submit"
                            onClick={(e) => this.addToCart(e, this.props.discountfood.ownerRestaurantID, this.props.discountfood.discountFood.name)}>خرید
                    </button>

                </div>
                <div dir="rtl" class="restaurantName">
                    {this.props.discountfood.ownerRestaurantName}
                </div>
                <FoodModal show={this.state.modalShow} onHide={modalClose}
                           rname={this.props.discountfood.ownerRestaurantName}
                           rid={this.props.discountfood.ownerRestaurantID}
                           price={this.props.discountfood.discountFood.price}
                           oldPrice={this.props.discountfood.discountFood.oldPrice}
                           type="party" count={this.props.discountfood.discountFood.count}
                           image={this.props.discountfood.discountFood.image}
                           description={this.props.discountfood.discountFood.description}
                           name={this.props.discountfood.discountFood.name}
                           popularity={this.props.discountfood.discountFood.popularity}
                />

            </div>

        );

    }
}
