import { useState, useRef } from "react" //(useRef) SELEÇÃO DE IMAGEM, DEVE SER RETIRADO NO ELECTRON
import Swal from 'sweetalert2'
import "./styles/Alertas.css"

//ALERTAS
const alerta = Swal.mixin({
  customClass: {
    popup: 'alertaPopup',
    title: 'alertaTitulo',
    htmlContainer: 'alertaConteudo',
    confirmButton: 'alertaBotao',
    cancelButton: 'alertaBotao',
  },
  showClass: {
    popup: ''//sem animação de entrada
  },
  hideClass: {
    popup: ''//sem animação de saída
  },
  buttonsStyling: false,

  allowOutsideClick: false,//não fecha se clicar fora
  
  didOpen: () => {
    const confirmBtn = document.querySelector('.swal2-confirm')
    const cancelBtn = document.querySelector('.swal2-cancel')
    if (confirmBtn && cancelBtn){//"gap", caso haja 2 botões(confirm e cancel)
      confirmBtn.style.marginRight = '20px'
    }
  }
})

//FUNÇÃO DE ADIÇÃO
const addEspecie = async (novoDino, setDinossauros, fechar) =>{
    try {
      const res = await fetch("http://localhost:3000/dinos",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoDino)
      })
  
      const data = await res.json()

      if (!res.ok){//response fora de [200-299]
        throw new Error(data.message || "Erro desconhecido no servidor") //captura de erro ou mensagem genérica
      }

      fechar()

      //alerta o useMemo
      setDinossauros(prev => [...prev, data])//atualiza catálogo exibido para incluir a nova espécie
      alerta.fire({
        title: 'Operação bem-sucedida.',
        text: 'Espécie adicionada à Dinopédia.',
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

//FUNÇÃO DE EXCLUSÃO
const delEspecie = async (nome, fechar, setDinossauros) =>{
    const resultado = await alerta.fire({
      title: 'Exclusão solicitada.',
      text: `Deseja remover ${nome} da Dinopédia?`,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (resultado.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/dinos/${nome}`, {
          method: "DELETE",
        })

        if (!res.ok){//response fora de [200-299]
          throw new Error(data.message || "Erro desconhecido no servidor")//captura de erro ou mensagem genérica
        }

        //alerta o useMemo
        setDinossauros(prev => prev.filter(dino => dino.nome !== nome))
          
        alerta.fire({
          title: 'Operação bem-sucedida.',
          text: 'Espécie excluída da Dinopédia.',
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

//MODAL ADITIVO DE ESPÉCIES
export function ModalAddEspecie({ aberto, fechar, setDinossauros }){
  const [nome, setNome] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [dieta, setDieta] = useState("")
  const [tamanho, setTamanho] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState("")

  //REFERÊNCIA PARA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const arquivoRef = useRef(null)

  if (!aberto) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
        !nome.trim() ||
        !periodo.trim() ||
        !dieta.trim() ||
        !tamanho.trim() ||
        !descricao.trim() ||
        !imagem.trim()
    ) {
        return
    }

    const novoDino = {
      nome,
      periodo,
      dieta,
      tamanho,
      descricao,
      imagem
    }

    await addEspecie(novoDino, setDinossauros, fechar)

    //limpeza do formulario
    setNome("")
    setPeriodo("")
    setDieta("")
    setTamanho("")
    setDescricao("")
    setImagem("")
  }

  //LÓGICA DA SELEÇÃO DE IMAGEM, DEVE SER RETIRADA NO ELECTRON
  const handleBotaoClique = () =>{
    arquivoRef.current.click()//botão bonito "cobre" o feio, e chama o feio quando clicado
  }

  const escolhaDoArquivo = (e) => {
    const arquivo = e.target.files[0]//pega só o primeiro
    if (arquivo){
      setImagem(`/assets/imgs/Dinopedia/${arquivo.name}`)//o usuário tem que pôr o arquivo manualmente na pasta, no Electron será mais fácil
    }
  }

  return(
    <div className="modal">
      <div className="modalAddEspecie" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          ✕
        </button>

        <form onSubmit={handleSubmit} className="formularioAddDino">
          <h2>Adicionar Dinossauro</h2>
          <input
            type="text"
            placeholder="Insira o NOME da espécie"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="text"
            placeholder="Insira o PERÍODO da espécie"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />

          <input
            type="text"
            placeholder="Insira a DIETA da espécie"
            value={dieta}
            onChange={(e) => setDieta(e.target.value)}
          />

          <input
            type="text"
            placeholder="Insira o TAMANHO da espécie"
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
          />

          <input
            type="text"
            placeholder="Insira a DESCRIÇÃO da espécie"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div className="selecaoImagem">
            <input 
              type="file" 
              ref={arquivoRef} 
              onChange={escolhaDoArquivo} 
              style={{display: 'none'}}//esconde feiura
              accept="image/*" 
            />
            <button type="button" onClick={handleBotaoClique}>
              Selecione a imagem
            </button>
            <p>{imagem || "Imagem não selecionada."}</p>
          </div>

          <button type="submit">
            Salvar
          </button>
        </form>
      </div>  
    </div>
  )
}



//MODAL INFORMATIVO DE ESPÉCIES
export function ModalInfos({ selecionado, fechar, setDinossauros }){
  if (!selecionado) return null

  return(
    <div className="modal">
      <div className="modalInfos" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          ✕
        </button>

        <div className="dinoHeader">
          <p><strong>{selecionado.nome}</strong></p>
          <img
            src={selecionado.imagem}
            alt={selecionado.nome}
            className="dinoImagem"
          />
        </div>

        <div className="dinoInfo">
          <p><strong>Período:</strong> {selecionado.periodo}</p>
          <p><strong>Dieta:</strong> {selecionado.dieta}</p>
          <p><strong>Tamanho:</strong> {selecionado.tamanho}</p>
          <p><strong>Descrição:</strong> {selecionado.descricao}</p>
        </div>
        
        <div className="containerBotaoDelEspecie">
          <button 
              className="botaoDelEspecie" 
              onClick={() => delEspecie(selecionado.nome, fechar, setDinossauros)}
              
            >
              Excluir Espécie
            </button>
        </div>
      </div>
    </div>
  )
}