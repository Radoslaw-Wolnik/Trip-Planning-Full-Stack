// import React from 'react'
import { Link } from 'react-router-dom'
import '/src/style/Fototer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className='navbar'>
        <div className='column'>
          <h4>Menu</h4>
          <Link to='/'><h4>Home</h4></Link>
          <Link to='/About'><h4>About</h4></Link>
        </div>
        <div className='column'>
          <h4>Contact</h4>
          <div className='row'><h4>tel: </h4> <Link to='/'><p>2134</p></Link></div>
          <div className='row'><h4>e-mail: </h4> <Link to='/'><p>mail</p></Link></div>
          
        </div>
        <div className='column'>
          <h4>Socials</h4>
          <Link to='/'><h4>FB</h4></Link>
          <Link to='/'><h4>IG</h4></Link>
          <Link to='/'><h4>X</h4></Link>
        </div>
      </div>
      <div className='bottom'>
        <div className='copyright'>&copy; Template</div>
        <div className='leagal-links'>
          <Link to='/Legal'>legal links</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer