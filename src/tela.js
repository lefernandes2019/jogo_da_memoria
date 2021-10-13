
const ID_CONTEUDO = "conteudo"
const ID_BTN_JOGAR = "jogar"
const ID_MENSAGEM = "mensagem"
const CLASSE_INVISIVEL = "invisible"
const ID_CARREGANDO =  "carregando"
const ID_CONTADOR = "contador"
const ID_BTN_MOSTRAR_TUDO = "mostrarTudo"
const MENSAGENS = {
    sucesso: {
        texto: 'Combinação correta!',
        classe: 'alert-sucess'
    },
    erro: {
        texto: 'Combinação incorreta!',
        classe: 'alert-danger'
    }
}

//CLASSE QUE SERÁ RESPONSÁVEL POR MANIPULAR A TELA, INSERIR O CONTEÚDO DA TELA
class Tela{
    //static para funções que NÃO usarão this, ou seja, propriedades da class
    static obterCodigoHtml(item){
        return `
        <div class="col-md-3">
            <div class="card" style="width: 25%; margin-left: 30%" onclick="window.verificarSelecao('${item.id}', '${item.nome}')" >
                <img src="${item.img}" name=${item.nome} class="card-img-top" alt="...">
            </div>
            <br />
        </div>
        `
    }

    static alterarConteudoHtml(codigoHtml){
        const conteudo = document.getElementById(ID_CONTEUDO);
        conteudo.innerHTML = codigoHtml
    }

    static gerarStringHtmlPelaImagem(itens){
        //usando o métodp .map da class nativa Array para que em cada posição do index executar a função obterCodigoHtml
        //.join para juntar todos os resultados de obterCodigoHTML em uma única string, separando-os por ''.
        return itens.map(Tela.obterCodigoHtml).join('');
    }

    static atualizarImagens(itens){
        //executa a function gerarStringHtmlPelaImagem() e com o seu return que é todo os cards em string insere-os no index.html na div com id='conteudo'
        const codigoHtml = Tela.gerarStringHtmlPelaImagem(itens);
        Tela.alterarConteudoHtml(codigoHtml);
    }

    static configurarBotaoJogar(funcaoOnClick){
        const btnJogar = document.getElementById(ID_BTN_JOGAR);
        btnJogar.onclick = funcaoOnClick;
    }

    static configurarBotaoVerificarSelecao(funcaoOnClick){
        window.verificarSelecao = funcaoOnClick
    }

    static exibirHerois(nomeDoHeroi, img){
        //pegando os elementos <img> que possuem o atributo "name" com o nomeDoHeroi passado como parâmetro em um array
        const elementosHtml = document.getElementsByName(nomeDoHeroi)

        //usando o forEach() para percorrer cada elemento do array montado acima e setar o caminho da imagem
        //alterando da imagem avatar para a imagem original do heroi
        elementosHtml.forEach(item => {
            item.src = img
        })
    }

    static async exibirMensagem(sucesso = true){
        const elemento = document.getElementById(ID_MENSAGEM)

        if(sucesso){
            elemento.classList.remove(MENSAGENS.erro.classe)
            elemento.classList.add(MENSAGENS.sucesso.classe)
            elemento.innerText = MENSAGENS.sucesso.texto
        }
        else {
            elemento.classList.remove(MENSAGENS.sucesso.classe)
            elemento.classList.add(MENSAGENS.erro.classe)
            elemento.innerText = MENSAGENS.erro.texto
        }

        elemento.classList.remove(CLASSE_INVISIVEL)

        setTimeout(() => {
            elemento.classList.add(CLASSE_INVISIVEL)            
        }, 1000);
    }

    static exibirCarregando(mostrar = true){
        const carregando = document.getElementById(ID_CARREGANDO);
        if(mostrar){
            carregando.classList.remove(CLASSE_INVISIVEL);
            return
        }

        //se não entrar no IF
        carregando.classList.add(CLASSE_INVISIVEL)
    }

    static iniciarContador(){
        let contarAte = 5;
        const elementoContador = document.getElementById(ID_CONTADOR);

        //substituindo o texto 'Começando em $$contador segundos'
        //onde está $$contador adicionaremos o valor
        const identificadorNoTexto = '$$contador';
        const textoPadrao = `Começando em ${identificadorNoTexto} segundos...`

        //função para atualizar o texto e inserir no HTML pelo .innerHTML
        //decrementando o valor de contarAte e substituindo o identificadorNoTexto pelo novo valor de contarAte
        const atualizarTexto = () => {
            elementoContador.innerHTML = textoPadrao.replace(identificadorNoTexto, contarAte--)
        }

        atualizarTexto()

        //setInterval para executar a function atualizarTexto() a cada 1seg
        //atribuindo o retorno do setInterval em idDoIntervalo para poder parar o seu funcionamento
        const idDoIntervalo = setInterval( atualizarTexto, 1000);

        return idDoIntervalo;
    }

    static limparContador(idDoIntervalo){
        //função que recebe o parâmetro idDoIntervalo do setInterval e para a sua execução
        clearInterval(idDoIntervalo);

        //limpa o texto de exibição após finalizar o contador
        document.getElementById(ID_CONTADOR).innerHTML = ""
    }

    static configurarBotaoMostrarTudo(funcaoOnClick){
        const btnMostrarTudo = document.getElementById(ID_BTN_MOSTRAR_TUDO);
        
        btnMostrarTudo.onclick = funcaoOnClick
    }
}