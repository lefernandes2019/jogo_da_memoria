//CLASSE COM A LÓGICA DE FUNCIONAMENTO DO JOGO

class JogoDaMemoria{
    //ao criar uma nova instância "new JogoDaMemoria" deverá ser passado obrigatoriamente um parâmetro ao constructor
    //neste caso o parâmetro será a class Tela 
    constructor(Tela){
        //propriedade this.tela recebe todo o conteúdo da class tela
        this.tela = Tela
        
        //o caminho sempre será relativo ao index.html, iniciado de index.html
        this.heroisIniciais = [
            {img: './arquivos/batman.png', nome: 'batman'},
            {img: './arquivos/flash.png', nome: 'flash'},
            {img: './arquivos/spider.png', nome: 'spider'},
            {img: './arquivos/thor.png', nome: 'thor'},
            {img: './arquivos/hell_boy.png', nome: 'hell_boy'},
            {img: './arquivos/cyclops.png', nome: 'cyclops'},
            {img: './arquivos/deadpool.png', nome: 'deadpool'},
            {img: './arquivos/antenna.png', nome: 'antenna'},
        ]

        this.iconePadrao = './arquivos/avatar.png'
        this.heroisEscondidos = []
        this.heroisSelecionados = []
    }

    //para usar propriedades da class "this" tela e heroisIniciais, não precisamos usar o static!
    inicializar(){
        //executando a função atualizarImagens() da class Tela passando o array com os herois
        this.tela.atualizarImagens(this.heroisIniciais)

        //No JS o "this" se refere ao contexto atual, e dependendo de quando uma função for executada este contexto pode ser alterado, diferente
        //.bind() permite "forçar" a function ao ser executada à usar o contexto atual, ignorar todo o contexto que ele tinha e usar as propriedades e funções atuais
        //o único objetivo do .bind() é manter as variáveis desta classe TAMBÉM na outra classe (instância criada) quando ela for executar
        //ao executar a função em tela.js, o "this" dele terá tudo que esta classe possui
        //força a função em tela.js a usar o "this" de JogodaMemoria.js
        this.tela.configurarBotaoJogar(this.jogar.bind(this)) //NÃO está executando-a functiona jogar

        //forçar a função ao ser executada usar o contexto do jogoDaMemoria.js e não da tela.js ou do browser
        this.tela.configurarBotaoVerificarSelecao(this.verificarSelecao.bind(this));

        //forçar o uso das variáveis desta classe ao executar mostrarHeroisEscondidos()
        this.tela.configurarBotaoMostrarTudo(this.mostrarHeroisEscondidos.bind(this));
    }
    
    embaralhar(){
        const copias = this.heroisIniciais
        
        //duplicando o array heroisIniciais concatenando o array atual com o próprio array.
        .concat(this.heroisIniciais)

        //entrando em cada item do array, que é um obj heroi, e add um id aleatório
        //Object.assign() está juntando um obj vazio {} com o obj item e incluindo a propriedade id
        .map(item => {
            return Object.assign({}, item, {id: Math.random() / 0.5}) //0.5 é somente para reduzir a possibilidade de gerar 2 ids iguais
        })

        //ordenando aleatoriamente
        .sort(() => Math.random() - 0.5)

        this.tela.atualizarImagens(copias);
        
        //para exibir o spinner e o contador
        this.tela.exibirCarregando(true);

        const idDoIntervalo = this.tela.iniciarContador()

        //esperar 5 segundos para atualizar a tela e mostrar o img dos avatars
        setTimeout(() => {
            //para mostrar a img dos avatars
            this.esconderHerois(copias);

            //parando o contador do setInterval
            this.tela.limparContador(idDoIntervalo);

            //para retirar o spinner e o contador
            this.tela.exibirCarregando(false);
        }, 5000)


    }

    esconderHerois(herois){
        //trocar a imagem de todos os herois existentes pelo icone padrão

        //extraindo somente o nome, id do array recebido como parâmetro
        const heroisOcultos = herois.map(({nome, id}) => {
            return {
                id, //irá retornar o mesmo valor já existente do parâmtero
                nome,
                img: this.iconePadrao
            }
        })

        //atualizamos a tela com os herois ocultos
        this.tela.atualizarImagens(heroisOcultos);

        //guardamos os heroisEscondidos para uso posterior
        this.heroisEscondidos = heroisOcultos
    }

    verificarSelecao(id, nome){
        const item = {id, nome};
        
        //verificando a qtde de herois selecionados e tomar ação se foi encontrado o par ou não
        const $heroisSelecionados = this.heroisSelecionados.length;

        switch($heroisSelecionados){
            case 0:
                //add a escolha na lista, esperando a próxima escolha
                this.heroisSelecionados.push(item);
                break;
            
            case 1:
                //se a qtde de $heroisSelecionados for 1, significa que o usuário já havia selecionado 1 item e acabou de selecionar o 2º item
                //obtendo o 1º item da lista
                const [opcao1] = this.heroisSelecionados;

                //zerando itens para não selecionar mais de 2
                this.heroisSelecionados = [];

                //conferindo se o id e o nome que estava armazenado no array this.heroisSelecionados bate com o 2º item passado nesta nova execução da function
                //verifica se o par de fato foi encontrado
                //obs: os ids precisam ser diferentes por serem únicos, evita do usuário clicar na mesma carta e hackear o jogo
                if(opcao1.nome === item.nome && opcao1.id !== item.id){
                    
                    this.exibirHerois(item.nome)
                    this.tela.exibirMensagem(true)
                    return                    
                }

                //caso não entre no IF
                this.tela.exibirMensagem(false)
                break
        }
    }

    exibirHerois(nomeDoHeroi){
        //procurar o heroi pelo nome no array heroisIniciais e obter somente a sua img
        const {img} = this.heroisIniciais.find((item) => item.nome === nomeDoHeroi)

        //função para exibir somente o heroi selecionado
        this.tela.exibirHerois(nomeDoHeroi, img)
    }

    mostrarHeroisEscondidos(){
        //selecionar todos os herois da tela e inserir em cada um sua verdadeira img
        const heroisEscondidos = this.heroisEscondidos;

        //percorrer cada elemento de heroisEscondidos e buscar pelo nome no array heroisIniciais
        //ao achar atribui o caminho do img de heroisIniciais ao img de heroisEscondidos
        for(const heroi of heroisEscondidos){
            const {img} = this.heroisIniciais.find(item => item.nome === heroi.nome)
            heroi.img = img
        }

        this.tela.atualizarImagens(heroisEscondidos)
    }

    jogar(){
        this.embaralhar()
    }
}