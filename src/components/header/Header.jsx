import Subheader1 from './subheader1/Subheader1'
import Subheader2 from './subheader2/Subheader2'
import './Header.css'

const Header = () => {
  return (
    <header className='header-container'>
      <Subheader1 />
      <Subheader2 />
    </header>
  )
}

export default Header