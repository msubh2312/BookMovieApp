import React, {useState} from "react";
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
import Typography from "@material-ui/core/Typography";
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
  return (
      <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
        {props.children}
      </Typography>
  );
}

TabContainer.propTypes = {children: PropTypes.node};

function Header(props) {
  const [registrationSuccess, setRegistrationSuccess] = useState("dispNone");
  const [usernameRequired, setUsernameRequired] = useState("dispNone");
  const [loginPasswordRequired, setLoginPasswordRequired] = useState("dispNone");
  const [firstnameRequired, setFirstnameRequired] = useState("dispNone");
  const [lastnameRequired, setLastnameRequired] = useState("dispNone");
  const [emailRequired, setEmailRequired] = useState("dispNone");
  const [registerPasswordRequired, setRegisterPasswordRequired] = useState("dispNone");
  const [contactRequired, setcontactRequired] = useState("dispNone");
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
    loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    inDetailsPage: false,
    tab:"loginTab",
  });

  //function to handle the click event when login button on header is clicked login/register modal opens
  function handleModalOpen() {
    setState({...state, isModalOpen: true });

  }

//function to close the modal
  function handleModalClose() {
    setState({...state, isModalOpen: false });

  }

  //function to handle login
  const loginClickHandler = async () => {

    if(state.username ===""||state.loginPassword === ""){
      state.username===""?  setUsernameRequired("dispBlock"):setUsernameRequired("dispNone");
      state.loginPassword===""?  setLoginPasswordRequired("dispBlock"):setLoginPasswordRequired("dispNone");
    }else{
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
            setState({...state,loggedIn: true});
          }
        })

        sessionStorage.setItem("uuid", loginData.id);

      }catch (e) {
        console.log(e);

      }
     }

  }
  //function to handle change in username
  const inputUsernameChangeHandler = (e) => {
    setState({ ...state,username: e.target.value });
  }

  //function to handle change in password
  const inputLoginPasswordChangeHandler = (e) => {
    setState({ ...state,loginPassword: e.target.value });
  }

  //function to handle click of register button
  const registerClickHandler = async() => {
    if(state.firstname ===""||state.lastname === ""||state.email === ""||state.registerPassword===""||state.contact===""){
      state.firstname === "" ? setFirstnameRequired("dispBlock"):setFirstnameRequired("dispNone");
      state.lastname === "" ? setLastnameRequired("dispBlock"):setLastnameRequired("dispNone");
      state.email === "" ? setEmailRequired("dispBlock"):setEmailRequired("dispNone");
      state.registerPassword === "" ? setRegisterPasswordRequired("dispBlock"):setRegisterPasswordRequired("dispNone");
      state.contact === "" ? setcontactRequired("dispBlock"):setcontactRequired("dispNone");
    }else{
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
    if(registrationData.status==="ACTIVE"){
      await setRegistrationSuccess(true)
      //resetting the form data to the default state
      setState({...state,firstname: ""})
      setState({...state,lastname: ""})
      setState({...state,email: ""})
      setState({...state,contact: ""})
      setState({...state,registerPassword: ""})
    }
    }

  }

  //function to handle tab change
  const tabChangeHandler = (event, value) => {
    setState({...state, value:value });
  }

  //function to handle change in first name
  const inputFirstNameChangeHandler = (e) => {
    setState({ ...state,firstname: e.target.value });
  }
  //function to handle change in last name
  const inputLastNameChangeHandler = (e) => {
    setState({ ...state,lastname: e.target.value });
  }
  //function to handle change in email
  const inputEmailChangeHandler = (e) => {
    setState({ ...state,email: e.target.value });
  }
  //function to handle change in password in register tab
  const inputRegisterPasswordChangeHandler = (e) => {
    setState({ ...state,registerPassword: e.target.value });
  }
  //function to handle change in contact number
  const inputContactChangeHandler = (e) => {
    setState({ ...state,contact: e.target.value });
  }

  //function to handle log out
  const logoutHandler = (e) => {
    sessionStorage.removeItem("uuid");
    sessionStorage.removeItem("access-token");

    setState({...state, loggedIn: false });
  }

  return (
    <div>
      <header className="app-header">
        <img src={logo} alt="logo" className="app-logo" />
        {/*if loggedIn state is not true then Login button is shown*/}
        {!state.loggedIn ?

            <div className="login-button">
              <Button variant="contained" color="default" onClick={handleModalOpen}>
                Login
              </Button>
            </div>
            :
            //if loggedIn state is true then Logout button is shown
            <div className="login-button">
              <Button variant="contained" color="default" onClick={logoutHandler}>
                Logout
              </Button>
            </div>
        }
        {/*show bookShow Button will be set to true when user */}
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
      <Modal
          isOpen={state.isModalOpen}
          contentLabel="Minimal Modal Example"
          style={customStyles}
          ariaHideApp={false}
          onRequestClose={handleModalClose}
      >
        <Tabs value={state.value} onChange={tabChangeHandler}>
          <Tab label="Login" onClick={()=>setState({...state,value: 0})}/>
          <Tab label="Register" onClick={()=>setState({...state,value: 1})}/>
        </Tabs>
        {
          state.value===0 && (
              <div style={{textAlign:"center"}}>
                <FormControl required>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" type="text" username={state.username} onChange={inputUsernameChangeHandler} />
                    <FormHelperText className={usernameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  <FormControl required>
                    <InputLabel htmlFor="loginPassword">Password</InputLabel>
                    <Input id="loginPassword" type="password" loginpassword={state.loginPassword} onChange={inputLoginPasswordChangeHandler} />
                    <FormHelperText className={loginPasswordRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  {state.loggedIn === true &&
                      <FormControl>
                                    <span className="successText">
                                        Login Successful!
                                    </span>
                      </FormControl>
                  }
                  <br /><br />
                  <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
            </div>
            )
        }
        {
            state.value===1 && (
                <div style={{textAlign:"center"}}>
                  <FormControl required>
                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                    <Input id="firstname" type="text" firstname={state.firstname} onChange={inputFirstNameChangeHandler} />
                    <FormHelperText className={firstnameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  <FormControl required>
                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                    <Input id="lastname" type="text" lastname={state.lastname} onChange={inputLastNameChangeHandler} />
                    <FormHelperText className={lastnameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  <FormControl required>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="text" email={state.email} onChange={inputEmailChangeHandler} required={true}/>
                    <FormHelperText className={emailRequired}  >
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  <FormControl required>
                    <InputLabel htmlFor="registerPassword">Password</InputLabel>
                    <Input id="registerPassword" type="password" registerpassword={state.registerPassword} required={true} onChange={inputRegisterPasswordChangeHandler} />
                    <FormHelperText className={registerPasswordRequired}  >
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  <FormControl required>
                    <InputLabel htmlFor="contact">Contact No.</InputLabel>
                    <Input id="contact" type="text" contact={state.contact} onChange={inputContactChangeHandler} />
                    <FormHelperText className={contactRequired} >
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br /><br />
                  {registrationSuccess === true &&
                      <FormControl>
                                    <span className="successText">
                                        Registration Successful. Please Login!
                                      </span>
                      </FormControl>
                  }
                  <br /><br />
                  <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                </div>
            )
        }
        {/*<button onClick={handleModalClose}>Close Modal</button>*/}
      </Modal>
    </div>
  );
}

export default Header;