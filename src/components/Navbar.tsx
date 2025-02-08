import "./NavbarStyle.css";
import { Component } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logotwise.png'
const MenuItems = [
    {
        title: "À propos du poisson-lapin",
        url: "/#about",  
        cName: "nav-links",
        icon: "",
        isAnchor: true 
    },
    {
        title: "Identifier un poisson-lapin",
        url: "/#detection",  
        cName: "nav-links",
        icon: "fa-solid fa-question",
        isAnchor: true
    },
    {
        title: "Signaler une apparition",
        url: "/report",  
        cName: "nav-links",
        icon: "fas fa-info-circle",
        isAnchor: false
    }
];

class Navbar extends Component {
    state = { clicked: false };

    handleclick = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    render() {
        return (
            <nav className="navbarItems">
                <Link to="/" className="navbar-logo">
                <img src={logo} alt="Logo" />
                </Link>
                <div className="menu-icons" onClick={this.handleclick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                {item.isAnchor ? (
                                    <a className={item.cName} href={item.url}>
                                        <i className={item.icon}></i>
                                        {item.title}
                                    </a>
                                ) : (
                                    <Link className={item.cName} to={item.url}>
                                        <i className={item.icon}></i>
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export default Navbar;
