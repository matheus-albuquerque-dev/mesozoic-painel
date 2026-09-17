import {useState, useEffect, useRef} from "react"
import {alerta} from "../../common/Alertas/Alertas"
import "../styles/ModalAddCam.css"//reaproveitamento do estilo

const API_URL = import.meta.env.VITE_API_URL

export default function ModalAddCamInicial({fechar, recarregarCatalogoCam}){
  const [recintos, setRecintos] = useState([])
  const [carregando, setCarregando] = useState(true)

  const [recintoId, setRecintoId] = useState("")
  const [nome, setNome] = useState("")
  const [imgCam, setImgCam] = useState("")
  const [imagemInfos, setImagemInfos] = useState("")
  
  const arquivoRef = useRef(null)

  useEffect(() => {
    const buscarRecintosVazios = async () =>{
      try {
        const res = await fetch(`${API_URL}/recintos/sem-cameras`)
        const dados = await res.json()
        
        setRecintos(dados)
        if (dados.length > 0) setRecintoId(dados[0].id)//selecionar o primeiro recinto vazio ao abrir
      } catch (err){
        console.error("Erro:", err)
      } finally{
        setCarregando(false)
      }
    }
    buscarRecintosVazios()
  }, [])

  const handleBotaoClique = () =>{
    if (arquivoRef.current) arquivoRef.current.click()
  }

  const escolhaDoArquivo = async (e) =>{
    const arquivo = e.target.files[0]
    if (!arquivo) return

    if (window.electronAPI && window.electronAPI.salvarImagem){
      try {
        const caminhoSalvo = await window.electronAPI.salvarImagem(arquivo.path, "Cameras")
        setImgCam(caminhoSalvo)
        setImagemInfos(arquivo.name)
      } catch (err){
        alerta.fire({title: 'Erro', text: 'Não foi possível copiar a imagem.', showConfirmButton: true, confirmButtonText: 'Fechar'})
      }
    } else{
      setImgCam(`/assets/imgs/Cameras/${arquivo.name}`)
      setImagemInfos(arquivo.name)
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()

    if (!nome.trim() || !imgCam || !recintoId){
      return alerta.fire({
        title: 'Campos não preenchidos.',
        text: 'Escolha um recinto, preencha o nome da câmera e escolha a imagem.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }

    try{
      const res = await fetch(`${API_URL}/recintos/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, img_cam: imgCam, recinto_id: recintoId })
      })

      if (!res.ok) throw new Error("Falha ao adicionar câmera.")

      await alerta.fire({
        title: 'Sucesso!',
        text: `A câmera "${nome}" foi vinculada ao recinto.`,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })

      recarregarCatalogoCam()
      fechar()

    } catch (err){
      alerta.fire({ title: 'Erro', text: err.message, showConfirmButton: true })
    }
  }

  return(
    <div className="modalAddCamBg">
      <div className="modalAddCamContainer" onClick={(e) => e.stopPropagation()}>

        <h2>VINCULAR NOVA CÂMERA</h2>

        {carregando ? (
          <p style={{ textAlign: "center" }}>Buscando recintos disponíveis...</p>
        ) : recintos.length === 0 ? (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p>Todos os recintos têm ao menos uma câmera. Para adicionar novas câmeras em um recinto, entre em seus detalhes.</p>
            <button className="btnSalvarAddCam" onClick={fechar} style={{ marginTop: "15px" }}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="formAddCam">
            
            <div className="campoAddCam">
              <label>Selecione o Recinto Vazio:</label>
              <select 
                value={recintoId} 
                onChange={(e) => setRecintoId(e.target.value)}
                style={{ background: 'black', color: '#00ff88', border: '1px solid #00ff88', padding: '10px', fontFamily: 'monospace' }}
              >
                {recintos.map(r => (
                  <option key={r.id} value={r.id}>{r.nome}</option>
                ))}
              </select>
            </div>

            <div className="campoAddCam">
              <label>Nome da Câmera:</label>
              <input type="text" placeholder="Ex: Câmera do Portão Principal" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="selecaoImagem">
              <input type="file" ref={arquivoRef} onChange={escolhaDoArquivo} style={{ display: 'none' }} accept="image/*,.gif" />
              <button type="button" className="btnEscolherImg" onClick={handleBotaoClique}>SELECIONAR IMAGEM/GIF</button>
              <p className="nomeArquivoInfo">{imagemInfos || "Nenhuma imagem selecionada."}</p>
            </div>

            <div className="acoesAddCam">
              <button type="button" className="btnCancelarAddCam" onClick={fechar}>CANCELAR</button>
              <button type="submit" className="btnSalvarAddCam">SALVAR</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}