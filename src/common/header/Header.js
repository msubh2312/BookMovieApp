import React, { useState } from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem'
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
    // loggedIn: sessionStorage.getItem("access-token") == null ? false : true
    loggedIn: false,
    inDetailsPage: false,

  });

  function handleModalOpen() {
    setState({...state, isModalOpen: true });
  }


  function handleModalClose() {
    setState({...state, isModalOpen: false });
  }
  const loginClickHandler = async () => {
    try {

      const loginDataRaw = await fetch(
          props.baseUrl + "auth/login",
          { method: "POST",
            headers: {
              contentType:'application/json',
              accessControlAllowMethods: 'POST',
              accessControlAllowOrigin: 'http://localhost:8085/',
          Authorization: "Basic " + btoa(state.username + ":" + state.loginPassword),
            }
          }
      );
      const loginData = await loginDataRaw.json();
      if(loginData.toString().includes("id")){
        setState({...state,loggedIn: true});
        sessionStorage.setItem("uuid", loginData.id);
        sessionStorage.setItem("access-token", loginDataRaw.headers["access-token"]);
        handleModalClose();
      }
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
          headers:{
            Accept: "*/*;charset=UTF-8"
          },
          body:JSON.stringify({
          "email_address": state.email,
          "first_name": state.firstname,
          "last_name": state.lastname,
          "mobile_number": state.contact,
          "password": state.registerPassword
          })
        }
    );
    const registrationData = await registrationDataRaw.json();
    if(registrationData.toString().includes("id")&&registrationData.status==="ACTIVE"){
      setState({...state,registrationSuccess: true});


    }
  }

  const tabChangeHandler = (event, value) => {
    // setState({ value });
    console.log("Value: " + value);
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

  // const logoutHandler = (e) => {
  //   // sessionStorage.removeItem("uuid");
  //   // sessionStorage.removeItem("access-token");
  //
  //   setState({...state, loggedIn: false });
  // }

  return (
    <div>
      <header className="app-header">
        <img src={logo} alt="logo" className="app-logo" />

        {!state.loggedIn ? (
          <div className="login-button">
            <Button
              variant="contained"
              color="default"
              onClick={handleModalOpen}
            >
              Login
            </Button>
          </div>
        ) : state.inDetailsPage ? (
          <div className="bookshow-button">
            <Button variant="contained" color="primary">
              Book Show
            </Button>
            <Button variant="contained" color="default">
              Logout
            </Button>
          </div>
        ) : (
          <div className="login-button">
            <Button variant="contained" color="default">
              Logout
            </Button>
          </div>
        )}
      </header>

    </div>
  );
}

export default Header;
