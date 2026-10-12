import { useState } from 'react'
import './App.css'

const COURTS = [
  {
    id: 'parchet-one',
    name: 'Parchet One',
    info: 'Indoor, Centru',
    price: 100,
    img: 'https://images.unsplash.com/photo-1559369064-c4d65141e408?w=600',
  },
  {
    id: 'teren-est',
    name: 'Teren Est',
    info: 'Indoor, Cartierul Est',
    price: 80,
    img: 'https://images.unsplash.com/photo-1531124042451-f3ba1765072c?w=600',
  },
  {
    id: 'sunset-court',
    name: 'Sunset Court',
    info: 'Outdoor, Faleza',
    price: 50,
    img: 'https://images.unsplash.com/photo-1680346672884-e11e16d37369?w=600',
  },
]

const ORE = []
for (let h = 8; h < 22; h++) {
  ORE.push(`${String(h).padStart(2, '0')}:00`)
}

export default function App() {
  const [bookings, setBookings] = useState([])
  const [nume, setNume] = useState('')
  const [teren, setTeren] = useState(COURTS[0].id)
  const [data, setData] = useState('')
  const [ora, setOra] = useState('')
  const [eroare, setEroare] = useState('')

  const numeTeren = (id) => COURTS.find((c) => c.id === id).name

  const alegeTeren = (id) => {
    setTeren(id)
    document.getElementById('rezervare').scrollIntoView()
  }

  const trimite = (e) => {
    e.preventDefault()
    if (!nume.trim() || !data || !ora) {
      setEroare('Completează toate câmpurile.')
      return
    }
    setEroare('')
    setBookings([...bookings, { id: Date.now(), nume, teren, data, ora }])
    setNume('')
    setData('')
    setOra('')
  }

  return (
    <div className="page">
      <header>
        <strong>Baschet</strong>
        <nav>
          <a href="#terenuri">Terenuri</a>
          <a href="#rezervare">Rezervare</a>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h1>Rezervă un teren de baschet</h1>
          <p>Alege terenul, ziua și ora. Noi îți păstrăm locul.</p>
        </section>

        <section id="terenuri">
          <h2>Terenuri</h2>
          <div className="courts">
            {COURTS.map((c) => (
              <div className="court" key={c.id}>
                <img src={c.img} alt={c.name} />
                <h3>{c.name}</h3>
                <p>{c.info}</p>
                <p>{c.price} lei / oră</p>
                <button onClick={() => alegeTeren(c.id)}>Rezervă</button>
              </div>
            ))}
          </div>
        </section>

        <section id="rezervare">
          <h2>Rezervare</h2>
          <form onSubmit={trimite}>
            <label>
              Nume
              <input value={nume} onChange={(e) => setNume(e.target.value)} />
            </label>

            <label>
              Teren
              <select value={teren} onChange={(e) => setTeren(e.target.value)}>
                {COURTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Data
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </label>

            <label>
              Ora
              <select value={ora} onChange={(e) => setOra(e.target.value)}>
                <option value="">Alege ora</option>
                {ORE.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            {eroare && <p className="error">{eroare}</p>}

            <button type="submit">Rezervă</button>
          </form>

          <h3>Rezervările tale</h3>
          {bookings.length === 0 ? (
            <p>Nu ai nicio rezervare.</p>
          ) : (
            <ul>
              {bookings.map((b) => (
                <li key={b.id}>
                  {b.nume}, {numeTeren(b.teren)}, {b.data}, ora {b.ora}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
