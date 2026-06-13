const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Dashboard/PatientDashboard.tsx', 'utf8');

content = content.replace(
  '  const [novaNota, setNovaNota] = useState("");\n  const [enviandoNota, setEnviandoNota] = useState(false);\n  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioReal | null>(null);',
  '  const [novaNota, setNovaNota] = useState("");\n  const [enviandoNota, setEnviandoNota] = useState(false);\n  const [fotosGaleria, setFotosGaleria] = useState<any[]>([]);\n  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);\n  const [isUploadingFoto, setIsUploadingFoto] = useState(false);\n  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioReal | null>(null);'
);

content = content.replace(
  '      const [checklistsData, sintomasList, solicitacoesData, notasData] = await Promise.all([\n        backendService.obterChecklistsPaciente(idUsuario).catch(() => [] as ChecklistPaciente[]),\n        getSintomas().catch(() => []),\n        backendService.listarSolicitacoesVinculoPaciente(idUsuario).catch(() => [] as VinculoPaciente[]),\n        backendService.listarNotasPaciente(idUsuario).catch(() => [] as MockConsulta[]),\n      ]);\n\n      setChecklists(Array.isArray(checklistsData) ? checklistsData : []);\n      setNotas(Array.isArray(notasData) ? notasData : []);',
  '      const [checklistsData, sintomasList, solicitacoesData, notasData, fotosData] = await Promise.all([\n        backendService.obterChecklistsPaciente(idUsuario).catch(() => [] as ChecklistPaciente[]),\n        getSintomas().catch(() => []),\n        backendService.listarSolicitacoesVinculoPaciente(idUsuario).catch(() => [] as VinculoPaciente[]),\n        backendService.listarNotasPaciente(idUsuario).catch(() => [] as MockConsulta[]),\n        backendService.listarFotosPaciente(idUsuario).catch(() => [] as any[]),\n      ]);\n\n      setChecklists(Array.isArray(checklistsData) ? checklistsData : []);\n      setNotas(Array.isArray(notasData) ? notasData : []);\n      setFotosGaleria(Array.isArray(fotosData) ? fotosData : []);'
);

const handlers = `
  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsUploadingFoto(true);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await backendService.adicionarFotoPaciente(idUsuario, base64);
        const novasFotos = await backendService.listarFotosPaciente(idUsuario);
        setFotosGaleria(novasFotos);
        setCurrentFotoIndex(0); // vai pra foto nova que é sempre a 0
        void carregarDados(); // recarregar pra puxar foto_perfil
      } catch (err) {
        alert("Erro ao enviar foto");
      } finally {
        setIsUploadingFoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletarFoto = async (idFoto: number) => {
    if (!window.confirm("Deseja realmente excluir esta foto?")) return;
    try {
      await backendService.deletarFotoPaciente(idUsuario, idFoto);
      const novasFotos = await backendService.listarFotosPaciente(idUsuario);
      setFotosGaleria(novasFotos);
      setCurrentFotoIndex(prev => Math.max(0, prev - 1));
      void carregarDados(); // recarregar
    } catch (err) {
      alert("Erro ao excluir foto");
    }
  };

  const handleDefinirFotoPrincipal = async (idFoto: number) => {
    try {
      await backendService.definirFotoPrincipal(idUsuario, idFoto);
      alert("Foto principal atualizada!");
      void carregarDados();
    } catch (err) {
      alert("Erro ao definir foto principal");
    }
  };

  const handleResponderVinculo = async (idVinculo: number, aceitar: boolean) => {`;

content = content.replace('  const handleResponderVinculo = async (idVinculo: number, aceitar: boolean) => {', handlers);

const galleryUi = `          {/* GALERIA DE FOTOS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            {fotosGaleria.length > 0 ? (
              <div style={{ position: "relative", width: "180px", height: "180px" }}>
                {/* Seta Esquerda */}
                {fotosGaleria.length > 1 && (
                  <button 
                    onClick={() => setCurrentFotoIndex(prev => prev === 0 ? fotosGaleria.length - 1 : prev - 1)}
                    style={{ position: "absolute", left: "-30px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#1a5fa8" }}
                  >
                    &#10094;
                  </button>
                )}
                
                <img
                  src={fotosGaleria[currentFotoIndex]?.foto_url}
                  alt="Foto do Paciente"
                  style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover", border: "3px solid #1a5fa8" }}
                />
                
                {/* Seta Direita */}
                {fotosGaleria.length > 1 && (
                  <button 
                    onClick={() => setCurrentFotoIndex(prev => prev === fotosGaleria.length - 1 ? 0 : prev + 1)}
                    style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#1a5fa8" }}
                  >
                    &#10095;
                  </button>
                )}
                
                {/* Controles de Edição */}
                <div style={{ position: "absolute", bottom: "5px", right: "5px", display: "flex", gap: "5px" }}>
                  {paciente.foto_perfil !== fotosGaleria[currentFotoIndex]?.foto_url && (
                    <button 
                      onClick={() => handleDefinirFotoPrincipal(fotosGaleria[currentFotoIndex].id)}
                      style={{ background: "#ca8a04", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Tornar Foto Principal"
                    >
                      ★
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeletarFoto(fotosGaleria[currentFotoIndex].id)}
                    style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Excluir Foto"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ width: "180px", height: "180px", borderRadius: "10px", border: "3px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                Sem Foto
              </div>
            )}
            
            {/* Adicionar Nova Foto */}
            <div style={{ marginTop: "10px" }}>
              <label style={{ cursor: "pointer", color: "#1a5fa8", fontSize: "13px", fontWeight: "bold", textDecoration: "underline" }}>
                {isUploadingFoto ? "Enviando..." : "+ Adicionar Foto"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadFoto} disabled={isUploadingFoto} />
              </label>
            </div>
            {fotosGaleria.length > 1 && (
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                {currentFotoIndex + 1} de {fotosGaleria.length}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#475569", width: "100%" }}>`;

const oldImageUi = `          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            {(usuario?.role === "admin" || usuario?.role === "instituto" || usuario?.role === "medico") && paciente.foto_perfil && (
              <img
                src={paciente.foto_perfil}
                alt="Foto do Paciente"
                style={{ width: "90px", height: "90px", borderRadius: "10px", objectFit: "cover", border: "3px solid #1a5fa8", flexShrink: 0 }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#475569" }}>`;

content = content.replace(oldImageUi, galleryUi);

fs.writeFileSync('frontend/src/components/Dashboard/PatientDashboard.tsx', content);
