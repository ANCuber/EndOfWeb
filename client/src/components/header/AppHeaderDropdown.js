import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logout, clearImgSrc, clearStudentInfo, selectLogin } from '../../slices/loginSlice'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { imgSrc, studentID } = useSelector(selectLogin)
  const handleLogOut = (e) => {
    e.preventDefault()
    axios
      .post('/api/logout', {})
      .then((res) => {
        alert('登出成功!')
        dispatch(logout())
        dispatch(clearImgSrc())
        dispatch(clearStudentInfo())
        history.push('/home')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/* <h6>src/components/header/AppHeaderDropDown/CAvator</h6> */}
        <CAvatar size="md" src={imgSrc} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Your Space</CDropdownHeader>
        <CDropdownItem component={Link} to={`/profile/${studentID}`}>
          <CIcon icon={React.icons.cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem component={Link} to="/own_recruitment">
          <CIcon icon={React.icons.cilUser} className="me-2" />
          Your Recruitment
        </CDropdownItem>

        <CDropdownItem component={Link} to={`/own_recommendation`}>
          <CIcon icon={React.icons.cilUser} className="me-2" />
          Your Recommendation
        </CDropdownItem>

        <CDropdownItem component={Link} to={`/change_password`}>
          <CIcon icon={React.icons.cilLockLocked} className="me-2" />
          Change Password
        </CDropdownItem>

        {/* <CDropdownItem href="#">
          <CIcon name="cilCreditCard" className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogOut}>
          <CIcon icon={React.icons.cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
