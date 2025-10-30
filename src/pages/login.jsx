import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, just redirect to home without validation
    navigate('/home')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to UbicAir</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="signup-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
