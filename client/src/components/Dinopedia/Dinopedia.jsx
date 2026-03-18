import { useState, useEffect, useMemo } from "react"
import Swal from 'sweetalert2'

import { ModalInfos, ModalAddEspecies } from "./ModaisDinopedia"

import "../../styles/Dinopedia.css"

export default function Dinopedia() {
  const [dinossauros, setDinossauros] = useState([])//serve para mostrar os dinossauros catalogados
  const [busca, setBusca] = useState("")//serve para pesquisar dinossauros na searchbar
  const [selecionado, setSelecionado] = useState(null)//serve para mostrar as informações da espécie selecionada, também servindo para excluí-la
  const [adicaoAberta, setAdicaoAberta] = useState(false)//serve para abrir o modal de adição de espécie

  const addEspecie = async (novoDino) =>{
    try {
      const res = await fetch("http://localhost:3000/dinos",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoDino)
      })
  
      const data = await res.json()
  
      setDinossauros(prev => [...prev, data])//atualiza catálogo exibido para incluir a nova espécie
      Swal.fire({
        title: 'Sucesso!',
        text: 'Espécie adicionada ao catálogo.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (err) {
      Swal.fire({
        title: 'Falha!',
        text: 'Falha',
        icon: 'fail',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const delEspecie = async (nome) => {
    //confirmação temporária
    const resultado = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir o ${nome} do catálogo?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/dinos/${nome}`, {
          method: "DELETE",
        });

        if (res.ok) {
          //alerta o useMemo
          setDinossauros(prev => prev.filter(dino => dino.nome !== nome));
          setSelecionado(null); //instafecha o modal
          
          Swal.fire('Excluído!', 'O registro foi removido.', 'success');
        }
      } catch (err) {
        Swal.fire('Erro!', 'Não foi possível excluir o dinossauro.', 'error');
      }
    }
  }

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


      <ModalInfos
        selecionado={selecionado}
        fechar={() => setSelecionado(null)}
        delEspecie={delEspecie}
      />

      <ModalAddEspecies
        aberto={adicaoAberta}
        fechar={() => setAdicaoAberta(false)}
        addEspecie={addEspecie}
      />
    </div>
  )
}