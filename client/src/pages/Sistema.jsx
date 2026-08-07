import {useState, useEffect} from "react"

import Sidebar from "../components/Sidebar"
import Dinopedia from "../components/Dinopedia/Dinopedia"
import Laboratorio from "../components/Genes/Laboratorio"
import Recintos from "../components/Recintos/Recintos"
import Cameras from "../components/Cameras/Cameras"

import "../styles/Sistema.css"
import audioGerenciador from "../utils/audioGerenciador"

export default function Sistema(){
  const [aba, setAba] = useState(null)

  //SOM DE CLIQUE GLOBAL
  useEffect(() =>{

    const clickGlobal = (e) => {
      if (e.target.closest("button")) {
        audioGerenciador.tocarSom("click")
      }
    }

    document.addEventListener("click", clickGlobal, true)

    return () => {
      document.removeEventListener("click", clickGlobal, true)
    }

  }, [])

  //SIDEBAR COM INTERMEDIO DO SISTEMA
  return(
    <div className="container">
      <Sidebar aba={aba} setAba={setAba} />

      <div className="conteudo">
        {aba === "dinopedia" && <Dinopedia/>}
        {aba === "genes" && <Laboratorio/>}
        {aba === "recintos" && <Recintos/>}
        {aba === "cameras" && <Cameras/>}
      </div>
    </div>
  )
}