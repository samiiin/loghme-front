import React from "react";
import {Modal} from "react-bootstrap";
import {CurrentBasket} from "./Restaurant";
import '../css/foodModal.css';
import star from '../images/star.png'
import {Redirect} from "react-router-dom";
export class FoodModal extends React.Component {
    constructor() {
        super();
        this.state = {count:0,addToCartMsg : '', inventory: -1,status:null,redirect:false,redirectPage:""}
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
        this.addFood = this.addFood.bind(this)
    }

    increase(){
        this.setState({count:this.state.count+1})
    }

    decrease(){
        if(this.state.count>0){
            this.setState({count:this.state.count-1})

        }
    }

    addFood(){
        if(this.state.count<=0){
            window.alert("غذایی انتخاب نشده است!")
        }
        else{
            var params = {
                "id": this.props.rid,
                "food" : this.props.name,
                "count" :this.state.count
            };
            var queryString = Object.keys(params).map(function(key) {
                return key + '=' + params[key]
            }).join('&');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization' : "Bearer"+localStorage.getItem('userInfo'),
                    'content-length' : queryString.length,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: queryString
            };
            var address;
            if(this.props.type === "party")
                address = "addDiscountFoodToBasket"
            else
                address = "buyFood"
            fetch('http://localhost:8080/IE/'+address, requestOptions)
                .then(response => response.json())
                .then(data =>{
                    if(data.status!=null && data.status===-1){
                        this.setState({redirect:true,redirectPage:data.message})
                    }
                    else {
                        if (this.props.type === "ordinary" && data.status !== 200)
                            window.alert("غذا از رستوران دیگری انتخاب شده")
                        else if (this.props.type === "party") {
                            window.alert(data.message);
                        }
                    }
                })
                .then( this.setState({count: 0}))
                .then(()=>{if(this.props.type === "ordinary")
                            CurrentBasket("basket-container")})

        }

    }

    render() {
        let backgroundColor = '#4ECCC3';
        let disabled = false;
        let text = 'موجودی: ' + this.props.count;
        let inventory = this.state.count;
        if(this.props.count === 0){
            backgroundColor = '#B8B8B8';
            disabled = true;
            text = 'ناموجود';
            inventory = this.props.count;
        }
        if(this.state.redirect){
            return <Redirect to={"/"+this.state.redirectPage}/>
        }
        else {
            return (
                <Modal
                    {...this.props}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    id="food-info-modal"
                >
                    <Modal.Body id="contained-modal-title-vcenter">
                        <div className="food-info">
                            <div className="info-rname">{this.props.rname}</div>
                            <div className="food-image-info">
                                <img src={this.props.image} alt="Logo" id="logo" className="rounded "/>
                                <div className="food-info-col">
                                    <div className="food-name-info">
                                        <div class="food-title">{this.props.name}</div>
                                        <span><img src={star} className="star"
                                                   alt="star"/>{this.props.popularity}</span></div>
                                    <div className="description">{this.props.description}</div>
                                    {(this.props.type === "party") &&
                                    <div className="food-price-info" id="party-modal" dir="rtl"><span
                                        className="old-Price">{this.props.oldPrice}تومان </span><span>{this.props.price} تومان</span>
                                    </div>}
                                    {(this.props.type === "ordinary") &&
                                    <div className="food-price-info" dir="rtl">{this.props.price}تومان</div>}
                                </div>
                            </div>
                            <div className="info-footer">
                                {(this.props.type === "party") && <div dir="rtl">{text}</div>}
                                <div className="minus-plus-info"><i className="flaticon-plus"
                                                                    onClick={this.increase}></i>
                                    {(this.props.type === "ordinary") && <div>{this.state.count}</div>}
                                    {(this.props.type === "party") && <div>{inventory}</div>}
                                    <i className="flaticon-minus" onClick={this.decrease}></i></div>
                                {(this.props.type === "party") &&
                                <button style={{backgroundColor: backgroundColor}} disabled={disabled} type="button"
                                        className="add-food-btn" onClick={this.addFood}>اضافه کردن به سبدخرید</button>}
                                {(this.props.type === "ordinary") &&
                                <button type="button" className="add-food-btn" onClick={this.addFood}>اضافه کردن به
                                    سبدخرید</button>}
                            </div>
                        </div>

                    </Modal.Body>
                </Modal>

            );
        }
    }
}

//