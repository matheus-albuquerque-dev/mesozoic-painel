import { useState, useEffect } from "react"
import "../styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/dinos")
      .then(res => res.json())
      .then(data => setDinossauros(data))
      .catch(err => console.error("Erro:", err))
  }, [])

  return (
    <div className="catalogo">

        <h2>Catálogo de Espécies</h2>

        <div className="listaEspecies">
          {dinossauros.map(dino => (
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
          <div
            className="modalConteudo"
            onClick={(e) => e.stopPropagation()}
          >

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