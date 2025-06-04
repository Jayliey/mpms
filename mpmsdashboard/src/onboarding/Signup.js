import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import NET from 'vanta/dist/vanta.net.min';

const palette = {
  light: {
    background: "#f8fafd",
    card: "rgba(255,255,255,0.87)",
    border: "#e3e7ee",
    accent: "#00C9A7",
    accent2: "#6C63FF",
    text: "#232946",
    placeholder: "#b0b4c1"
  },
  dark: {
    background: "#181926",
    card: "rgba(33,34,53,0.92)",
    border: "#27283c",
    accent: "#00C9A7",
    accent2: "#6C63FF",
    text: "#f5f6fa",
    placeholder: "#6a6d8e"
  }
};

const Signup = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Vanta background limited to signup
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  useEffect(() => {
    if (vantaEffect.current) vantaEffect.current.destroy();
    vantaEffect.current = NET({
      el: vantaRef.current,
      color: darkMode ? 0x00C9A7 : 0x6C63FF,
      backgroundColor: darkMode ? 0x181926 : 0xf8fafd,
      maxDistance: 20,
      points: 7.5,
      spacing: 18.0,
      mouseControls: true,
      touchControls: true,
      minHeight: 370,
      minWidth: 200
    });
    return () => { if (vantaEffect.current) vantaEffect.current.destroy(); };
  }, [darkMode]);

  const theme = darkMode ? palette.dark : palette.light;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password || !repeatPassword) {
      await Swal.fire('Error!', 'All fields are required.', 'error');
      return;
    }
    if (password !== repeatPassword) {
      await Swal.fire('Error!', 'Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      await Swal.fire('Success!', 'Your account has been created!', 'success');
      // Add your signup logic here
    }, 1100);
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
      {/* Animated background only behind signup card */}
      <div
        ref={vantaRef}
        className="signup-bg"
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
        className="signup-container glass"
        style={{
          width: "97vw",
          maxWidth: 420,
          borderRadius: "30px",
          position: "relative",
          zIndex: 1,
          boxShadow: darkMode
            ? "0 8px 40px 0 rgba(25,25,35,0.50), 0 1.5px 8px 0 #00c9a71b"
            : "0 8px 48px 0 rgba(108,99,255,0.13), 0 1.5px 8px 0 #00C9A71a",
          background: theme.card,
          border: `1.7px solid ${theme.border}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "36px 28px 30px 28px",
          margin: "60px 0",
          transition: "background 0.7s, box-shadow 0.6s"
        }}
        tabIndex="0"
        aria-label="Signup form"
      >
        <h2
          className="signup-title"
          style={{
            color: theme.text,
            fontWeight: 700,
            fontSize: "2rem",
            textAlign: "center",
            margin: "0 0 18px 0",
            letterSpacing: "0.02em",
            textShadow: darkMode
              ? "0 2px 14px #23294633"
              : "0 2px 14px #00C9A712"
          }}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="signup-form" autoComplete="off">
          <div className="form-group" style={{ marginBottom: "1.1em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="signup-username"
                type="text"
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
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
                aria-label="Username"
                aria-required="true"
              />
              <label
                htmlFor="signup-username"
                style={{
                  position: "absolute",
                  left: "1.4em",
                  top: username ? "0.35em" : "1.1em",
                  fontSize: username ? "0.97em" : "1.06em",
                  color: theme.placeholder,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  pointerEvents: "none",
                  background: username ? theme.card : "transparent",
                  padding: username ? "0 .25em" : 0,
                  borderRadius: "6px",
                  transition: "all 0.27s cubic-bezier(.5,1.5,.45,1)"
                }}
              >
                Username
              </label>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "1.1em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="signup-email"
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
                htmlFor="signup-email"
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
          <div className="form-group" style={{ marginBottom: "1.1em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                htmlFor="signup-password"
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
          <div className="form-group" style={{ marginBottom: "1.7em" }}>
            <div style={{ position: "relative" }}>
              <input
                id="signup-repeat"
                type="password"
                name="repeatPassword"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                aria-label="Repeat password"
                aria-required="true"
              />
              <label
                htmlFor="signup-repeat"
                style={{
                  position: "absolute",
                  left: "1.4em",
                  top: repeatPassword ? "0.35em" : "1.1em",
                  fontSize: repeatPassword ? "0.97em" : "1.06em",
                  color: theme.placeholder,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  pointerEvents: "none",
                  background: repeatPassword ? theme.card : "transparent",
                  padding: repeatPassword ? "0 .25em" : 0,
                  borderRadius: "6px",
                  transition: "all 0.27s cubic-bezier(.5,1.5,.45,1)"
                }}
              >
                Repeat Password
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="signup-button"
            disabled={loading}
            style={{
              padding: "0.85em 0",
              width: "100%",
              borderRadius: "16px",
              border: "none",
              outline: "none",
              background: loading
                ? theme.accent2
                : `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.12rem",
              letterSpacing: ".01em",
              boxShadow: darkMode
                ? "0 2px 18px 0 #00C9A735, 0 1.5px 8px 0 #6C63FF13"
                : "0 2px 18px 0 #6C63FF25, 0 1.5px 8px 0 #00C9A713",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "10px",
              transition: "background 0.4s, box-shadow 0.4s, opacity 0.3s"
            }}
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading
              ? <span style={{ fontWeight: 400, fontSize: '1.05em', letterSpacing: 0.5 }}>Signing up…</span>
              : <>Sign Up</>
            }
          </button>
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <span style={{ color: theme.placeholder, fontSize: "0.97em" }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: theme.accent, fontWeight: 700, textDecoration: "none" }}>
                Log in
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
          border-radius: 30px;
          pointer-events: none;
          z-index: 1;
          background: ${darkMode
            ? 'linear-gradient(125deg, rgba(33,34,53,0.21), rgba(33,34,53,0.06))'
            : 'linear-gradient(125deg, rgba(255,255,255,0.09), rgba(240,250,255,0.05))'};
          opacity: 0.93;
          filter: blur(1.6px);
        }
        @media (max-width: 600px) {
          .signup-container {
            padding: 14vw 5vw 8vw 5vw !important;
            min-height: 320px !important;
            max-width: 98vw !important;
            margin: 8vw 0 !important;
          }
          h2.signup-title {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;