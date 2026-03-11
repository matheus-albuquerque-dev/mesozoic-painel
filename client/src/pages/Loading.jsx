import { useState, useEffect, useRef } from "react"
import Sistema from "./Sistema"
import "../styles/Loading.css"

const textosDeCarregamento = [
  "Carregando Dinopédia",
  "Sincronizando informações de DNA",
  "Carregando informações de recintos",
  "Carregando câmeras",
  "Inicializando sistemas"
]

export default function Loading() {
  const [tela, setTela] = useState("login")
  const [textoIndex, setTextoIndex] = useState(0)
  const [pontos, setPontos] = useState("")

  const ambienteRef = useRef(null);
  const iniciarSistema = () => {
    ambienteRef.current.volume = 0.2
    ambienteRef.current.play();
    setTela("booting");
  };

  // Controla troca de frases
  useEffect(() => {
    if (tela !== "booting") return

    if (textoIndex < textosDeCarregamento.length - 1) {
      const timer = setTimeout(() => {
        setTextoIndex(prev => prev + 1)
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setTela("system")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [tela, textoIndex])

  // Controla animação dos pontinhos
  useEffect(() => {
    if (tela !== "booting") return

    const interval = setInterval(() => {
      setPontos(prev => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [tela])

  return (
    <>
    <div className="vhs-noise"></div>

      {tela === "login" && (
        <div className="tela login" onClick={iniciarSistema}>
          <h1>MESOZOIC PAINEL</h1>
          <p className="blink">Clique em qualquer lugar para iniciar</p>
        </div>
      )}

      {tela === "booting" && (
        <div className="tela boot">
          <p>
            {textosDeCarregamento[textoIndex]}
            {pontos}
          </p>
        </div>
      )}

      {tela === "system" && <Sistema />}

      <audio ref={ambienteRef} loop>
          <source src="/src/assets/audios/alienIsolationComputerSounds.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}