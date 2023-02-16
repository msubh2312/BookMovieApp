import React, {useState} from 'react';
import "./Header.css"
import logo from "../../assets/logo.svg"
import Button from "@material-ui/core/Button";
function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [inDetailsPage, setInDetailsPage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)


    function handleModalOpen() {
        setIsModalOpen(true)
    }

    function handleModalClose() {
        setIsModalOpen(false)
    }

    return (
        <div>
            <header className="app-header">

                    <img src={logo} alt="logo" className="app-logo"/>

                {!loggedIn ?
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={handleModalOpen}>
                            Login
                        </Button>
                    </div>
                    :
                    inDetailsPage
                        ? <div className="bookshow-button">
                            <Button variant="contained" color="primary">
                                Book Show
                            </Button>
                        </div>
                        :
                    <div className="login-button">
                        <Button variant="contained" color="default">
                            Logout
                        </Button>
                    </div>
                }

            </header>

        </div>
    );
}

export default Header;