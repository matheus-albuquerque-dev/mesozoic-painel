import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Dinopedia from "../components/Dinopedia";
import Dnas from "../components/Dna";
import Recintos from "../components/Recintos";
import Cameras from "../components/Cameras";
import "../styles/Sistema.css";

export default function Sistema() {
  const [aba, setAba] = useState(null)
  useEffect(() => {
    console.log("Aba atual:", aba)
  }, [aba])

  const clickRef = useRef(null)

  const trocarAba = (nome) => {
    if (clickRef.current) {
      clickRef.current.currentTime = 0
      clickRef.current.play()
    }
    setAba(nome)
  }

  useEffect(() => {
    if (clickRef.current) {
      clickRef.current.volume = 1
    }
  }, [])

  return (
    <div className="container">
      <Sidebar aba={aba} setAba={trocarAba} />

      <div className="conteudo">
        {aba === "Dinopédia" && <Dinopedia/>}
        {aba === "Genes" && <h1>DNAs</h1>}
        {aba === "Recintos" && <h1>Recintos</h1>}
        {aba === "Câmeras" && <h1>Câmeras</h1>}
      </div>

      <audio ref={clickRef} src="/assets/audios/click.mp3" />
    </div>
  )
}