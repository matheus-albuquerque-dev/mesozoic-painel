import { useState, useEffect, useMemo } from "react"

import { ModalAddEspecie, ModalInfos, ModalEditEspecie } from "./ModaisDinopedia"

import "./styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])//serve para mostrar os dinossauros catalogados
  const [busca, setBusca] = useState("")//serve para pesquisar dinossauros na searchbar
  const [selecionado, setSelecionado] = useState(null)//serve para mostrar as informações da espécie selecionada, também servindo para excluí-la
  const [addAberta, setAddAberta] = useState(false)//serve para abrir o modal de adição de espécie
  const [dinoEditando, setDinoEditando] = useState(null)//diz qual dino está sendo editado
  const [editAberta, setEditAberta] = useState(false)//serve para abrir o modal de edição de espécie

  

  const dinosFiltrados = useMemo(() => { //useMemo evita recalcular tudo toda vez, otimizando performance
    return dinossauros
      .filter(dino =>
        (dino.nome || "").toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a,b) => a.nome.localeCompare(b.nome, "pt"))
  }, [dinossauros, busca])

  useEffect(() =>{
    async function carregarDinos(){
      try{
        const res = await fetch("http://localhost:3001/dinos")
        const data = await res.json()
        setDinossauros(data)
      } catch(err){
        console.error("Erro na busca de espécies: ", err)
      }
    }

    carregarDinos()
  }, [])

  return (
    <div className="catalogo">

        <header className="headerCatalogo">
          <h2>Catálogo de Espécies</h2>
          <button onClick={() => setAddAberta(true)}>
            Adicionar
          </button>
        </header>

        <input className="barraPesquisa"
          type="text"
          placeholder="Insira a espécie para buscar"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="listaEspecies">
          {dinosFiltrados.map(dino => (
            <button
              key={dino.id}
              onClick={() => setSelecionado(dino)}
              className={selecionado?.id === dino.id ? "ativo" : ""}
            >
              {dino.nome}
            </button>
          ))}
        </div>

      <ModalAddEspecie
        adicaoAberta={addAberta}
        fechar={() => setAddAberta(false)}
        setDinossauros={setDinossauros}
      />

      <ModalEditEspecie 
        editAberta={editAberta} 
        fechar={() => {
          setEditAberta(false)
          setDinoEditando(null)
        }}
        dino={dinoEditando} 
        setDinossauros={setDinossauros} 
      />

      <ModalInfos
        abrirEdit={() =>{
          setDinoEditando(selecionado)
          setEditAberta(true)
          setSelecionado(null)
        }}
        fechar={() => setSelecionado(null)}
        selecionado={selecionado}
        setDinossauros={setDinossauros}
      />
    </div>
  )
}