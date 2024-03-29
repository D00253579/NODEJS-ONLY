import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Logo from "../Images/logo.png"
import AccountIcon from "../Images/AccountIcon.png"
import BagIcon from "../Images/BagIcon.png"
import SearchIcon from "../Images/SearchIcon.png"
import {SERVER_HOST, ACCESS_LEVEL_GUEST} from "../config/global_constants";
import SearchDropdown from "./SearchDropdown";
import axios from "axios";

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            searchResults: [],
            searchInput: "",
            userIsLoggedIn: localStorage.accessLevel > ACCESS_LEVEL_GUEST
        }
    }
    componentDidMount() {
        // Fetch products in the parent component
        axios.get(`${SERVER_HOST}/products`)
            .then((res) => {

                        //console.log("Records read to NavBar");
                        this.setState({
                            products: res.data,
                        });


            })
            .catch(err=>{

            })
    }

    handleSearchChange = (e) => {
        this.setState({searchInput: e.target.value})
        if(this.state.searchInput.length > 0) {
            this.handleProductSearch()
        } else {
            this.setState({searchResults: []})
        }
    }

    handleProductSearch = () => {
        let matchingProducts = this.state.products.filter((product) =>
            (product.name.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            product.brand.toLowerCase().includes(this.state.searchInput.toLowerCase()))
        )

        matchingProducts.sort((a, b) => a.name < b.name?-1:1)
        this.setState({searchResults: matchingProducts})
        console.log("Found Products: ",matchingProducts)
    }

    render() {
        //console.log("Search results in NavBar: ",this.state.searchResults)
        return (
            <div className="nav-container">
                <nav>
                    <div className={"container"}>
                        <div className={"search-container"}>
                            <div className="search-bar">
                                <input        
                                    type="text"
                                    id="search"
                                    placeholder="Search for names and brands"
                                    onChange={this.handleSearchChange}
                                />
                                {this.state.searchInput.length > 0 ?
                                    <SearchDropdown
                                        searchResults={this.state.searchResults}
                                    />
                                    : null
                                }
                            </div>
                            <div className={"icons-container"}>
                                <i className={"searchIcon"} onClick={this.handleProductSearch}>
                                    <img src={SearchIcon}/>
                                </i>
                            </div>
                        </div>

                        <div className={"icons-container"}>
                            <i className={"logo-image"}>
                                <img src={Logo} alt="logo"/>
                            </i>
                        </div>

                        {this.state.userIsLoggedIn ? <div className={"icons-container"}>
                            <Link to={`/UserProfile/${localStorage.email}`}>
                                <i className={"account"}>
                                    <img src={AccountIcon} alt="Account Tab"/>
                                </i>
                            </Link>
                        </div> : <div className={"icons-container"}>
                            <Link to={"/AccountPage"}>
                                <i className={"account"}>
                                    <img src={AccountIcon} alt="Account Tab"/>
                                </i>
                            </Link>
                        </div>}
                        <div className={"icons-container"}>
                            <Link to={"/ShoppingCart"}>
                                <i className={"shopping-bag"}>
                                    <img src={BagIcon} alt="Shopping Cart"/>
                                </i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}