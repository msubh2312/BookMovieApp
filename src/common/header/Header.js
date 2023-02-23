import React, {useEffect, useState} from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';
import {Tab, Tabs} from "@material-ui/core";
import * as PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Link} from "react-router-dom";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};


function TabContainer(props) {
  return null;
}

TabContainer.propTypes = {children: PropTypes.node};

function Header(props) {

  const [state,setState] = useState({

    isModalOpen: false,
    value: 0,
    username: "",
    loginPassword: "",
    firstname: "",
    lastname: "",
    email: "",
    registerPassword: "",
    contact: "",
    registrationSuccess: false,
    loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    // loggedIn: false,
    inDetailsPage: false,
    tab:"loginTab",
    usernameRequired: "dispNone",
    loginPasswordRequired: "dispNone",
    firstnameRequired: "dispNone",
    lastnameRequired: "dispNone",
    emailRequired: "dispNone",
    registerPasswordRequired: "dispNone",
    contactRequired: "dispNone",
  });

  function handleModalOpen() {
    setState({...state, isModalOpen: true });
  }

  useEffect(() => {
    // window.location.reload();
  }, [state.loggedIn]);

  function handleModalClose() {
    setState({...state, isModalOpen: false });
    window.location.reload();
  }
  const loginClickHandler = async () => {
    try {

      const loginDataRaw = await fetch(
          props.baseUrl + "auth/login",
          { method: "POST",
            headers: {
              'Access-Control-Allow-Origin':"*",
              Authorization: "Basic " + btoa(state.username + ":" + state.loginPassword),
            }
          }
      );
      const loginData = await loginDataRaw.json();
      loginDataRaw.headers.forEach((val, key)=> {
        if(key==="access-token"){
          sessionStorage.setItem("access-token", val)
        }
      })

        sessionStorage.setItem("uuid", loginData.id);
        handleModalClose();
    }catch (e) {
      console.log(e);
    }


  }

  const inputUsernameChangeHandler = (e) => {
    setState({ ...state,username: e.target.value });
  }

  const inputLoginPasswordChangeHandler = (e) => {
    setState({ ...state,loginPassword: e.target.value });
  }

  const registerClickHandler = async() => {

    const registrationDataRaw = await fetch(
        props.baseUrl + "signup",
        { method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(
              {
                "email_address": state.email,
                "first_name": state.firstname,
                "last_name": state.lastname,
                "mobile_number": state.contact,
                "password": state.registerPassword,
              })
        }
    );
    const registrationData = await registrationDataRaw.json();
    console.log(registrationData)
    if(registrationData.status==="ACTIVE"){

      setState({...state,registrationSuccess: true});
      setState({...state,value: 0});
      console.log("Signup Success")
      console.log(state.registerPassword);

      setState({...state,firstname: ""})
      setState({...state,lastname: ""})
      setState({...state,email: ""})
      setState({...state,contact: ""})
      setState({...state,registerPassword: ""})
    }
  }

  const tabChangeHandler = (event, value) => {
    setState({...state, value:value });
  }

  const inputFirstNameChangeHandler = (e) => {
    setState({ ...state,firstname: e.target.value });
  }

  const inputLastNameChangeHandler = (e) => {
    setState({ ...state,lastname: e.target.value });
  }

  const inputEmailChangeHandler = (e) => {
    setState({ ...state,email: e.target.value });
  }

  const inputRegisterPasswordChangeHandler = (e) => {
    setState({ ...state,registerPassword: e.target.value });
  }

  const inputContactChangeHandler = (e) => {
    setState({ ...state,contact: e.target.value });
  }

  const logoutHandler = (e) => {
    sessionStorage.removeItem("uuid");
    sessionStorage.removeItem("access-token");

    setState({...state, loggedIn: false });
  }

  return (
    <div>
      <header className="app-header">
        <img src={logo} alt="logo" className="app-logo" />

        {!state.loggedIn ?

            <div className="login-button">
              <Button variant="contained" color="default" onClick={handleModalOpen}>
                Login
              </Button>
            </div>
            :
            <div className="login-button">
              <Button variant="contained" color="default" onClick={logoutHandler}>
                Logout
              </Button>
            </div>
        }
        {props.showBookShowButton === "true" && !state.loggedIn
            ? <div className="bookshow-button">
              <Button variant="contained" color="primary" onClick={handleModalOpen}>
                Book Show
              </Button>
            </div>
            : ""
        }

        {props.showBookShowButton === "true" && state.loggedIn
            ? <div className="bookshow-button">
              <Link to={"/bookshow/" + props.id}>
                <Button variant="contained" color="primary">
                  Book Show
                </Button>
              </Link>
            </div>
            : ""
        }
      </header>

    </div>
  );
}

export default Header;
