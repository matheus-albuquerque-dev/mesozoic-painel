import {useState, useRef} from "react"
import {alerta} from "../../common/Alertas/Alertas"
import "../styles/ModalAddCam.css"

const API_URL = import.meta.env.VITE_API_URL

export default function ModalAddCamera({fechar, recintoId, aoAdicionar}){
  const [nome, setNome] = useState("")
  const [imgCam, setImgCam] = useState("")

  const [imagemInfos, setImagemInfos] = useState("")
  const arquivoRef = useRef(null)

  const handleBotaoClique = () =>{
    if (arquivoRef.current) arquivoRef.current.click()
  }

  const escolhaDoArquivo = async (e) =>{
    const arquivo = e.target.files[0]
    if (!arquivo) return

    if (window.electronAPI && window.electronAPI.salvarImagem){//para futuro Electron
      try{
        const caminhoSalvo = await window.electronAPI.salvarImagem(arquivo.path, "Cameras")
        setImgCam(caminhoSalvo)
        setImagemInfos(arquivo.name)
      } catch (err){
        console.error("Erro ao salvar imagem:", err)
        alerta.fire({
          title: 'Erro ao enviar câmera.',
          text: 'Envio de imagem falhou.',
          showConfirmButton: true,
          confirmButtonText: 'Fechar'
        })
      }
    } else{
      setImgCam(`/assets/imgs/Cameras/${arquivo.name}`)
      setImagemInfos(arquivo.name)
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    //para campos vazios
    if (!nome.trim() || !imgCam.trim()){
      return alerta.fire({
        title: 'Campos não preenchidos.',
        text: 'É necessário fornecer nome e caminho da câmera.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }

    try{
      const res = await fetch(`${API_URL}/recintos/cameras`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          nome,
          img_cam: imgCam,
          recinto_id: recintoId
        })
      })

      if (!res.ok) throw new Error("Falha ao adicionar câmera.")

      const novaCam = await res.json()

      await alerta.fire({
        title: 'Câmera adicionada.',
        text: `A câmera "${nome}" foi cadastrada com sucesso.`,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })

      aoAdicionar(novaCam)
      fechar()

    } catch (err){
      console.error("Erro ao cadastrar câmera:", err)
      alerta.fire({
        title: 'Operação incorreta',
        text: err.message,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }
  }

  return(
    <div className="modalAddCamBg">
      <div className="modalAddCamContainer" onClick={(e) => e.stopPropagation()}>

        <h2>ADICIONAR CÂMERA</h2>

        <form onSubmit={handleSubmit} className="formAddCam">
          <div className="campoAddCam">
            <label>Nome da Câmera:</label>
            <input
              type="text"
              placeholder="Ex: Câmera do Ninho"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="selecaoImagem">
            <input
              type="file"
              ref={arquivoRef}
              onChange={escolhaDoArquivo}
              style={{display: 'none'}}
              accept="image/*,.gif"
            />
            <button type="button" className="btnEscolherImg" onClick={handleBotaoClique}>
              SELECIONAR IMAGEM/GIF
            </button>
            <p className="nomeArquivoInfo">{imagemInfos || "Nenhuma imagem selecionada."}</p>
          </div>

          <div className="acoesAddCam">
            <button type="button" className="btnCancelarAddCam" onClick={fechar}>
              CANCELAR
            </button>
            <button type="submit" className="btnSalvarAddCam">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}