import { useState, useRef } from "react"
import { alerta } from "../../common/Alertas/Alertas"
import "../styles/ModalModifCam.css"

const API_URL = import.meta.env.VITE_API_URL

export default function ModalModifCam({fechar, camSelecionada, aoAtualizar, aoExcluir}){
  const [nome, setNome] = useState(camSelecionada.nome)
  const [imgCam, setImgCam] = useState(camSelecionada.img_cam)
  const [imagemInfos, setImagemInfos] = useState(camSelecionada.img_cam.split("/").pop())//sobrescrita só mudando o final do endereço
  const arquivoRef = useRef(null)

  const handleBotaoClique = () => arquivoRef.current?.click()

  const escolhaDoArquivo = async (e) =>{
    const arquivo = e.target.files[0]
    if (!arquivo) return

    if (window.electronAPI && window.electronAPI.salvarImagem){
      try{
        const caminhoSalvo = await window.electronAPI.salvarImagem(arquivo.path, "Cameras")
        setImgCam(caminhoSalvo)
        setImagemInfos(arquivo.name)
      } catch (err){
        alerta.fire({title: 'Erro', text: 'Falha ao salvar imagem.', showConfirmButton: true, confirmButtonText: 'Fechar'})
      }
    } else{
      setImgCam(`/assets/imgs/Cameras/${arquivo.name}`)
      setImagemInfos(arquivo.name)
    }
  }

  //PUT(EDIT)
  const handleSalvar = async (e) =>{//PUT(EDIT)
    e.preventDefault()
    if (!nome.trim() || !imgCam){
      return alerta.fire({
        title: 'Campos vazios',
        text: 'Preencha o nome e selecione uma imagem.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }

    try{
      const res = await fetch(`${API_URL}/recintos/cameras/${camSelecionada.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, img_cam: imgCam })
      })

      if (!res.ok) throw new Error("Falha ao atualizar a câmera.")

      const camAtualizada = await res.json()
      await alerta.fire({title: 'Operação bem-sucedida.', text: 'Câmera atualizada.', showConfirmButton: true, confirmButtonText: 'Fechar'})
      
      aoAtualizar(camAtualizada)
      fechar()
    } catch (err){
      alerta.fire({title: 'Erro', text: err.message, showConfirmButton: true, confirmButtonText: 'Fechar'})
    }
  }

  //DELETE
  const handleExcluir = async () =>{
    const confirmacao = await alerta.fire({
      title: 'Excluir Câmera?',
      text: `Deseja remover "${camSelecionada.nome}" permanentemente?`,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmacao.isConfirmed) return

    try{
      const res = await fetch(`${API_URL}/recintos/cameras/${camSelecionada.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error("Falha ao excluir a câmera.")

      await alerta.fire({ title: 'Operação bem-sucedida.', text: 'Câmera removida com sucesso.', showConfirmButton: true, confirmButtonText: 'Fechar'})
      
      aoExcluir(camSelecionada.id)
      fechar()
    } catch (err){
      alerta.fire({ title: 'Erro', text: err.message, showConfirmButton: true, confirmButtonText: 'Fechar'})
    }
  }

  return(
    <div className="modalModifCamBg">
      <div className="modalModifCamContainer" onClick={(e) => e.stopPropagation()}>
        <button className="btnFecharModifCam" onClick={fechar}>✕</button>

        <h2>MODIFICAR CÂMERA</h2>

        <form onSubmit={handleSalvar} className="formModifCam">
          <div className="campoModifCam">
            <label>Nome da Câmera:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="selecaoImagemModif">
            <input
              type="file"
              ref={arquivoRef}
              onChange={escolhaDoArquivo}
              style={{ display: 'none' }}
              accept="image/*,.gif"
            />
            <button type="button" className="btnEscolherImgModif" onClick={handleBotaoClique}>
              ALTERAR IMAGEM/GIF
            </button>
            <p className="nomeArquivoInfoModif">{imagemInfos}</p>
          </div>

          <div className="acoesModifCam">
            <button 
              type="button" 
              className="btnExcluirModifCam" 
              onClick={handleExcluir}
            >
              EXCLUIR
            </button>

            <button type="submit" className="btnSalvarModifCam">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}