import { criarUsuario } from "./services/criarUsuario";
import { logarUsuario } from "./services/logarUsuario";
import { verificarEmail } from "./services/verificarEmail";


// criarUsuario("Filho da puta", "este@gmail.com", "123456", "12345678900", "11999999999")

// const emailVerificado = verificarEmail("teste@gmail.com").then((emailExiste) => {
//     console.log("Email existe?", emailExiste);
// }).catch((error) => {
//     console.error("Erro ao verificar email:", error);
// }).finally(() => {process.exit();});

logarUsuario("12345678900", "123456").then((senhaValida) => {
    console.log("Senha válida?", senhaValida);
}).catch((error) => {
    console.error("Erro ao logar usuário:", error);
}).finally(() => {process.exit();});
