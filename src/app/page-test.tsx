export default function Home() {
  return (
    <html>
      <body>
        <h1>🎓 CORDIS Research Explorer</h1>
        <p>Authentication System Test</p>
        <div>
          <a href="/auth/login">Login</a> | 
          <a href="/auth/register">Register</a>
        </div>
        <style jsx>{`
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: #f0f8ff;
          }
          h1 {
            color: #333;
          }
          a {
            color: #0066cc;
            margin: 0 10px;
            text-decoration: underline;
          }
        `}</style>
      </body>
    </html>
  )
}
