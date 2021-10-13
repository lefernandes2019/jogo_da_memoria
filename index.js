function carregamentoTela(){

    //inicializando o jogo
    const jogoDaMemoria = new JogoDaMemoria(Tela);
    jogoDaMemoria.inicializar()
}

window.onload = carregamentoTela;





