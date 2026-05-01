import {useState, useEffect, useMemo} from "react"

export default function Recintos(){
  const [selecionado, setSelecionado] = useState(null)
  const [modal, setModal] = useState(null)
  const MODAIS ={
    ADD: "add",
    EDIT: "edit",
    INFOS: "infos"
  }

  return(
    <div className="recintos">
          <h1>Recintos</h1>

          <button onClick={() => setModal(MODAIS.ADD)}>
            Adicionar
          </button>

        <div className="listaRecintos">
          {recintosListados.map(recinto => (
              <div className="disposicaoRecinto">
                Recintos {recinto.nome}
                <div className="previewRecinto">
                  {recinto.imagem ? <img src={recinto.imagem} alt={recinto.nome} /> : "Imagem indisponível."}
                  <div className="previewRecintoRight">
                    <div className="infosPreviewRecinto">
                      <p><strong>Estado:</strong> {recinto.estado ? recinto.estado : "Estado não informado."}</p>
                      <p><strong>Espécies:</strong> {recinto.especies ? recinto.especies.join(", ") : "Sem espécies."}</p>
                      <p><strong>Localização:</strong> {recinto.localizacao ? recinto.localizacao : "Localização não informada."}</p>
                    </div>
                    <button
                      key={recinto.id}
                      onClick={() =>{
                        setSelecionado(recinto)
                        setModal(MODAIS.INFOS)
                      }}
                      className={selecionado?.id === recinto.id ? "ativo" : ""}
                    >
                      Informações
                    </button>
                  </div>
                </div>
              </div>
          ))}

          {/*MODAIS*/}
                {modal === MODAIS.ADD && <ModalAddRecinto/>}
                
                {modal === MODAIS.EDIT && <ModalEditRecinto/>}
                
                {modal === MODAIS.INFOS && <ModalInfosRecinto 
                                            fechar={() =>{
                                              setModal(null)
                                              setSelecionado(null)
                                            }}
                                            />}
        </div>
    </div>
  )
}