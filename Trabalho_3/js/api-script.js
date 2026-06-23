document.getElementById('apiForm').onsubmit = async (e) => {
  e.preventDefault();
  
  const valorBusca = document.getElementById('buscaInput').value.trim().toLowerCase();
  const divResultado = document.getElementById('resultado');
  
  divResultado.innerHTML = '<p class="loading">⏳ Conectando à API externa e buscando dados...</p>';
  
  try {    
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${valorBusca}`);
    
    if (!resposta.ok) {
      throw new Error('Pokémon não encontrado. Verifique se o nome está correto!');
    }
    
    
    const dados = await resposta.json();    
    
    const tipos = dados.types.map(t => t.type.name).join(', ');
    
    divResultado.innerHTML = `
      <div class="pokemon-card">
        <h3 class="pokemon-titulo">${dados.name} (Nº ${dados.id})</h3>
        <img src="${dados.sprites.front_default || ''}" alt="Imagem do ${dados.name}" class="pokemon-img">
        <p class="pokemon-info"><strong>Tipos:</strong> ${tipos}</p>
        <p class="pokemon-info"><strong>Altura:</strong> ${(dados.height / 10)} m</p>
        <p class="pokemon-info"><strong>Peso:</strong> ${(dados.weight / 10)} kg</p>
        <small class="sucesso-msg">✔ Dados recebidos com sucesso a partir da API pública.</small>
      </div>
    `;
    
  } catch (erro) {
    
    divResultado.innerHTML = `
      <div class="erro-container">
        <p class="erro-titulo">❌ Erro na consulta</p>
        <p class="erro-detalhe">${erro.message}</p>
      </div>
    `;
  }
};