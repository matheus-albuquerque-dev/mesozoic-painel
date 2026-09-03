import {useState, useEffect} from "react"
import CardCamera from "./CardCamera"
import ModalCam from "./Modais/ModalCam"
import "./styles/Cameras.css"

const API_URL = import.meta.env.VITE_API_URL

export default function Cameras({RecCamID, limparRecCamID, trocarAbaCamRec}){
  const [catalogoCameras, setCatalogoCameras] = useState([])
  const [recintoSelecionado, setRecintoSelecionado] = useState(null)

  const MODAIS = {ADD: "add",
                  VERMAIS: "vermais"}
  const [modalCam, setModalCam] = useState(null)

  useEffect(() =>{
    const buscarCameras = async () =>{
      try{
        const res = await fetch(`${API_URL}/recintos/cameras`)
        if (!res.ok) throw new Error("Falha ao carregar câmeras.")

        const dados = await res.json()
        setCatalogoCameras(dados)
      }catch (err){
        console.error("Erro ao buscar câmeras:", err)
      }
    }
    buscarCameras()
  }, [])

  //verifica se veio da aba 'recintos' pelo 'RecCamID'
  useEffect(() =>{
    if (RecCamID && catalogoCameras.length > 0){
      const recintoEncontrado = catalogoCameras.find(
        (r) => String(r.recinto_id) === String(RecCamID) || String(r.id) === String(RecCamID)//fallback
      )
      if (recintoEncontrado){
        abrirModalCam(recintoEncontrado)
      }
      limparRecCamID()
    }
  }, [RecCamID, catalogoCameras])

const abrirModalCam = (recinto) =>{
  setRecintoSelecionado(recinto)
  setModalCam(MODAIS.VERMAIS)
}

return(
    <div className="recintosCam">
      <header>
        <h1 id="headerCam">Central de Segurança</h1>
        <button id="btnAddCam" onClick={() => setModalCam(MODAIS.ADD)}>+</button>
      </header>

      <div className="catalogoCam">
        {Array.isArray(catalogoCameras) && catalogoCameras.length > 0 ? (
          catalogoCameras.map((recinto) =>(
            <CardCamera 
              key={recinto.recinto_id} 
              recinto={recinto} 
              abrirModalCam={abrirModalCam} 
            />
          ))
        ) : (
          <p style={{color: "#00ff88"}}>Carregando sistema de monitoramento...</p>
        )}
      </div>
{/*
      SERVIRA PARA ADD CAMERAS EM RECINTO QUE NAO TENHA AINDA
      {modalCam === MODAIS.ADD && <ModalAddCamera 
                                    fechar={() => setModalCam(null)} 
                                    setCatalogoCameras={setCatalogoCameras}//render da adicao
                                  />}
*/}
      {modalCam === MODAIS.VERMAIS && recintoSelecionado && <ModalCam
                                                                fechar={() =>{
                                                                  setModalCam(null)
                                                                  setRecintoSelecionado(null)
                                                                }}
                                                                recintoSelecionado={recintoSelecionado}
                                                                trocarAbaCamRec = {trocarAbaCamRec}
                                                                //setCatalogoCameras = {setCatalogoCameras}//pra tirar da render se excluir
                                                              />}

    </div>
  )
}