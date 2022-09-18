import React, {useState} from 'react';
import {Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {GoogleLogin, googleLogout} from '@react-oauth/google';
import {useDispatch} from 'react-redux';
import jwt_decode from 'jwt-decode';
import useStyles from './styles.js';
import Input from './Input.js';
import Icon from './Icon.js';
import {useHistory} from 'react-router-dom';
import {signIn, signUp} from '../../actions/auth';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setSignUp] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState(initialState);
  const user = false;

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if(isSignUp){
        dispatch(signUp(formData, history));
    } else{
        dispatch(signIn(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const switchMode = () => {
      setSignUp((prev) => !prev);
      handleShowPassword(false);
  };

  // google auth funcs
  const googleSuccess = async (res) => {
      console.log(res);
      const result = jwt_decode(res?.credential);
    
      try {
          dispatch({type: 'AUTH', data: {result}});
          history.push('/');
      } catch (error) {
          console.log(error);
      }
  };
  const googleFailure = (error) => {
      const ERR = 'Google sign in was unsuccessful. Please, try again later.';
      console.log(ERR);
      console.log(error);
  };

  return (
    <Container component = "main" maxWidth="xs">
      <Paper className = {classes.paper} elevation={3}>
        <Avatar className = {classes.avatar}>
          <LockOutlinedIcon/>
          </Avatar>
          <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign in'}</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
           <Grid container spacing={2}>
{
   isSignUp && (
    <>
        <Input name='firstName' handleChange={handleChange} label='First Name' autoFocus half/>
        <Input name='lastName' handleChange={handleChange} label='Last Name' half/>
        
    </>
)
}
<Input name="email" label="Email Address" handleChange={handleChange} type="email" />
<Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
{isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange}  type="password"></Input>}
            </Grid>
            <Button type="submit" fullWidth variant="contained" color ="primary" className = {classes.submit}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_API_TOKEN}>
                        <GoogleLogin 
                            render={(renderProps) => (
                                <Button
                                    className={classes.googleButton}
                                    color='primary'
                                    fullWidth
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    startIcon={<Icon/>}
                                    variant='contained'
                                >
                                    Google Sign in
                                </Button>
                            )}
                            onSuccess={googleSuccess}
                            onFailure={googleFailure}
                            cookiePolicy='single_host_origin'
                        />
                    </GoogleOAuthProvider>

                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignUp ? 'Already have an account? Sign in' : 'New User? Sign up'}
                            </Button>
                        </Grid>
                    </Grid>
          </form>
      </Paper>
    </Container>
  )
}

export default Auth