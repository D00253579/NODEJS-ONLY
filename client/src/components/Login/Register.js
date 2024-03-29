import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../../config/global_constants"
import LinkInClass from "../LinkInClass";
import NavBar from "../NavBar";
import Footer from "../Footer";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            isRegistered: false,
            selectedFile: null,
            wasSubmittedAtLeastOnce:false,
            errors: { // used to keep track of current validation errors
                name: [],
                email: [],
                password: [],
                confirmPassword: []
            }
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    handleFileChange = (e) => {
        this.setState({selectedFile: e.target.files[0]})
    }

    // Client side validation for Registration page
    // if all of these return true the data will be posted
    validateName() {
        const name = this.state.name
        const errors = [];


        if (/\d/.test(name)) {
            errors.push("Name cannot contain numbers")
        }
        if (/[!"£_'$*^&()+=#.-]/.test(name)) {
            errors.push("Name cannot contain special characters")
        }
        if (!name.trim()) {
            errors.push("Name cannot be empty")
        }

        // update the state of name within errors with the current errors
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                name: errors
            }
        }))
        //console.log("Errors for name: ", errors)
        return errors.length !== 0
    }

    validateEmail() {
        const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z]+.[a-zA-Z]+$/
        const email = this.state.email
        const errors = []


        if (!email.trim()) {
            errors.push("Email cannot be empty")
        }
        if (!pattern.test(email) && email.trim()) {
            errors.push("Invalid email format")
        }

        // update the state of email within errors with the current errors
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                email: errors
            }
        }))
        //console.log("Errors for email: ", errors)
        return errors.length !== 0
    }

    validatePassword() {
        const specialCharPattern = /[!£_"$*^&()+=#.-]/
        const password = this.state.password
        const errors = []


        if (password.length < 8) {
            errors.push("Password must be > 8 characters long")
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least 1 number ")
        }
        if (!specialCharPattern.test(password)) {
            errors.push("Password must contain at least 1 special character !£_$*^&()+=#.-")
        }

        // update the state of password within errors with the current errors
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                password: errors
            }
        }))
        //console.log("Errors for password: ", errors)
        return errors.length !== 0
    }

    validateConfirmPassword() {
        const errors = []


        if (this.state.password !== this.state.confirmPassword) {
            errors.push("Passwords do not match")
        }

        // update the state of confirmPassword within errors with current errors
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                confirmPassword: errors
            }
        }))

        //console.log("Errors for confirmPassword: ", errors)
        return errors.length !== 0
    }

    handleSubmit = (e) => {
        let isNameValid = this.validateName()
        let isEmailValid = this.validateEmail()
        let isPasswordValid = this.validatePassword()
        let isConfirmPasswordValid = this.validateConfirmPassword()
        let formData = new FormData()
        formData.append("profilePhoto", this.state.selectedFile)
        if (!isNameValid && !isEmailValid && !isPasswordValid && !isConfirmPasswordValid) // if inputs have passed validation
        {
            e.preventDefault()

            axios.post(`${SERVER_HOST}/users/Login/Register/${this.state.name}/${this.state.email}/${this.state.password}`, formData, {headers: {"Content-type": "multipart/form-data"}})
                .then(res => {
                    // user successfully registered
                            // console.log("User registered and logged in")
                            localStorage.name = res.data.name
                            localStorage.accessLevel = res.data.accessLevel
                            localStorage.profilePhoto = res.data.profilePhoto
                            localStorage.token = res.data.token
                            this.setState({isRegistered: true})
                })
                .catch(err =>
                {
                    this.setState({wasSubmittedAtLeastOnce: true})
                })
        } else {

            console.log("Current values have not been posted")
        }
        // console.log(this.validateName())
        // console.log(this.state.errors.name)
        // console.log(this.state.errors.email)
        // console.log(this.state.errors.password)
        // console.log(this.state.errors.confirmPassword)

    }

    render() {
        let errorMessage = "";
        if(this.state.wasSubmittedAtLeastOnce)
        {
            errorMessage = <div className="error">Error: All fields must be filled in<br/></div>;
        }
        return (
            <div>
                <div className="register-head-container">
                    <NavBar/>
                </div>
                <div className="register-container">
                    <div className="register-page-box">
                        <h1>CREATE YOUR ACCOUNT</h1>

                        <form className="register-form" noValidate={true} id="loginOrRegistrationForm">
                            {this.state.isRegistered ? <Redirect to="/MainPage"/> : null}
                            {errorMessage}
                            {/*  &#x2022; == unicode for bullet point  */}
                            <div className={"register-section1"}>
                                <label>Name:<span> *</span></label><br/>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    autoComplete="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    ref={(input) => {
                                        this.inputToFocus = input
                                    }}
                                />
                                {this.state.errors.name.length > 0 && this.state.errors.name.map((error, index) => (
                                    <div key={index} className="error-message">
                                        &#x2022; {error}
                                    </div>
                                ))}
                                <br/>
                                <br/>

                                <label>Email Address:<span> *</span> </label><br/>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                                {this.state.errors.email.length > 0 && this.state.errors.email.map((error, index) => (
                                    <div key={index} className="error-message">
                                        &#x2022; {error}
                                    </div>
                                ))}
                                <br/>
                                <div className="register-buttons">
                                    <div className={"submit-btn-container"}>
                                        <LinkInClass value="Register" type="button" className="submit-btn"
                                                     onClick={this.handleSubmit}/> <br/>
                                    </div>
                                </div>
                            </div>

                            <div className="vl"></div>
                            <div className={"register-section2"}>
                                <label>Password:<span> *</span></label><br/>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                                {this.state.errors.password.length > 0 ? (
                                    <div className="password-error-container">
                                        {this.state.errors.password.map((error, index) => (
                                            <div key={index}>
                                                &#x2022; {error}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                                <br/>
                                <br/>

                                <label>Confirm Password:<span> *</span></label><br/>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="confirmPassword"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange}
                                />
                                <div className={"select-profile-image"}>
                                    <label>Add a Profile Picture: </label>
                                    <input type="file" onChange={this.handleFileChange}/>
                                </div>
                                <br/>
                                {this.state.errors.confirmPassword.length > 0 && this.state.errors.confirmPassword.map((error, index) => (
                                    <div key={index} className="error-message">
                                        &#x2022; {error}
                                    </div>
                                ))}
                                <br/><br/>
                            </div>
                            <div className="register-buttons">
                                {/*<LinkInClass value="Register" type="button" className="submit-btn" onClick={this.handleSubmit}/> <br/>*/}
                                <div className={"register-btn-container"}>
                                    <Link to={"/AccountPage"}>
                                        <button className={"cancel-btn"}>
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                                {/*<Link className="red-button" to={"/AccountPage"}>Cancel</Link>*/}
                            </div>
                        </form>
                    </div>
                </div>
                <footer>
                    <Footer/>
                </footer>
            </div>

        )
    }
}