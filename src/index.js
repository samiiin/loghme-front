import React from 'react';
import ReactDOM from 'react-dom';
import {Login} from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Signup} from "./components/Signup";
import {Home} from "./components/Home";
import {Credit} from "./components/Credit";
import {Restaurant} from "./components/Restaurant";
import {Orders} from "./components/Orders";
ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/"><Login /></Route>

            <Route path="/login"><Login /></Route>

            <Route path="/signup"><Signup /></Route>

            <Route path="/home"><Home /></Route>

            <Route path="/credit"><Credit /></Route>

            <Route path="/restaurant/:id" render={({match}) => (<Restaurant id={match.params.id} />)}/>

            <Route path="/orders"><Orders /></Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
