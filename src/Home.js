import React from 'react';
import ReactDOM from 'react-dom';
import logo from './images/LOGO.png';
import './css/home.css';
import {Restaurant} from './restaurant';
import {Header} from './Header'


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
        <Header page="home"/>
        <HomeDescription />
        <FoodParty />
        <div id="restaurants-container">
               	  <div class="titre">رستوران ها</div>
               	  <div id="restaurants">
                           {this.state.restaurants.map(function (restaurants,index) {
                                   return <RestaurantIcon restaurantid={restaurants.id} restaurantname={restaurants.name} restaurantlogo={restaurants.logo} />
                               }

                           )}
               	  </div>
               </div>

	  </div>
      );
  }

  componentDidMount() {

          fetch('http://localhost:8080/server_war/restaurants')
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
            startUp : true,
        };
    }

   render(){
      return(
     	<div id="food-party">
     	  <div class="titre">جشن غذا!</div>
     	  <div class="rounded timer">زمان باقی مانده: &nbsp;<span >87</span>:<span>00</span>&nbsp;</div>
     	  <div class="scrollmenu">
                    {this.state.discountFoods.map(function (discountFoods,index) {
                            return <DiscountFood discountfood={discountFoods} />
                        }

                    )}
     	 </div>
     	</div>
     );
   }

   fetchFoods(){
                fetch('http://localhost:8080/server_war/getDiscountFoods')
                 .then(resp => resp.json())
                 .then(data => this.setState(prevState => ({
                       discountFoods: data,
                     }
                     )));
   }

     componentDidMount() {

          this.fetchFoods();
          this.timerId = setInterval(
          () => {this.fetchFoods()}
          , 100);
     }

}

export class DiscountFood extends React.Component{

     constructor(props) {
          super(props);
          this.addToCart = this.addToCart.bind(this);
          this.state = {
             count: this.props.discountfood.discountFood.count,
             addToCartMsg : ''
          };
     }

     addToCart(event,restaurantid,foodname){
        event.preventDefault();

        var params = {
		    "id": restaurantid,
		    "food" : foodname,
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

	    fetch('http://localhost:8080/server_war/addDiscountFoodToBasket', requestOptions)
	        .then(response => response.json())
	        .then(data => this.setState(prevState => ({count: data.remainingCount, addToCartMsg: data.message,})));

     }

    render(){
        return(
		            <div class="discountFood rounded">
       		  <div class="restaurant-photo-name">
       			<img src={this.props.discountfood.discountFood.image} alt="discountFoodImage" id="discountFoodImage" class="rounded mx-auto d-block square" />
       			<div class="discountFoodName">{this.props.discountfood.discountFood.name}<br/> {this.props.discountfood.discountFood.popularity} *</div>
       		  </div>
       		  <div class="prices">
       		      <span class="main-price">{this.props.discountfood.discountFood.price}</span> &nbsp &nbsp &nbsp;<span>{this.props.discountfood.discountFood.oldPrice}</span>
       		  </div>
       		  <div class="buttons">
       		   <span class="remained rounded">موجودی: {this.state.count}</span> &nbsp; <button class="form-button rounded" type="submit"  onClick={(e) => this.addToCart(e, this.props.discountfood.ownerRestaurant.id, this.props.discountfood.discountFood.name)}>خرید</button>

       		  </div>
       		  <div class="restaurantName">
       		      {this.props.discountfood.ownerRestaurant.name}
       		  </div>
       		</div>


        );

    }

}




