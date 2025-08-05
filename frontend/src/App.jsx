import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [notas, setNotas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [error, setError] = useState(null)

  const cargarNotas = async () => {
    try {
      const res = await axios.get('/api/notas')
      setNotas(res.data)
    } catch (err) {
      setError('Error al cargar notas')
      console.error(err)
    }
  }

  useEffect(() => {
    cargarNotas()
  }, [])

  const guardarNota = async (e) => {
    e.preventDefault()
    if (!titulo || !contenido) {
      setError('Título y contenido son requeridos')
      return
    }

    try {
      await axios.post('/api/notas', { titulo, contenido })
      setTitulo('')
      setContenido('')
      setError(null)
      await cargarNotas()
    } catch (err) {
      setError('Error al guardar nota')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Notas Rápidas</h1>
      <form onSubmit={guardarNota}>
        <input 
          placeholder="Título" 
          value={titulo} 
          onChange={e => setTitulo(e.target.value)} 
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <textarea 
          placeholder="Contenido" 
          value={contenido} 
          onChange={e => setContenido(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>
          Guardar
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      
      <h2>Notas Guardadas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notas.map(nota => (
          <li key={nota.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h3>{nota.titulo}</h3>
            <p>{nota.contenido}</p>
            <small>{new Date(nota.fecha_creacion).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App