import {useState} from "react"
import "./styles/ModalCam.css"

export default function ModalCam({fechar, recintoSelecionado, trocarAbaCamRec}){
    if (!recintoSelecionado || !recintoSelecionado.cameras || recintoSelecionado.cameras.length === 0) return null//seguranca
    const [camSelecionada, setcamSelecionada] = useState(recintoSelecionado.cameras[0])//inicializa com primeira cam

    const handleVerSobre = ()=>{
        fechar()
        const id = recintoSelecionado.recinto_id || recintoSelecionado.id//fallback
        trocarAbaCamRec(id)
    }

    return(
        <div className="modalCamBg">
            <div className="modalCamContainer" onClick={(e) => e.stopPropagation()}>
                <button className="btnFecharCamModal" onClick={fechar}>✕</button>

                <div className="layoutCam">
                    {/*sidebar de cameras*/}
                    <div className="sidebarCam">
                        {recintoSelecionado.cameras.map((cam) => (
                            <button
                                key={cam.id}
                                type="button"
                                className={`miniCamSidebar ${camSelecionada.id === cam.id ? "ativa" : ""}`}
                                onClick={() => setcamSelecionada(cam)}
                            >
                                <img src={cam.img_cam} alt={cam.nome} />
                                <span>{cam.nome}</span>
                            </button>
                        ))}
                    </div>
                    {/*camera selecionada ampliada*/}
                    <div className="areaCamSelecionada">
                        <h2 className="nomeRecCamSelecionada">{recintoSelecionado.recinto_nome}</h2>

                        <div className="camSelecionada">
                            <img src={camSelecionada.img_cam} alt={camSelecionada.nome}/>
                        </div>

                        <h3 className="nomeCamSelecionada">{camSelecionada.nome}</h3>

                        <button className="btnVerSobreRecinto" onClick={handleVerSobre}>
                            VER SOBRE {recintoSelecionado.recinto_nome}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}