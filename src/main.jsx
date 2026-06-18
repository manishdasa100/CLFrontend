import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './Pages/LandingPage'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import ArenaPage from './Pages/ArenaPage'
import LearnTab from './Sections/LearnTab'
import StudyPlans from './Sections/StudyPlans'
import ProblemsTab from './Sections/ProblemsTab'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import ErrorPage from './Pages/ErrorPage'
import ProblemDetailsPage from './Pages/ProblemDetailsPage'
import ListDetailsPage from './Pages/ListDetailsPage'
import App from './App'
import ProtectedRoute from './Components/ProtectedRoute'
import OAuth2Callback from './Pages/OAuth2Callback'
import './index.css'

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App/>}>
        <Route index element={<LandingPage/>}/>
        <Route path='signup' element={<SignUpPage/>}/>
        <Route path='login' element={<LoginPage/>}/>
        <Route path='oauth2/callback' element={<OAuth2Callback/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path='profile/:username' element={<ProfilePage/>}/>
          <Route path='lists/:username/:listName' element={<ListDetailsPage/>}/>
          <Route path='arena' element={<ArenaPage/>}>
            <Route path='learn' element={<LearnTab/>}/>
            <Route path='study-plans' element={<StudyPlans/>}/>
            <Route path='problemset'>
              <Route index element={<ProblemsTab/>}/>
              <Route path=':id' element={<ProblemDetailsPage/>}/>
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<ErrorPage/>}/>
      </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
