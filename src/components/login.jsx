import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import firebaseApp from "../utils/firebase";
import 'firebase/firestore';

import store from "../store/store";
import { userLoggedIn, userLoggedOut } from "../ducks/login";

const mapStateToProps = state => {
    return {
    	categories: state.categories,
        login: state.login,
        recipes: state.recipes
    };
};

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            db: firebaseApp.firestore()
        };
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });

    	this.removeListener = firebaseApp.auth().onAuthStateChanged(user => {
	  		if (user) {
                Promise.resolve(store.dispatch(userLoggedIn(user.uid))).then(data => {
                    localStorage.setItem('uid', data.uid);
                    return this.setState({
                        redirect: true,
                        login: false,
                        logout: true
                    });
                });
	       	} else {
                Promise.resolve(store.dispatch(userLoggedOut())).then(data => {
                    localStorage.setItem('uid', data.uid);
                    return this.setState({
                        email: '',
                        password: '',
                        redirect: false,
                        login: true,
                        logout: false
                    });
                });
            }
		});
    }

    componentWillUnmount = () => {
    	this.removeListener();
    }

    preventWindowFromResize = () => {
        document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, height=' + window.innerWidth / this.state.ratio + ', user-scalable=no, initial-scale=1.0, maximum-scale=1.0');
    }

    handleInputChange = (event) => {
    	let target = event.target;
    	let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value
        })
    }

    signUpNewUser = () => {
    	firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
	}

    logInExistingUser = () => {
	  	firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
	  		if (error.code === "auth/user-not-found") {
                this.setState({
                    email: '',
                    password: '',
                }, () => console.log('нету такого пользователя. зарегайтесь'))
            }
	  	});
	}

    logOutExistingUser = () => {
    	firebaseApp.auth().signOut();
    }

    resetPassword = () => {
    	firebaseApp.auth().sendPasswordResetEmail(this.state.email);
    }

    render () {
    	if (this.state.redirect) return (<Redirect to="/" />);

    	let login = this.state.login ? "block" : "none";
    	let logout = this.state.logout ? "block" : "none";

    	return (
    		<div className="login__wrapper">
                <div className="login__logo-wrapper">
                    <div className="login__name">CookBook</div>
                    <div className="login__logo"></div>
                </div>
                <div className="login__form-wrapper">
    			    <input 
                        className="login__input" 
                        type="text" 
                        autoComplete="off" 
                        autoCorrect="off" 
                        autoCapitalize="off" 
                        spellCheck="false" 
                        name="email" 
                        value={this.state.email} 
                        placeholder="Эл. адрес" 
                        onChange={this.handleInputChange} 
                        style={{display: login}}
                        onFocus={this.preventWindowFromResize} 
                    />
        			<input 
                        className="login__input" 
                        type="text" 
                        autoComplete="off" 
                        autoCorrect="off" 
                        autoCapitalize="off" 
                        spellCheck="false" 
                        name="password" 
                        value={this.state.password} 
                        placeholder="Пароль" 
                        onChange={this.handleInputChange} 
                        style={{display: login}}
                        onFocus={this.preventWindowFromResize} 
                    />
        			<div className="login__new-user" onClick={this.signUpNewUser}>зарегистрироваться</div>
        			<div className="login__existing-user" onClick={this.logInExistingUser} style={{display: login}}>Уже зарегистрированы? Войти</div>
        			<button onClick={this.logOutExistingUser} style={{display: logout}}>logout user</button>
        			{/*<button onClick={this.resetPassword}>forgot password?</button>*/}
                </div>
    		</div>
    	)
    }
}

export default connect(mapStateToProps)(Login);