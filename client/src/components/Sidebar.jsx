export default function Sidebar({ aba, setAba }) {
  const abas = ["Dinopédia", "Genes", "Recintos", "Câmeras"]

  return (
    <aside className="sidebar">

      {abas.map(nome => (
        <button
          key={nome}
          className={aba === nome ? "ativo" : ""}
          onClick={() => setAba(nome)}
        >
          {nome}
        </button>
      ))}
      <img src="/assets/imgs/mapJP.png" className="mapa" />
    </aside>
  )
}