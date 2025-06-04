import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NET from 'vanta/dist/vanta.net.min';
import { URL } from '../services/endpoints';

const palette = {
  light: {
    background: "#e9ecfa",
    card: "rgba(255,255,255,0.80)",
    border: "#e3e7ee",
    accent: "#6C63FF",
    accent2: "#00C9A7",
    text: "#232946",
    placeholder: "#b0b4c1"
  },
  dark: {
    background: "#15151f",
    card: "rgba(33,34,53,0.86)",
    border: "#27283c",
    accent: "#6C63FF",
    accent2: "#00C9A7",
    text: "#f5f6fa",
    placeholder: "#6a6d8e"
  }
};

const Login = ({onLogin}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Vanta background limited to login
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  useEffect(() => {
    if (vantaEffect.current) vantaEffect.current.destroy();
    vantaEffect.current = NET({
      el: vantaRef.current,
      color: darkMode ? 0x6C63FF : 0x00C9A7,
      backgroundColor: darkMode ? 0x15151f : 0xe9ecfa,
      maxDistance: 19,
      points: 7.0,
      spacing: 17.0,
      mouseControls: true,
      touchControls: true,
      minHeight: 350,
      minWidth: 200
    });
    return () => { if (vantaEffect.current) vantaEffect.current.destroy(); };
  }, [darkMode]);

  const theme = darkMode ? palette.dark : palette.light;

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Simulate loading for 900ms
  setTimeout(async () => {
    setLoading(false);
    
    if (email && password) {
      try {
        console.log("Logging in with:", email, password);
        const response = await fetch(`${URL}/user/login/${email}/${password}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result) {
          // Successful login logic here
          await Swal.fire('Success!', 'You have logged in successfully!', 'success');
          onLogin(); // Call your login function to update state
          navigate("/dash"); // Uncomment to navigate to dashboard
        } else {
          await Swal.fire('Error!', result.message || 'Login failed. Please try again.', 'error');
        }
      } catch (error) {
        console.log("Error", error);
        await Swal.fire('Error!', 'An unexpected error occurred. Please try again.', 'error');
      }
    } else {
      await Swal.fire('Error!', 'Please enter your email and password.', 'error');
    }
  }, 900);
};

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Animated background only behind login card */}
      <div
        ref={vantaRef}
        className="login-bg"
        style={{
          position: "absolute",
          top: 0, left: 0, width: "100%",
          height: "100%",
          zIndex: 0,
          borderRadius: "32px",
          overflow: 'hidden'
        }}
        aria-hidden="true"
      />
      {/* Theme toggle */}
      <button
        aria-label="Toggle dark mode"
        className="theme-toggle"
        style={{
          position: "fixed",
          top: 22,
          right: 28,
          zIndex: 20,
          background: "none",
          border: "none",
          outline: "none",
          cursor: "pointer",
          fontSize: "2rem",
          color: theme.accent,
          transition: "color 0.5s"
        }}
        onClick={() => setDarkMode(dm => !dm)}
      >
        {darkMode ?
          <span role="img" aria-label="Light mode">🌞</span> :
          <span role="img" aria-label="Dark mode">🌙</span>
        }
      </button>
      {/* Main Card */}
      <div
        className="login-container glass"
        style={{
          width: "95vw",
          maxWidth: 380,
          borderRadius: "28px",
          position: "relative",
          zIndex: 1,
          boxShadow: darkMode
            ? "0 8px 40px 0 rgba(25,25,35,0.50), 0 1.5px 8px 0 #00c9a71b"
            : "0 8px 48px 0 rgba(108,99,255,0.13), 0 1.5px 8px 0 #00C9A71a",
          background: theme.card,
          border: `1.6px solid ${theme.border}`,
          backdropFilter: "blur(14.5px)",
          WebkitBackdropFilter: "blur(14.5px)",
          padding: "36px 28px 30px 28px",
          margin: "70px 0",
          transition: "background 0.7s, box-shadow 0.6s"
        }}
        tabIndex="0"
        aria-label="Login form"
      >
        <h2
          className="login-title"
          style={{
            color: theme.text,
            fontWeight: 700,
            fontSize: "2rem",
            textAlign: "center",
            margin: "0 0 18px 0",
            letterSpacing: "0.02em",
            textShadow: darkMode
              ? "0 2px 14px #23294633"
              : "0 2px 14px #6C63FF12"
          }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="form-group" style={{ marginBottom: "1.2em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: "88%",
                  padding: "1.06em 1.3em 0.6em 1.3em",
                  borderRadius: "13px",
                  border: `1.4px solid ${theme.border}`,
                  background: darkMode ? "#232946" : "#fafbfe",
                  color: theme.text,
                  fontSize: "1.08rem",
                  fontWeight: 500,
                  outline: "none",
                  marginTop: "0.15em",
                  boxShadow: "0 0 0px 0 #00C9A710",
                  transition: "background 0.45s, color 0.45s, border 0.45s"
                }}
                aria-label="Email"
                aria-required="true"
              />
              <label
                htmlFor="email"
                style={{
                  position: "absolute",
                  left: "1.4em",
                  top: email ? "0.35em" : "1.1em",
                  fontSize: email ? "0.97em" : "1.06em",
                  color: theme.placeholder,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  pointerEvents: "none",
                  background: email ? theme.card : "transparent",
                  padding: email ? "0 .25em" : 0,
                  borderRadius: "6px",
                  transition: "all 0.27s cubic-bezier(.5,1.5,.45,1)"
                }}
              >
                Email
              </label>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "1.6em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: "88%",
                  padding: "1.06em 1.3em 0.6em 1.3em",
                  borderRadius: "13px",
                  border: `1.4px solid ${theme.border}`,
                  background: darkMode ? "#232946" : "#fafbfe",
                  color: theme.text,
                  fontSize: "1.08rem",
                  fontWeight: 500,
                  outline: "none",
                  marginTop: "0.15em",
                  boxShadow: "0 0 0px 0 #00C9A710",
                  transition: "background 0.45s, color 0.45s, border 0.45s"
                }}
                aria-label="Password"
                aria-required="true"
              />
              <label
                htmlFor="password"
                style={{
                  position: "absolute",
                  left: "1.4em",
                  top: password ? "0.35em" : "1.1em",
                  fontSize: password ? "0.97em" : "1.06em",
                  color: theme.placeholder,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  pointerEvents: "none",
                  background: password ? theme.card : "transparent",
                  padding: password ? "0 .25em" : 0,
                  borderRadius: "6px",
                  transition: "all 0.27s cubic-bezier(.5,1.5,.45,1)"
                }}
              >
                Password
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            style={{
              padding: "0.85em 0",
              width: "100%",
              borderRadius: "15px",
              border: "none",
              outline: "none",
              background: loading
                ? theme.accent2
                : `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.11rem",
              letterSpacing: ".01em",
              boxShadow: darkMode
                ? "0 2px 18px 0 #00C9A735, 0 1.5px 8px 0 #6C63FF13"
                : "0 2px 18px 0 #6C63FF25, 0 1.5px 8px 0 #00C9A713",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              marginTop: "10px",
              transition: "background 0.4s, box-shadow 0.4s, opacity 0.3s"
            }}
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading
              ? <span style={{ fontWeight: 400, fontSize: '1.05em', letterSpacing: 0.5 }}>Logging in…</span>
              : <>Login</>
            }
          </button>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <span style={{ color: theme.placeholder, fontSize: "0.97em" }}>
              Don&apos;t have an account?{' '}
              <a href="/signup" style={{ color: theme.accent, fontWeight: 700, textDecoration: "none" }}>
                Sign up
              </a>
            </span>
          </div>
        </form>
      </div>

      <style>{`
        html, body { min-height: 100vh; margin:0; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: ${theme.background}; }
        .glass::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 28px;
          pointer-events: none;
          z-index: 1;
          background: ${darkMode
            ? 'linear-gradient(125deg, rgba(33,34,53,0.21), rgba(33,34,53,0.06))'
            : 'linear-gradient(125deg, rgba(255,255,255,0.09), rgba(240,250,255,0.05))'};
          opacity: 0.93;
          filter: blur(1.6px);
        }
        @media (max-width: 600px) {
          .login-container {
            padding: 14vw 5vw 8vw 5vw !important;
            min-height: 320px !important;
            max-width: 98vw !important;
            margin: 8vw 0 !important;
          }
          h2.login-title {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;