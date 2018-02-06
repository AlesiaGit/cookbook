import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import ReactSpinner from 'react16-spinjs';

//utils
import { auth } from "../utils/firebase";

//store
import store from "../store/store";
import { userLoggedIn, userLoggedOut } from "../ducks/login";
import { deleteCategory } from "../ducks/categories";
import { deleteRecipe } from "../ducks/recipes";
import { resetMenu } from "../ducks/menu";

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
            spinner: false,
            passwordError: false,
            emailError: false,
            passwordErrorMessage: '',
            emailErrorMessage: '',
            pressed: false
        };
    }

    componentWillMount = () => {
        this.setState({
            ratio: window.innerWidth/window.innerHeight
        });

       	this.removeListener = auth.onAuthStateChanged(user => {
	  		if (user) {
                Promise.resolve(store.dispatch(userLoggedIn(user.uid))).then(data => {
                    localStorage.setItem('uid', data.uid);
                    return this.setState({
                        redirect: true,
                        login: false,
                    });
                });
	       	} else {
                Promise.resolve(store.dispatch(userLoggedOut())).then(data => {
                    let empty = [];
                    store.dispatch(deleteRecipe(empty));
                    store.dispatch(deleteCategory(empty));
                    store.dispatch(resetMenu());
                    localStorage.setItem('uid', data.uid);
                    
                }).then(() => {
                    this.setState({
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
        this.setState({
            spinner: true
        })
    	auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => { 
            this.setState({
                spinner: false
            })
        })
        .catch(error  => {
            console.log(error.code);
            if (error.code === "auth/email-already-in-use") {
                this.setState({
                    email: '',
                    //password: '',
                    emailError: true,
                    emailErrorMessage: "Такой пользователь уже существует"
                });
            }

            if (error.code === "auth/invalid-email") {
                this.setState({
                    email: '',
                    //password: '',
                    emailError: true,
                    emailErrorMessage: "Неверный формат адреса"
                })
            }

            if (error.code === "auth/weak-password") {
                this.setState({
                    //email: '',
                    password: '',
                    passwordError: true,
                    passwordErrorMessage: "Слабый пароль"
                })
            }
        });
	}

    logInExistingUser = () => {
        this.setState({
            spinner: true
        })
	  	auth.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => { 
            this.setState({
                spinner: false
            })
        })
        .catch(error => {
            console.log(error.code);
            if (error.code === "auth/user-not-found") {
                return this.setState({
                    email: '',
                    password: '',
                    emailError: true,
                    emailErrorMessage: "Такого пользователя не существует"
                })
            }

            if (error.code === "auth/wrong-password") {
                return this.setState({
                    email: '',
                    password: '',
                    passwordError: true,
                    passwordErrorMessage: "Неверный пароль"
                })
            }
        });
	}

    logOutExistingUser = () => {
    	auth.signOut();
    }

    resetPassword = () => {
    	auth.sendPasswordResetEmail(this.state.email);
    }

    render () {
    	if (this.state.redirect) return (<Redirect to="/" />);

    	let login = this.state.login ? "block" : "none";
        let spinner = this.state.spinner ? "block" : "none";
        let emailError = this.state.emailError ? "visible" : "hidden";
        let passwordError = this.state.passwordError ? "visible" : "hidden";

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
                    <div className="error" style={{visibility: emailError}}>{this.state.emailErrorMessage}</div>
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
                    <div className="error" style={{visibility: passwordError}}>{this.state.passwordErrorMessage}</div>
        			<button 
                        className="login__new-user" 
                        onClick={this.signUpNewUser}>
                        зарегистрироваться
                    </button>
        			<div 
                        className="login__existing-user" 
                        onClick={this.logInExistingUser} 
                        style={{display: login}}>
                        Уже зарегистрированы? Войти
                    </div>
        			{/*<button onClick={this.resetPassword}>forgot password?</button>*/}
                    <div className="spinner-wrapper" style={{display: spinner}} >
                        <ReactSpinner config={{scale: 1.5, width: 4, color: "ffffff"}}/>
                    </div>
                </div>
    		</div>
    	)
    }
}

export default connect(mapStateToProps)(Login);