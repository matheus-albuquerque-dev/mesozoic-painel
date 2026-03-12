export default function Sidebar({ aba, setAba }) {
  const abas =[
    { id: "dinopedia", nome: "Dinopédia" },
    { id: "genes", nome: "Genes" },
    { id: "recintos", nome: "Recintos" },
    { id: "cameras", nome: "Câmeras" }
  ]

  return (
    <aside className="sidebar">

      {abas.map(abaEspecifica => (
        <button
          key={abaEspecifica.id}
          className={aba === abaEspecifica.id ? "ativo" : ""}
          onClick={() => setAba(abaEspecifica.id)}
        >
          {abaEspecifica.nome}
        </button>
      ))}
      <img src="/assets/imgs/mapJP.png" className="mapa" />
    </aside>
  )
}