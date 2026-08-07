import {alerta} from "../../common/Alertas/Alertas"
import "../styles/RecintosDetalhes.css"

import {recintosService} from "../recintosService"

const API_URL = import.meta.env.VITE_API_URL

//EXCLUIR RECINTO SELECIONADO
const delRecinto = async (id, nome, fechar, setRecintos) =>{
  const resultado = await alerta.fire({
    title: 'Exclusão solicitada.',
    text: `Deseja remover "${nome}"?`,
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  })

  if (resultado.isConfirmed){
    try{
      await recintosService.deleteRecinto(id)
      setRecintos(prev => prev.filter(recinto => recinto.id !== id))
      await alerta.fire({
        title: 'Operação bem-sucedida.',
        text: 'Recinto excluído com sucesso.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })

      fechar()

    } catch (err){
      alerta.fire({
        title: 'Operação malsucedida.',
        text: err.message,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }
  }
}

//MODAL INFORMATIVO DE RECINTOS
export default function ModalDetalhesRecinto({abrirEdit, fechar, selecionado, setRecintos, trocarAbaRecCam}){
  if (!selecionado) return null//seguranca

  const handleVerCameras = () =>{
    fechar()
    const id = selecionado.id || selecionado.recinto_id//fallback
    trocarAbaRecCam(id)
  }

  return(
    <div className="modalBg">
        <div className="modalDetalhesRecinto" onClick={(e) => e.stopPropagation()}>
            {/*ACOES: FECHAR, EDITAR E EXCLUIR*/}
            <div className="acoesRecinto">
                <button id="fecharRecinto" onClick={fechar}>✕</button>

                <button id="editRecinto" onClick={abrirEdit}>
                    Editar
                </button>

                <button id="delRecinto" 
                    onClick={() => delRecinto(selecionado.id, selecionado.nome, fechar, setRecintos)}
                >
                    Excluir Recinto
                </button>
            </div>

            {/*INFORMACOES E CAMERAS*/}
            <div className="recintoHeader">
                <img
                        src={selecionado.img_ampliada}
                        alt={selecionado.nome}
                        className="imgAmpliada"
                />
                <p><strong>{selecionado.nome}</strong></p>
            </div>

            <div className="recintoInfo">
                <p className={`previewStatus ${selecionado.em_manutencao ? "manutencao" : "operacional"}`}>
                    <strong>Status:</strong>{" "}
                    {selecionado.em_manutencao ? "Em Manutenção" : "Operacional"}
                </p>
                
                <p>
                    <strong>Coordenadas:</strong> X: {selecionado.mapa_pos_x} | Y: {selecionado.mapa_pos_y}
                </p>

                <div className="recintoEspecies">
                    <p><strong>Espécies Habitantes:</strong></p>
                    <ul>
                    {selecionado.especies && selecionado.especies.length > 0 ? (
                        selecionado.especies.map((esp, index) => (
                        <li key={index}>{esp}</li>
                        ))
                    ) : (
                        <li>Sem espécies registradas.</li>
                    )}
                    </ul>
                </div>

                <p className="recintoDescricao">
                    <strong>Descrição:</strong> {selecionado.descricao}
                </p>
            </div>
            
            <button id="btnVerCameras" onClick={handleVerCameras}>
                VER CÂMERAS
            </button>
        
        </div>
    </div>
  )
}