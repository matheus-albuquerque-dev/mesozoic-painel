import { useState, useEffect, useMemo } from "react"
import "../styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])
  const [busca, setBusca] = useState("")
  const [selecionado, setSelecionado] = useState(null)

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
        console.error("Erro:", err)
      }
    }

    carregarDinos()
  }, [])

  return (
    <div className="catalogo">

        <h2>Catálogo de Espécies</h2>

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


      {selecionado && (
        <div className="modal">
          <div className="modalConteudo">
            <button
              className="fechar"
              onClick={() => setSelecionado(null)}
            >
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
            </div>

          </div>
        </div>
      )}

    </div>
  )
}