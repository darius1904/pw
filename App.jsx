import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { ArrowDown, ArrowUpRight, Check } from 'lucide-react'
import './App.css'

const HERO_IMG =
  'https://images.unsplash.com/photo-1632357027234-a5725394584b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1400&auto=format&fit=crop'

const COURTS = [
  {
    id: 'parchet-one',
    name: 'Parchet One',
    tip: 'Indoor · Baschet',
    loc: 'Centru',
    price: '100 lei / oră',
    img: 'https://images.unsplash.com/photo-1559369064-c4d65141e408?crop=entropy&cs=srgb&fm=jpg&q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'teren-est',
    name: 'Teren Est',
    tip: 'Indoor · Tribune',
    loc: 'Cartierul Est',
    price: '80 lei / oră',
    img: 'https://images.unsplash.com/photo-1531124042451-f3ba1765072c?crop=entropy&cs=srgb&fm=jpg&q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'sunset-court',
    name: 'Sunset Court',
    tip: 'Outdoor · Asfalt',
    loc: 'Faleza',
    price: '50 lei / oră',
    img: 'https://images.unsplash.com/photo-1680346672884-e11e16d37369?crop=entropy&cs=srgb&fm=jpg&q=80&w=900&auto=format&fit=crop',
  },
]

const ORE = Array.from({ length: 14 }, (_, i) => {
  const h = String(8 + i).padStart(2, '0')
  return { value: `${h}:00`, label: `${h}:00 – ${String(9 + i).padStart(2, '0')}:00` }
})

const azi = () => new Date().toISOString().slice(0, 10)

function Header({ onNav }) {
  return (
    <header className="site-header">
      <button className="logo" onClick={() => onNav('top')} data-testid="logo-btn">
        <span className="logo-mark" aria-hidden="true" />
        Baschet
      </button>
      <nav className="nav-links">
        <button onClick={() => onNav('terenuri')}>Terenuri</button>
        <button onClick={() => onNav('rezervare')}>Rezervare</button>
      </nav>
      <button className="btn btn-accent btn-sm" data-testid="header-cta" onClick={() => onNav('rezervare')}>
        Rezervă acum
      </button>
    </header>
  )
}

function Hero({ onNav }) {
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (media.matches) return
        const r = img.parentElement.getBoundingClientRect()
        const p = Math.min(Math.max(-r.top / r.height, 0), 1)
        img.style.transform = `translate3d(0, ${p * 90}px, 0) scale(1.15)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <p className="eyebrow mono">Rezervări terenuri de baschet</p>
        <h1>
          <span className="mask">
            <span>Joacă</span>
          </span>
          <span className="mask">
            <span>
              baschet<span className="accent">.</span>
            </span>
          </span>
          <span className="mask">
            <span className="grey">
              Oricând vrei<span className="accent">.</span>
            </span>
          </span>
        </h1>
        <p className="hero-sub">
          Alege terenul, ziua și ora. Îți păstrăm locul — tu vii doar să arunci la coș.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-accent" data-testid="hero-cta" onClick={() => onNav('rezervare')}>
            Rezervă acum
          </button>
          <button className="btn btn-ghost" data-testid="hero-secondary" onClick={() => onNav('terenuri')}>
            Vezi terenurile <ArrowDown size={16} />
          </button>
        </div>
      </div>
      <div className="hero-frame">
        <img ref={imgRef} src={HERO_IMG} alt="Teren de baschet văzut de sus" />
        <div className="hero-badge mono">
          <span className="dot" /> Teren liber azi
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const cuvinte = ['Rezervă', 'Joacă', 'Repetă', 'Baschet']
  return (
    <div className="marquee" data-testid="marquee">
      <div className="marquee-track">
        {[0, 1].map((copie) => (
          <div className="marquee-copy" key={copie} aria-hidden={copie === 1}>
            {cuvinte.map((cuv) => (
              <span className="marquee-item" key={cuv}>
                {cuv} <span className="sep">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Courts({ onPick }) {
  const listRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    if (listRef.current) obs.observe(listRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section" id="terenuri">
      <div className="section-head">
        <p className="eyebrow mono">01 — Terenuri</p>
        <h2 className="h2">
          Alege-ți terenul<span className="accent">.</span>
        </h2>
        <p className="section-sub">
          Trei terene, un singur gând: data viitoare când zici „hai la baschet”, să fie sigur că
          undeva e loc.
        </p>
      </div>

      <div className="courts" ref={listRef} data-testid="courts-list">
        {COURTS.map((c, i) => (
          <article
            key={c.id}
            className="court-row"
            data-testid={`court-row-${c.id}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="court-num mono">{String(i + 1).padStart(2, '0')}</span>
            <div className="court-thumb">
              <img src={c.img} alt={`Terenul ${c.name}`} loading="lazy" />
            </div>
            <div className="court-info">
              <h3 className="court-name">{c.name}</h3>
              <p className="court-meta mono">
                {c.tip} · {c.loc}
              </p>
            </div>
            <div className="court-side">
              <span className="chip mono">
                <span className="dot" /> Liber azi
              </span>
              <p className="court-price mono">{c.price}</p>
              <button
                className="btn btn-ghost btn-sm"
                data-testid={`court-book-${c.id}`}
                onClick={() => onPick(c.id)}
              >
                Rezervă <ArrowUpRight size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BookingSection({ selectedCourtId, bookings, onAdd }) {
  const [nume, setNume] = useState('')
  const [teren, setTeren] = useState(selectedCourtId)
  const [data, setData] = useState('')
  const [ora, setOra] = useState('')
  const [eroare, setEroare] = useState('')
  const [confirmata, setConfirmata] = useState(null)

  useEffect(() => setTeren(selectedCourtId), [selectedCourtId])

  const courtName = (id) => COURTS.find((c) => c.id === id)?.name ?? id

  const formatData = (d) =>
    new Date(`${d}T12:00`).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const submit = (e) => {
    e.preventDefault()
    if (!nume.trim() || !data || !ora) {
      setEroare('Completează toate câmpurile ca să-ți blocăm ora.')
      return
    }
    setEroare('')
    onAdd({ id: Date.now(), nume: nume.trim(), teren, data, ora })
    setConfirmata({ teren, data, ora, nume: nume.trim() })
    setNume('')
    setData('')
    setOra('')
  }

  return (
    <section className="section" id="rezervare">
      <div className="booking-grid">
        <div>
          <p className="eyebrow mono">02 — Rezervare</p>
          <h2 className="h2">
            Gata în 30 de secunde<span className="accent">.</span>
          </h2>
          <ol className="steps">
            <li>
              <span className="mono">01</span> Alege terenul
            </li>
            <li>
              <span className="mono">02</span> Alege ziua și ora
            </li>
            <li>
              <span className="mono">03</span> Ieși la joc — restul e la noi
            </li>
          </ol>
        </div>

        <form className="form" onSubmit={submit} noValidate data-testid="booking-form">
          <div className="field full">
            <label htmlFor="nume">Numele tău</label>
            <input
              id="nume"
              type="text"
              placeholder="Ex: Andrei Pop"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              data-testid="booking-nume"
            />
          </div>

          <div className="field full">
            <label htmlFor="teren">Terenul</label>
            <select
              id="teren"
              value={teren}
              onChange={(e) => setTeren(e.target.value)}
              data-testid="booking-teren"
            >
              {COURTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.price}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              min={azi()}
              value={data}
              onChange={(e) => setData(e.target.value)}
              data-testid="booking-data"
            />
          </div>

          <div className="field">
            <label htmlFor="ora">Ora</label>
            <select id="ora" value={ora} onChange={(e) => setOra(e.target.value)} data-testid="booking-ora">
              <option value="" disabled>
                Alege ora
              </option>
              {ORE.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {eroare && (
            <p className="error full" data-testid="booking-error">
              {eroare}
            </p>
          )}

          <button className="btn btn-accent full" type="submit" data-testid="booking-submit">
            Confirmă rezervarea
          </button>

          {confirmata && (
            <div className="confirmation full" data-testid="booking-confirmation">
              <Check size={20} className="check" />
              <p>
                Rezervare confirmată, <strong>{confirmata.nume}</strong>! Te așteptăm la{' '}
                <strong>{courtName(confirmata.teren)}</strong>, {formatData(confirmata.data)}, ora{' '}
                <strong>{confirmata.ora}</strong>.
              </p>
            </div>
          )}
        </form>
      </div>

      <div className="bookings" data-testid="bookings-list">
        <p className="eyebrow mono">Rezervările tale</p>
        {bookings.length === 0 ? (
          <p className="bookings-empty">Nicio rezervare încă — prima e la un click distanță.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id} className="booking-item" data-testid="booking-item">
                <span className="booking-who">
                  <strong>{b.nume}</strong> — {courtName(b.teren)}
                </span>
                <span className="mono booking-when">
                  {formatData(b.data)} · {b.ora}
                </span>
                <span className="chip mono">
                  <span className="dot" /> Confirmată
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return ( 0
    /*<footer className="footer">
      <p className="footer-mark">
        Baschet<span className="accent">.</span>
      </p>
    </footer>*/
  )
}

export default function App() {
  const [bookings, setBookings] = useState([])
  const [selectedCourtId, setSelectedCourtId] = useState(COURTS[0].id)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15 })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  const goTo = (id) => {
    if (id === 'top') {
      if (window.__lenis) window.__lenis.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -76 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => goTo(id))
    // eslint-disable-next-line
  }, [])

  const pickCourt = (id) => {
    setSelectedCourtId(id)
    goTo('rezervare')
  }

  const addBooking = (r) => setBookings((p) => [...p, r])

  return (
    <>
      <Header onNav={goTo} />
      <main>
        <Hero onNav={goTo} />
        <Marquee />
        <div className="ticks" />
        <Courts onPick={pickCourt} />
        <div className="ticks" />
        <BookingSection
          selectedCourtId={selectedCourtId}
          bookings={bookings}
          onAdd={addBooking}
        />
      </main>
      <Footer />
    </>
  )
}
