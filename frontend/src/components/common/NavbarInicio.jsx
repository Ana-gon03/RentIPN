import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import burroLogo from "../../assets/burro.png";

/* ════════════════════════════════
   NAVBAR INICIO
════════════════════════════════ */
const NavbarInicio = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(255,255,255,0.96)"
          : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #EEEDFE",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "box-shadow 0.25s",
        boxShadow: scrolled ? "0 2px 16px rgba(83,74,183,0.10)" : "none",
      }}
    >
      {/* Marca */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 800,
          fontSize: "1.2rem",
          color: "#534AB7",
          textDecoration: "none",
        }}
      >
        <img
          src={burroLogo}
          alt="RentIPN logo"
          style={{ width: 36, height: 36, objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        RentIPN
      </Link>

      {/* Links de navegación — ocultos en móvil por CSS en global.css */}
      <ul
        className="nav-links-list"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {[
          { href: "#inicio",         label: "Inicio" },
          { href: "#quienes-somos",  label: "Quiénes Somos" },
          { href: "#caracteristicas",label: "Características" },
          { href: "#perfiles",       label: "Perfiles" },
        ].map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              style={{
                color: "#4A4668",
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#534AB7")}
              onMouseLeave={(e) => (e.target.style.color = "#4A4668")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Acciones */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link
          to="/usuarios/inicio-sesion"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            borderRadius: "50px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            background: "transparent",
            color: "#534AB7",
            border: "1.5px solid #AFA9EC",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#EEEDFE")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Iniciar Sesión
        </Link>

        <Link
          to="/registro"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            borderRadius: "50px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            background: "#534AB7",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 16px rgba(83,74,183,0.28)",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3C3489";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#534AB7";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Registrarse
        </Link>
      </div>
    </nav>
  );
};

export default NavbarInicio;
