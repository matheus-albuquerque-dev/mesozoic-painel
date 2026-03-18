import { useState } from "react"

//MODAL INFORMATIVO DE ESPECIES
export function ModalInfos({ selecionado, fechar, delEspecie }) {
  if (!selecionado) return null

  return (
    <div className="modal" onClick={fechar}>
      <div
        className="modalInfos"
        onClick={(e) => e.stopPropagation()}
      >
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

          <button 
            className="botaoDelEspecie" 
            onClick={() => delEspecie(selecionado.nome)}
            
          >
            Excluir Espécie
          </button>
        </div>
      </div>
    </div>
  )
}

//MODAL ADITIVO DE ESPECIES
export function ModalAddEspecies({ aberto, fechar, addEspecie }){
  const [nome, setNome] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [dieta, setDieta] = useState("")
  const [tamanho, setTamanho] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState("")

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

    await addEspecie(novoDino)

    //limpeza do formulario
    setNome("")
    setPeriodo("")
    setDieta("")
    setTamanho("")
    setDescricao("")
    setImagem("")

    fechar()
  }

  return (
    <div className="modal" onClick={fechar}>
      <div
        className="modalAddEspecie"
        onClick={(e) => e.stopPropagation()}
      >
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

          <input
            type="text"
            placeholder="Insira o CAMINHO da imagem (/assets/...)"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
          />

          <button type="submit">
            Salvar
          </button>
        </form>
      </div>  
    </div>
  )
}