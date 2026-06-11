import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AtivacaoConta = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', marginTop: '100px' }}>
                <h2>Link de ativação inválido ou ausente.</h2>
            </div>
        );
    }

    const handleAtivar = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setSucesso(true);
            setLoading(false);
            setTimeout(() => navigate('/login'), 3000);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Ativar Conta</h2>
            <p>Crie uma senha para acessar seu painel.</p>

            {sucesso ? (
                <div style={{ color: 'green', marginTop: '10px' }}>
                    Conta ativada com sucesso! Redirecionando para o login...
                </div>
            ) : (
                <form onSubmit={handleAtivar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {erro && <div style={{ color: 'red' }}>{erro}</div>}
                    <div>
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div>
                        <label>Confirmar Senha:</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Ativando...' : 'Ativar Conta'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AtivacaoConta;
