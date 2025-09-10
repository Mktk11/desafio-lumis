const listaPokemons = document.getElementById("listaPokemons");
const buscaInput = document.getElementById("pokemonBusca");
const anteriorBtn = document.getElementById("anterior");
const proximoBtn = document.getElementById("proximo");
const botoesPagina = document.querySelectorAll(".paginacao__numeros");


let paginaAtual = 1;
const quantidadePorPagina = 18;
const totalPokemons = 1010; // Ajuste conforme a quantidade de Pokémon na API

const fetchPokemon = async (id) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
};

const criarCard = (pokemon) => {
  const tipos = pokemon.types
    .map(t => `<span class="tipo ${t.type.name}">${t.type.name}</span>`)
    .join(" ");

  return `
    <div class="card">
      <p>${tipos}<strong>#${pokemon.id.toString().padStart(3, "0")}</strong></p>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
      <h3 class="nome">${pokemon.name}</h3>
    </div>
  `;
};

const carregarPokemons = async (pagina = 1) => {
  listaPokemons.innerHTML = "";
  const inicio = (pagina - 1) * quantidadePorPagina + 1;
  const fim = Math.min(inicio + quantidadePorPagina - 1, totalPokemons);

  for (let i = inicio; i <= fim; i++) {
    const pokemon = await fetchPokemon(i);
    listaPokemons.innerHTML += criarCard(pokemon);
  }
};

// Atualizar botão ativo da paginação
const atualizarBotoes = () => {
  botoesPagina.forEach(btn => btn.classList.remove("active"));
  const botaoAtivo = Array.from(botoesPagina).find(btn => parseInt(btn.dataset.page) === paginaAtual);
  if (botaoAtivo) botaoAtivo.classList.add("active");
};

// Eventos da paginação
botoesPagina.forEach(btn => {
  btn.addEventListener("click", () => {
    paginaAtual = parseInt(btn.dataset.page);
    // Remove cor de todos os botões
    botoesPagina.forEach(b => b.style.backgroundColor = '');
    // Define cor apenas no botão clicado
    btn.style.backgroundColor = 'gray';
    carregarPokemons(paginaAtual);
    atualizarBotoes();
  });
});

//decrementa paginaAtual e carrega a página anterior.
anteriorBtn.addEventListener("click", () => {
  if(paginaAtual == 1){
    anteriorBtn.disabled = true;
  }
  else{
    paginaAtual--;
    anteriorBtn.disabled = false;
    carregarPokemons(paginaAtual);
    atualizarBotoes();
  }
});

//Ao clicar no próximo vai para a próxima página com condiçao
proximoBtn.addEventListener("click", () => {
  if (paginaAtual < Math.ceil(totalPokemons / quantidadePorPagina)) {
    paginaAtual++;
    carregarPokemons(paginaAtual);
    atualizarBotoes();
  }
});

// Busca de pokemon pelo nome
buscaInput.addEventListener("input", async () => {
  const nome = buscaInput.value.toLowerCase().trim();
  if (!nome) {
    carregarPokemons(paginaAtual);
    return;
  }
  try {
    const pokemon = await fetchPokemon(nome);
    listaPokemons.innerHTML = criarCard(pokemon);
  } catch {
    listaPokemons.innerHTML = `<div id="mensagemerro"><p>Pokémon não encontrado</p></div>`;
  }
});

// Inicialização
carregarPokemons(paginaAtual);
atualizarBotoes();
