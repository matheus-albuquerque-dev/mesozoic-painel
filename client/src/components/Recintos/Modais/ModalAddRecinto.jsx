import {useState, useRef} from "react"
import {alerta} from "../../common/Alertas/Alertas"

/*TODO: ORGANIZAR API 
const API_URL = import.meta.env.VITE_API_URL*/

//FUNÇÃO DE ADIÇÃO
const addRecinto = async (novoRecinto, fechar, setRecintos) =>{
    try {
      const res = await fetch(`${API_URL}/recintos`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoRecinto)
      })
  
      const data = await res.json()

      if (!res.ok){//response fora de [200-299]
        throw new Error(data.error || "Erro desconhecido.")//captura de erro ou mensagem genérica
      }

      fechar()

      //alerta o useMemo
      setRecintos(prev => [...prev, data])//atualiza catálogo exibido para incluir o novo recinto
      alerta.fire({
        title: 'Operação bem-sucedida.',
        text: 'Recinto adicionado à Dinopédia.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })

    } catch (err){
      alerta.fire({
        title: 'Operação malsucedida.',
        text: err.message,
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }
}

//MODAL ADITIVO DE RECINTOS
export default function ModalAddRecinto({fechar, recintos, setRecintos}){
  const [nome, setNome] = useState("")
  const [estado, setEstado] = useState("")
  const [especies, setEspecies] = useState("")/*TODO: DEVE VERIFICAR ESPÉCIES DA DINOPÉDIA PRA MONTAR UM DROPDOWN DINÂMICO
  (SE A ESPÉCIE FOR ADICIONADA, SAI DO DROPDOWN, E DE ALGUMA FORMA TEM QUE SER REMOVÍVEL, COM "XZINHO" DO LADO TALVEZ, 
  E CRIAR UMA LISTA DAS ESPECIES DO RECINTO")*/
  const [localizacao, setLocalizacao] = useState("")
  const [imagemPreview, setImagemPreview] = useState("")
  const [imagemInfos, setImagemInfos] = useState("")

  //REFERÊNCIA PARA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const arquivoRef = useRef(null)

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const nomeExiste = recintos.some(
      (recinto) => recinto.nome.toLowerCase() === nome.toLowerCase()
    )

    if (nomeExiste){
      return alerta.fire({
        title: 'Nome duplicado!',
        text: 'Já existe um recinto cadastrado com este nome.',
        showConfirmButton: true,
        confirmButtonText: 'Fechar'
      })
    }

    if (
        !nome.trim() ||
        !estado.trim() ||
        !especies.trim() ||
        !localizacao.trim() ||
        !imagemPreview.trim() ||
        !imagemInfos.trim()
    ) {
        return
    }

    const novoRecinto ={
      nome,
      estado,
      especies,
      localizacao,
      imagemPreview,
      imagemInfos
    }

    await addRecinto(novoRecinto, fechar, setRecintos)

    //limpeza do formulario
    setNome("")
    setEstado("")
    setEspecies("")
    setLocalizacao("")
    setImagemPreview("")
    setImagemInfos("")
  }

  //LÓGICA DA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const handleBotaoClique = () => arquivoRef.current.click()//botão bonito "cobre" o feio, e chama o feio quando clicado

  const escolhaDoArquivo = (e) => {
    const arquivo = e.target.files[0]//pega só o primeiro
    if (arquivo){
      setImagem(`/assets/imgs/Recintos/${arquivo.name}`)//o usuário tem que pôr o arquivo manualmente na pasta, no Electron será mais fácil
    }
  }

  return(
    <div className="modal">
      <div className="modalAddRecinto" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          ✕
        </button>

        <form onSubmit={handleSubmit} className="formularioAddRecinto">
          <h2>Adicionar Recinto</h2>
          <input type="text" placeholder="Insira o NOME do recinto" value={nome} onChange={(e) => setNome(e.target.value)}/>
          <input type="text" placeholder="Insira o ESTADO do recinto" value={estado} onChange={(e) => setEstado(e.target.value)}/>
          {/* TODO (DROPDOWN): <input type="text" placeholder="Insira as ESPÉCIES do recinto" value={especies} onChange={(e) => setEspecies(e.target.value)}/> */}
          <input type="text" placeholder="Insira a LOCALIZAÇÃO do recinto" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}/>
          <input type="text" placeholder="Insira as IMAGEM PREVIEW" value={imagemPreview} onChange={(e) => setImagemPreview(e.target.value)}/>
          <input type="text" placeholder="Insira as IMAGEM PRINCIPAL" value={imagemInfos} onChange={(e) => setImagemInfos(e.target.value)}/>

          <div className="selecaoImagem">
            <input type="file" ref={arquivoRef}  onChange={escolhaDoArquivo} style={{display: 'none'}}/*esconde feiura*/ accept="image/*"/>
            <button type="button" onClick={handleBotaoClique}>
              Selecione a imagem de preview
            </button>
            <p>{imagemPreview || "Imagem não selecionada."}</p>
          </div>
          <div className="selecaoImagem">
            {/*TODO: REPETIR ARQUIVOREF CAUSA ERRO?*/}
            <input type="file" ref={arquivoRef}  onChange={escolhaDoArquivo} style={{display: 'none'}}/*esconde feiura*/ accept="image/*"/>
            <button type="button" onClick={handleBotaoClique}>
              Selecione a imagem principal
            </button>
            <p>{imagemInfos || "Imagem não selecionada."}</p>
          </div>

          <button type="submit">
            Salvar
          </button>
        </form>
      </div>  
    </div>
  )
}