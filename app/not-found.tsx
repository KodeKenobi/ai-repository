export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>404</h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem'
        }}>
          Page Not Found
        </h2>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          The page you're looking for doesn't exist.
        </p>
        <a 
          href="/" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
