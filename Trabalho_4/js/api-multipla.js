window.onload = async () => {
  const divResultado = document.getElementById('resultado-multiplo');
  
  try {
    const promessas = [
      fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
      fetch('https://corsproxy.io/?url=https://www.freetogame.com/api/game?id=452'),
      fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal')
    ];
    
    const respostas = await Promise.all(promessas);
    
    respostas.forEach((res, index) => {
      if (!res.ok) throw new Error(`O servidor número ${index + 1} falhou ao responder.`);
    });
    
    const [dadosMoeda, dadosGame, dadosFutebol] = await Promise.all([
      respostas[0].json(),
      respostas[1].json(),
      respostas[2].json()
    ]);
    
    const cotacaoDolar = parseFloat(dadosMoeda.USDBRL.bid).toFixed(2);
    
    const jogoTitulo = dadosGame.title;
    const jogoGenero = dadosGame.genre;
    const jogoPlataforma = dadosGame.platform;
    
    const timeNome = dadosFutebol.teams[0].strTeam;
    const timeEstadio = dadosFutebol.teams[0].strStadium;
    const timeLocal = dadosFutebol.teams[0].strLocation;
    
    divResultado.innerHTML = `
      <div class="info-card" style="margin-bottom: 20px;">
        <h3 class="card-titulo">💵 Cotação Financeira (AwesomeAPI)</h3>
        <p class="info-detalhe"><strong>Moeda comercial:</strong> Dólar Americano para Real (USD/BRL)</p>
        <p class="info-detalhe"><strong>Valor atual de compra:</strong> R$ ${cotacaoDolar}</p>
      </div>
      
      <div class="info-card" style="margin-bottom: 20px;">
        <h3 class="card-titulo">🎮 Banco de Dados de Games (FreeToGame)</h3>
        <p class="info-detalhe"><strong>Título do Jogo:</strong> ${jogoTitulo}</p>
        <p class="info-detalhe"><strong>Gênero/Estilo:</strong> ${jogoGenero}</p>
        <p class="info-detalhe"><strong>Plataforma Suportada:</strong> ${jogoPlataforma}</p>
      </div>
      
      <div class="info-card">
        <h3 class="card-titulo">⚽ Estatísticas de Futebol (TheSportsDB)</h3>
        <p class="info-detalhe"><strong>Clube Consultado:</strong> ${timeNome}</p>
        <p class="info-detalhe"><strong>Estádio Oficial:</strong> ${timeEstadio}</p>
        <p class="info-detalhe"><strong>Localização/Cidade:</strong> ${timeLocal}</p>
      </div>
      
      <small class="sucesso-msg">✔ Todas as 3 APIs carregadas em paralelo com sucesso!</small>
    `;
    
  } catch (erro) {
    divResultado.innerHTML = `
      <div class="erro-container">
        <p class="erro-titulo">❌ Falha na carga paralela</p>
        <p class="erro-detalhe">${erro.message}</p>
      </div>
    `;
  }
};