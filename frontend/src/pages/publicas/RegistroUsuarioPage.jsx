import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarRegistro from '../../components/common/NavbarRegistro'
import FooterInicio from '../../components/common/FooterInicio'
import RegistroEstudiante from '../../components/registro/RegistroEstudiante'
import RegistroArrendador from '../../components/registro/RegistroArrendador'
import '../../styles/Registro.css'

// ── Beneficios por tipo ──────────────────────────────────────────────────────
const ARRENDADOR_CHECKS = [
  "Perfil verificado con CURP oficial",
  "Publica inmuebles",
  "Construye reputación con reseñas",
  "Acceso a plantilla de contrato",
]

const ARRENDATARIO_CHECKS = [
  "Verificado con constancia IPN",
  "Filtra por presupuesto y servicios",
  "Reseñas de otros estudiantes",
  "Acceso a plantilla de contrato",
]

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M2 5l2.2 2.2L8 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CARD_THEMES = {
  arrendador: {
    gradient: "linear-gradient(135deg, #534AB7 0%, #7F77DD 100%)",
    checkBg: "#EEEDFE", checkColor: "#534AB7",
    btnBg: "#534AB7", btnHover: "#3C3489",
    btnShadow: "0 4px 16px rgba(83,74,183,0.35)",
  },
  estudiante: {
    gradient: "linear-gradient(135deg, #1a7a5e 0%, #2ec090 100%)",
    checkBg: "#d0f5ea", checkColor: "#1a7a5e",
    btnBg: "#1a7a5e", btnHover: "#145f49",
    btnShadow: "0 4px 16px rgba(26,122,94,0.35)",
  },
}

const ProfileCard = ({ variant, icon, tag, title, description, checks, onSelect }) => {
  const theme = CARD_THEMES[variant]

  return (
    <div
      onClick={() => onSelect(variant === 'arrendador' ? 'arrendador' : 'estudiante')}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(83,74,183,0.13)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s, box-shadow 0.25s",
        cursor: "pointer",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 56px rgba(83,74,183,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(83,74,183,0.13)";
      }}
    >
      <div style={{
        background: theme.gradient,
        padding: "2rem 2rem 1.75rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-50px", right: "-50px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "-20px",
          width: "100px", height: "100px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none",
        }} />
        <div style={{
          width: "60px", height: "60px", borderRadius: "14px",
          background: "rgba(255,255,255,0.2)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", marginBottom: "1.2rem",
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.75)",
          marginBottom: "0.4rem",
        }}>
          {tag}
        </div>
        <h3 style={{
          fontSize: "1.25rem", fontWeight: 800,
          color: "#ffffff", margin: 0, lineHeight: 1.25,
        }}>
          {title}
        </h3>
      </div>

      <div style={{
        background: "#ffffff",
        padding: "1.75rem 2rem 2rem",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}>
        <p style={{
          fontSize: "0.875rem", color: "#4A4668",
          lineHeight: 1.75, marginBottom: "1.5rem",
        }}>
          {description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, marginBottom: "1.75rem" }}>
          {checks.map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: theme.checkBg, color: theme.checkColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <CheckIcon />
              </div>
              <span style={{ fontSize: "0.86rem", color: "#4A4668" }}>{c}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "13px 24px", borderRadius: "50px",
            background: theme.btnBg, color: "#ffffff",
            fontWeight: 700, fontSize: "0.9rem",
            textDecoration: "none", boxShadow: theme.btnShadow,
            transition: "background 0.2s, transform 0.15s",
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.btnHover;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.btnBg;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {variant === 'arrendador' ? 'Registrarme como Arrendador' : 'Registrarme como Estudiante'}
        </div>
      </div>
    </div>
  )
}

const SeleccionTipo = ({ onSeleccionar }) => {
  const navigate = useNavigate()
  
  return (
    <div className="seleccion-wrapper">
      <div className="seleccion-container">
        <div className="seleccion-regresar">
          <button 
            className="btn-glass-back"
            onClick={() => navigate('/')}
          >
            ← Regresar
          </button>
        </div>

        <div className="seleccion-header">
          <h1>Registro de Usuario</h1>
          <p>Selecciona el tipo de cuenta que deseas crear</p>
        </div>

        <div className="seleccion-cards">
          <ProfileCard
            variant="arrendador"
            icon="🏠"
            tag="Arrendador"
            title="Publica y gestiona tus propiedades"
            description="Si tienes un inmueble cerca de la UPALM·IPN y deseas rentarlo a estudiantes. Regístrate, verifica tu identidad con CURP y comparte tu anuncio para que estudiantes verificados puedan contactarte directamente."
            checks={ARRENDADOR_CHECKS}
            onSelect={onSeleccionar}
          />
          <ProfileCard
            variant="estudiante"
            icon="🎓"
            tag="Estudiante"
            title="Encuentra tu hogar estudiantil"
            description="Como estudiante del IPN en la UPALM, busca viviendas cercanas adaptadas a tu presupuesto. Verifica tu estatus con tu constancia de estudios y accede a propiedades con reseñas de otros estudiantes."
            checks={ARRENDATARIO_CHECKS}
            onSelect={onSeleccionar}
          />
        </div>
      </div>
    </div>
  )
}

const RegistroUsuarioPage = () => {
  const [tipoUsuario, setTipoUsuario] = useState(null)

  return (
    <div className="registro-page">
      <NavbarRegistro />

      <main style={{ flex: 1 }}>
        {!tipoUsuario && <SeleccionTipo onSeleccionar={setTipoUsuario} />}
        {tipoUsuario === 'estudiante' && <RegistroEstudiante volver={() => setTipoUsuario(null)} />}
        {tipoUsuario === 'arrendador' && <RegistroArrendador volver={() => setTipoUsuario(null)} />}
      </main>

      <FooterInicio />
    </div>
  )
}

export default RegistroUsuarioPage