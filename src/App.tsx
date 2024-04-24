import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import Navigation from './components/Navigation';
import Home from './views/Home';
import Container from 'react-bootstrap/Container';
import { UserType } from './types/index';
import { getMe } from './lib/apiWrapper';
import AlertMessage from './components/AlertMessage';
import Login from './views/Login';
import Profile from './views/Profile';

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currenUser, setCurrentUser] = useState<UserType|null>(null);
const [alertMessage, setAlertMessage] = useState<string|undefined>(undefined);
const [category, setCategory] = useState<CategoryType|undefined>(undefined);
useEffect(() => {
  async function getLoggedInUser(){
          const token = localStorage.getItem('token');
          if (token){
              const response = await getMe(token);
              if (response.data){
                  setCurrentUser(response.data)
                  localStorage.setItem('currentUser', JSON.stringify(response.data))
                  setIsLoggedIn(true);
                  console.log(response.data);
              } else {
                  setIsLoggedIn(false);
                  console.warn(response.data);
              }
          }
  }
  getLoggedInUser();
}, [isLoggedIn])
const flashMessage = (newMessage:string|undefined, newCategory:CategoryType|undefined) => {
  setAlertMessage(newMessage);
  setCategory(newCategory);
}
const logUserIn = () => {
  setIsLoggedIn(true);
}
const logUserOut = () => {
  setIsLoggedIn(false);
  setCurrentUser(null);
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExp');
  flashMessage('You have successfully logged out', 'success');
}
  return (
    <>
     <Navigation isLoggedIn={isLoggedIn} logUserOut={logUserOut} />
     <Container>
      { alertMessage && <AlertMessage message={alertMessage} category={category} flashMessage={flashMessage} /> }
       <Routes>
         <Route path='/' element={<Home isLoggedIn={isLoggedIn} currentUser={currenUser} flashMessage={flashMessage} />} />
         <Route path='/login' element={<Login flashMessage={flashMessage} logUserIn={logUserIn}/> } />
         <Route path='/profile' element={<Profile isLoggedIn={isLoggedIn} currentUser={currenUser} flashMessage={flashMessage} />} />
       </Routes>
       </Container>
    </>
  )
}

export default App
