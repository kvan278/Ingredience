import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import isAuthenticated from './auth/isAuthenticated'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MealDetails from './Components/MealDetails'
import Header from './Components/Header'
import Auth from './Components/Auth'
import Inventory from './Components/Inventory'
import ShoppingList from './Components/ShoppingList'
import Profile from './Components/Profile'
import Help from './Components/Help'

function App() {
    const PrivateWrapper = () => {
        return isAuthenticated() ? <Outlet /> : <Navigate to='/auth' />
    }
    return (
        <BrowserRouter>
            <div>
                <Header />
                <ToastContainer />
                <Routes>
                    <Route exact path='/' element={<Auth />} />
                    <Route exact path='/home' element={<Home />} />
                    <Route exact path='/meal' element={<MealDetails />} />
                    <Route exact path='/inventory' element={<Inventory />} />
                    <Route exact path='/shopping-list' element={<ShoppingList />} />
                    <Route exact path='/profile' element={<Profile />} />
                    <Route exact path='/help' element={<Help />} />

                    <Route element={<PrivateWrapper />}>
                        <Route exact path='/protected' element={<Home />} />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
