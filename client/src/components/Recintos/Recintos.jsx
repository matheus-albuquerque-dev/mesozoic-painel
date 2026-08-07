import {useState, useEffect} from "react"
import {recintosService} from "./recintosService"
import ModalDetalhesRecinto from "./Modais/ModalDetalhesRecinto"

import "./styles/RecintosPreviews.css"

export default function Recintos(){
  const [recintos, setRecintos] = useState([])
  const [selecionado, setSelecionado] = useState(null)
  const [modal, setModal] = useState(null)

  const MODAIS = {ADD: "add", 
                  EDIT: "edit", 
                  INFOS: "infos"}

  //exibicao automatica das previews
  useEffect(() =>{
    const carregarPreviews = async () =>{
      const dadosPreviews = await recintosService.getPreviews()
      setRecintos(dadosPreviews)
    }
    carregarPreviews()
  }, [])

  //ao clicar em Detalhes de um recinto especifico
  const abrirDetalhes = async (id) =>{
    const detalhesRecSelecionado = await recintosService.getDetalhes(id)
    setSelecionado(detalhesRecSelecionado)
    setModal(MODAIS.INFOS)
  }

  return(
    <div className="recintos">
      <h1 id="headerRecinto">Lista de Recintos</h1>

      <div className="catalogoRecintos">
        {Array.isArray(recintos) && recintos.map((recinto) =>(
          <div key={recinto.id} className="cardRecinto">

            <p className="nomeRecinto">{recinto.nome}</p>

            <div className="conteinerHorizontalPreviews">

              <div className="imgMiniatura">
                <img src={recinto.img_miniatura} alt={recinto.nome} />
              </div>
                <div className="ladoDireitoCard">
                  <p className={`previewStatus ${recinto.em_manutencao ? "manutencao" : "operacional"}`}>
                    <strong>Status:</strong>{" "}
                    {recinto.em_manutencao ? "Em Manutenção" : "Operacional"}
                  </p>
                  <div className="previewEspecies">
                    <strong>Espécies:</strong>
                    <ul>
                      {Array.isArray(recinto.especies) && recinto.especies.length > 0 ? (
                        recinto.especies.map((esp, i) => <li key={i}>{esp}</li>)
                      ) : (
                        <li>Sem espécies registradas.</li>
                      )}
                    </ul>
                  </div>
                  <button className="btnDetalhes" onClick={() => abrirDetalhes(recinto.id)}>
                    Detalhes
                  </button>
                </div>
            </div>
          </div>
        ))}
        <button id="btnAddRecinto" onClick={() => setModal(MODAIS.ADD)}>+</button>
      </div>

      {modal === MODAIS.INFOS && selecionado && <ModalDetalhesRecinto 
                                                abrirEdit={() =>{}}
                                                fechar={() =>{
                                                  setModal(null)
                                                  setSelecionado(null)
                                                }}
                                                selecionado={selecionado}
                                                setRecintos = {setRecintos}
                                              />}

    </div>
  )
}