import React,{useEffect} from "react";
import {Container} from '@material-ui/core';
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home/Home.js";
import Auth from "./components/Auth/Auth";
import {GoogleOAuthProvider} from '@react-oauth/google';
import{ gapi } from 'gapi-script';
import PostDetails from "./components/PostDetails/PostDetails.jsx";

const App = () =>{
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => { 
    function start(){ 
      gapi.client.init({
        clientId: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_API_TOKEN, 
        scope: ""
      })
    }
    gapi.load('client:auth2', start);
  });

  return (
    <BrowserRouter>
     <Container maxWidth='xl'>
      <Navbar></Navbar>
        <Switch>
          <Route path="/" exact component={(Home) => <Redirect to='/posts'/>}></Route>
          <Route path='/posts' component={Home} exact/>
          <Route path='/posts/search' component={Home} exact/>
          <Route path='/posts/:id' component={PostDetails}/>
          <Route path="/auth" exact component={() => (!user ? <Auth/> : <Redirect to='/posts'/>)}></Route>
        </Switch>
      </Container>
    </BrowserRouter>
   )
}

export default App;