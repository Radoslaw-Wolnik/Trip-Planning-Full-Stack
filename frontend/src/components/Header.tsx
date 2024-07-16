import React from 'react'
import { Link } from 'react-router-dom'
import buy from '../assets/buy.json'
import { useModal } from '../hooks/useModal';
import LoginForm from './LoginForm';
import Product from './Product';


//interface HeaderProps {
//  openModal: (newContent: ModalContent) => void;
//}

//const Header: React.FC<HeaderProps> = ({ openModal }) => {
const Header: React.FC = () => {
  const { openModal } = useModal();

  const handleOpenLogin = () => {
    openModal(<LoginForm />);
  };

  const handleOpenProduct = () => {
    openModal(<Product Details={buy} />);
  };

  return (
    <div className='navbar'>
      <Link to='/'>
        <h4>Home</h4>
      </Link>
      <Link to='/About'>
        <h4>About</h4>
      </Link>
      <Link to='/Main'>
        <h4>Main Function</h4>
      </Link>
      <button onClick={handleOpenLogin}>Login</button>
      <button onClick={handleOpenProduct}>Buy</button>
    </div>
  )
}

export default Header
