import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectLogin, login } from '../../../slices/loginSlice'
import { Redirect, Link, useLocation } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

const LoginFormTemplate = {
  account: '',
  password: '',
}

const Login = () => {
  const { search } = useLocation()
  const redirectURL = new URLSearchParams(search).get('pathFrom') || '/dashboard'

  const dispatch = useDispatch()
  const { isLogin } = useSelector(selectLogin)
  const [needRegister, setNeedRegister] = useState(false)
  const [loginForm, setLoginForm] = useState({
    ...LoginFormTemplate,
    showPwd: false,
  })
  const handleInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // connect with backend
    // check if login
    // if success then redirect inside
    axios
      .post('api/login', loginForm)
      .then((res) => {
        const { username, isAuth } = res.data
        alert(`歡迎回來! ${username}`)
        dispatch(login(isAuth))
      })
      .catch((err) => {
        switch (err.response.status) {
          case 404:
            alert(err.response.data.description)
            setNeedRegister(true)
            break
          default:
            alert(err.response.data.description)
            break
        }
      })
  }

  const handleShowPwd = (e) => {
    setLoginForm({ ...loginForm, showPwd: !loginForm.showPwd })
    const inputPwd = document.querySelector('input[name="password"]')
    if (inputPwd.type === 'password') {
      inputPwd.type = 'text'
    } else {
      inputPwd.type = 'password'
    }
  }

  const handleFBSubmit = (res) => {
    if (res.status == 'unknown') {
      return
    }
    // call backend
    // send res.userID
    axios
      .post('/api/loginFB', { facebookID: res.userID })
      .then((res) => {
        const { username, isAuth } = res.data
        alert(`歡迎回來! ${username}`)
        dispatch(login(isAuth))
      })
      .catch((err) => {
        switch (err.response.status) {
          case 404:
            alert(err.response.data.description)
            setNeedRegister(true)
            break
          default:
            alert(err.response.data.description)
            break
        }
      })
  }
  if (isLogin) {
    return <Redirect to={redirectURL}></Redirect>
  } else if (needRegister) {
    return <Redirect to="/register_entry"></Redirect>
  } else {
    return (
      <div className="min-vh-100 d-flex flex-row align-items-center">
        <CContainer className="align-items-center">
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                    >
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={React.icons.cilEducation} />
                        </CInputGroupText>
                        <CFormControl
                          placeholder="Student ID"
                          name="account"
                          onChange={handleInputChange}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={React.icons.cilLockLocked} />
                        </CInputGroupText>
                        <input
                          type="password"
                          placeholder="Password"
                          name="password"
                          onChange={handleInputChange}
                          className="form-control"
                        />
                        <CButton color="transparent" onClick={handleShowPwd}>
                          {loginForm.showPwd ? <Visibility /> : <VisibilityOff />}
                        </CButton>
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <Link to="/register_entry" color="link" className="px-0">
                            Create a new account?
                          </Link>
                        </CCol>
                        <CCol xs="6" className="d-flex justify-content-end">
                          <Link to="/forget" color="link" className="px-0">
                            Forgot password?
                          </Link>
                        </CCol>
                      </CRow>
                      <CRow className="mt-3">
                        <CCol className="d-flex justify-content-center">
                          <CButton color="dark" className="px-4" onClick={handleSubmit}>
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                      {/* <CRow className="justify-content-center">
                        <div
                          className="w-75 text-center mt-3 pt-3"
                          style={{ borderTop: '1px solid gray' }}
                        >
                          or login with...
                        </div>
                      </CRow>
                      <CRow className="justify-content-center">
                        <div style={{ width: '5rem' }}>
                          <FacebookLogin
                            appId={process.env.REACT_APP_fbAPIid || '571174603253755'}
                            autoLoad={false}
                            isMobile={false}
                            fields="name,email,picture"
                            callback={handleFBSubmit}
                            cssClass="btnFacebook d-flex justify-content-center mt-2"
                            icon={React.icons.fa-facebook}
                            name="fa-facebook"
                            textButton=""
                          />
                        </div>
                      </CRow> */}
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Login
