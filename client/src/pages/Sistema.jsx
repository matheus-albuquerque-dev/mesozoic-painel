import { useState, useRef, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Dinopedia from "../components/Dinopedia";
import Dnas from "../components/Dna";
import Recintos from "../components/Recintos";
import Cameras from "../components/Cameras";

import "../styles/Sistema.css";
import { tocarSom } from "../utils/audioGerenciador"

export default function Sistema() {
  const [aba, setAba] = useState(null)
  useEffect(() => {
    console.log("Aba atual:", aba)
  }, [aba])

  //SOM DE CLIQUE GLOBAL
  useEffect(() => {

    const clickGlobal = (e) => {
      if (e.target.closest("button")) {
        tocarSom("click")
      }
    }

    document.addEventListener("click", clickGlobal, true)

    return () => {
      document.removeEventListener("click", clickGlobal, true)
    }

  }, [])

  //SIDEBAR COM INTERMEDIO DO SISTEMA
  return (
    <div className="container">
      <Sidebar aba={aba} setAba={setAba} />

      <div className="conteudo">
        {aba === "dinopedia" && <Dinopedia/>}
        {aba === "genes" && <h1>Genes</h1>}
        {aba === "recintos" && <h1>Recintos</h1>}
        {aba === "cameras" && <h1>Câmeras</h1>}
      </div>
    </div>
  )
}