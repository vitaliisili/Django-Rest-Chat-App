import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AppContainer from "./components/AppContainer";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Unauthorized from "./components/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";
import ChatTest from "./pages/ChatTest";

const App = () => {
    return (
        <AppContainer>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Login/>}/>
                    <Route exact path='/registration' element={<Registration/>}/>
                    <Route exact path='/unauthorized' element={<Unauthorized/>}/>
                    <Route exact path='/chat_test' element={<ChatTest/>}/>
                    <Route exact path='/chat' element={<PrivateRoute redirectTo='/'><Chat/></PrivateRoute>}/>
                </Routes>
            </BrowserRouter>
        </AppContainer>
    );
};

export default App;
