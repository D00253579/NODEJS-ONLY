import React, {Component} from "react"
import {Link} from "react-router-dom"
import Filters from "./AdminDashboard/Filters";
import axios from "axios"

import NavBar from "./NavBar";
import ProductTable from "./ProductTable"

import {SERVER_HOST} from "../config/global_constants"
export default class MainPage extends Component {

render()
{
    return (
                   <div>
                       <NavBar/>
                   </div>


    )

}
}