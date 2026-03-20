import { useState, useEffect, useMemo } from "react"

import { ModalInfos, ModalAddEspecie } from "./ModaisDinopedia"

import "./styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])//serve para mostrar os dinossauros catalogados
  const [busca, setBusca] = useState("")//serve para pesquisar dinossauros na searchbar
  const [selecionado, setSelecionado] = useState(null)//serve para mostrar as informações da espécie selecionada, também servindo para excluí-la
  const [adicaoAberta, setAdicaoAberta] = useState(false)//serve para abrir o modal de adição de espécie

  

  const dinosFiltrados = useMemo(() => { //useMemo evita recalcular tudo toda vez, otimizando performance
    return dinossauros
      .filter(dino =>
        (dino.nome || "").toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a,b) => a.nome.localeCompare(b.nome, "pt"))
  }, [dinossauros, busca])

  useEffect(() => {
    async function carregarDinos(){
      try{
        const res = await fetch("http://localhost:3000/dinos")
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
          <button onClick={() => setAdicaoAberta(true)}>
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
        aberto={adicaoAberta}
        fechar={() => setAdicaoAberta(false)}
        setDinossauros={setDinossauros}
      />

      <ModalInfos
        selecionado={selecionado}
        fechar={() => setSelecionado(null)}
        setDinossauros={setDinossauros}
      />
    </div>
  )
}