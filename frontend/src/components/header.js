import {Link} from 'react-router-dom'

function Header(){
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

     const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    // optionally remove token too
    window.location.href = '/login';
  };

  
    return(
        <header className="bg-white flex rounded-2xl items-center mx-1 my-1 py-2 text-black">
             <div className="text-2xl font-bold ml-10">Dociffy</div>
               
                    <ul className="flex space-x-3 ml-52 px-1 py-1">
                    <Link to="/" className="px-1 text-lg font-mono font-bold hover:underline">Home</Link>
                    <Link to="/verify" className="px-1 text-lg font-mono font-bold hover:underline">Verify</Link>
                    <a href="#aboutSection" className="px-1 text-lg font-mono font-bold hover:underline">About Us</a>
                     </ul>   
                
                {!isLoggedIn ? (
                <>
                <Link to="/login" className='ml-auto rounded-full px-4 py-2 hover:scale-105 text-sm' >Login</Link>
                <Link to='/signup' className='text-black rounded-full px-4 py-2 hover:scale-105 text-sm border-2 border-black'>Sign Up</Link>
                </>
                ) : (
                    <button onClick={handleLogout} className="text-black rounded-full px-4 py-2 hover:scale-105 text-sm border-2 border-black ml-auto">Logout</button>
                )}
        </header>
    )

}
export default Header;