fetch('http://localhost:3000/api/tecnimedical/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Travis (Test BDA Lead Capture)',
    phone: '+58 412 111 2233',
    email: 'sebastian@brightdrive.com',
    catalog: 'TEST_CONEXION_REAL'
  })
})
.then(res => res.json())
.then(data => console.log('Respuesta del Backend:', data))
.catch(err => console.error('Fallo de Conexión al Backend:', err.message));
