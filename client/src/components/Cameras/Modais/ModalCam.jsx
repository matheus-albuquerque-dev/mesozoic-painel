import {useState} from "react"
import ModalAddCam from "./ModalAddCam"
import "../styles/ModalCam.css"
import ModalModifCam from "./ModalModifCam"

export default function ModalCam({fechar, recintoSelecionado, trocarAbaCamRec, recarregarCatalogoCam}){
    if (!recintoSelecionado || !recintoSelecionado.cameras || recintoSelecionado.cameras.length === 0) return null//seguranca
    const [camSelecionada, setcamSelecionada] = useState(recintoSelecionado.cameras[0])//inicializa com primeira cam
    const [modalAdd, setModalAdd] = useState(false)
    const [modalModifCam, setModalModifCam] = useState(false)//edit e del

    const recintoId = recintoSelecionado.recinto_id || recintoSelecionado.id

    const handleVerSobre = ()=>{
        fechar()
        const id = recintoSelecionado.recinto_id || recintoSelecionado.id//fallback
        trocarAbaCamRec(id)
    }

    const handleCamAdicionada = (novaCam) =>{
        recintoSelecionado.cameras.push(novaCam)
        setcamSelecionada(novaCam)
    }

    const handleCamAtualizada = (camAtualizada) =>{
        camSelecionada.nome = camAtualizada.nome
        camSelecionada.img_cam = camAtualizada.img_cam
        setcamSelecionada({...camSelecionada})//re-render
        if (recarregarCatalogoCam) recarregarCatalogoCam()
    }

    const handleCamExcluida = (idExcluido) =>{
        const listaRestante = recintoSelecionado.cameras.filter(c => c.id !== idExcluido)
        recintoSelecionado.cameras = listaRestante

        if (listaRestante.length > 0){
            setcamSelecionada(listaRestante[0])
        } else{//sem cameras, fecha modal
            fechar()
        }
        if (recarregarCatalogoCam) recarregarCatalogoCam()
    }

    return(
        <div className="modalCamBg">
            <div className="modalCamContainer" onClick={(e) => e.stopPropagation()}>

                <div className="acoesModalCam">
                    <button 
                        type="button"
                        onClick={() => setModalModifCam(true)}
                    >
                        MODIFICAR
                    </button>

                    <button onClick={fechar}>✕</button>
                </div>

                <div className="layoutCam">
                    {/*sidebar de cameras*/}
                    <div className="sidebarCam">
                        {/*add cam*/}
                        <button
                            type="button"
                            className="btnAddCamSidebar"
                            onClick={() => setModalAdd(true)}
                        >
                        +
                        </button>

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
            {/*MODAL DE ADD CAM DENTRO DE UM RECINTO QUE JA TENHA OUTRAS*/}
            {modalAdd &&(
                <ModalAddCam
                fechar={() => setModalAdd(false)}
                recintoId={recintoId}
                aoAdicionar={handleCamAdicionada}
                />
            )}
            {modalModifCam &&(//edit e del
                <ModalModifCam
                    fechar={() => setModalModifCam(false)}
                    camSelecionada={camSelecionada}
                    aoAtualizar={handleCamAtualizada}
                    aoExcluir={handleCamExcluida}
                />
            )}
        </div>
    )
}