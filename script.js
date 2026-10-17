
const produtos = [
    {
        id: 1,
        nome: "Maromba Tradicional",
        descricao: "Açaí cremoso, banana e granola crocante.",
        preco: 12.90,
        tamanho: "300 ml",
        categoria: "tradicional",
        emoji: "🍇"
    },
    {
        id: 2,
        nome: "Maromba Power",
        descricao: "Açaí, banana, leite em pó e granola.",
        preco: 17.90,
        tamanho: "500 ml",
        categoria: "tradicional",
        emoji: "🍨"
    },
    {
        id: 3,
        nome: "Maromba Supremo",
        descricao: "Açaí, creme de avelã, morango e leite em pó.",
        preco: 24.90,
        tamanho: "700 ml",
        categoria: "especial",
        emoji: "🍓"
    },
    {
        id: 4,
        nome: "Maromba Chocolate",
        descricao: "Açaí, creme de chocolate e gotas crocantes.",
        preco: 21.90,
        tamanho: "500 ml",
        categoria: "especial",
        emoji: "🍫"
    },
    {
        id: 5,
        nome: "Maromba Tropical",
        descricao: "Açaí, manga, banana, morango e granola.",
        preco: 19.90,
        tamanho: "500 ml",
        categoria: "especial",
        emoji: "🥭"
    },
    {
        id: 6,
        nome: "Marombinha",
        descricao: "Açaí, banana e confeitos coloridos.",
        preco: 9.90,
        tamanho: "200 ml",
        categoria: "tradicional",
        emoji: "🍌"
    },
    {
        id: 7,
        nome: "Suco Maromba",
        descricao: "Bebida gelada de açaí para refrescar o dia.",
        preco: 9.90,
        tamanho: "400 ml",
        categoria: "bebida",
        emoji: "🥤"
    },
    {
        id: 8,
        nome: "Milkshake Maromba",
        descricao: "Milkshake cremoso com sabor de açaí.",
        preco: 15.90,
        tamanho: "400 ml",
        categoria: "bebida",
        emoji: "🧋"
    }
];

const combo = {
    id: 9,
    nome: "Combo Maromba em Dobro",
    descricao: "Dois açaís tradicionais de 300 ml.",
    preco: 24.90,
    tamanho: "2 x 300 ml",
    categoria: "especial",
    emoji: "🍨"
};

let carrinho = [];
let temporizadorNotificacao;

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderizarProdutos(categoria = "todos") {
    const lista = document.getElementById("listaProdutos");

    const filtrados = categoria === "todos"
        ? produtos
        : produtos.filter(produto => produto.categoria === categoria);

    lista.innerHTML = filtrados.map(produto => `
        <article class="produto">
            <div class="produto-imagem">
                <span class="produto-emoji">${produto.emoji}</span>
            </div>

            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>

                <div class="produto-rodape">
                    <div>
                        <div class="produto-preco">${formatarPreco(produto.preco)}</div>
                        <span class="produto-tamanho">${produto.tamanho}</span>
                    </div>

                    <button
                        class="botao-adicionar"
                        onclick="adicionarCarrinho(${produto.id})"
                        aria-label="Adicionar ${produto.nome} ao carrinho">
                        +
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function filtrarProdutos(categoria, botao) {
    document.querySelectorAll(".filtro").forEach(filtro => {
        filtro.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    renderizarProdutos(categoria);
}

function adicionarCarrinho(id, quantidade = 1) {
    const produto = [...produtos, combo].find(item => item.id === id);

    if (!produto) return;

    const item = carrinho.find(item => item.id === id);

    if (item) {
        item.quantidade += quantidade;
    } else {
        carrinho.push({
            ...produto,
            quantidade
        });
    }

    atualizarCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

function adicionarCombo() {
    adicionarCarrinho(combo.id);
}

function alterarQuantidade(id, variacao) {
    const item = carrinho.find(item => item.id === id);

    if (!item) return;

    item.quantidade += variacao;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(item => item.id !== id);
    }

    atualizarCarrinho();
}

function removerItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
    mostrarNotificacao("Produto removido do carrinho.");
}

function calcularTotal() {
    return carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
    );
}

function atualizarCarrinho() {
    const contador = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    document.getElementById("contador").textContent = contador;

    const lista = document.getElementById("itensCarrinho");

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <div style="font-size: 45px; margin-bottom: 12px;">🛒</div>
                Seu carrinho está vazio.<br>
                Escolha seu açaí favorito e venha para o time Maromba!
            </div>
        `;
    } else {
        lista.innerHTML = carrinho.map(item => `
            <div class="item-carrinho">
                <span class="item-emoji">${item.emoji}</span>

                <div class="item-detalhes">
                    <h4>${item.nome}</h4>
                    <p>${formatarPreco(item.preco * item.quantidade)}</p>
                </div>

                <div class="quantidade">
                    <button
                        onclick="alterarQuantidade(${item.id}, -1)"
                        aria-label="Diminuir quantidade">−</button>
                    <span>${item.quantidade}</span>
                    <button
                        onclick="alterarQuantidade(${item.id}, 1)"
                        aria-label="Aumentar quantidade">+</button>
                </div>

                <button
                    class="botao-remover"
                    onclick="removerItem(${item.id})"
                    aria-label="Remover ${item.nome}">×</button>
            </div>
        `).join("");
    }

    const total = calcularTotal();

    document.getElementById("subtotal").textContent = formatarPreco(total);
    document.getElementById("total").textContent = formatarPreco(total);
}

function abrirCarrinho() {
    document.getElementById("fundoModal").classList.add("aberto");
    document.body.classList.add("modal-aberto");
}

function fecharCarrinho() {
    document.getElementById("fundoModal").classList.remove("aberto");
    document.body.classList.remove("modal-aberto");
}

function fecharCarrinhoFora(evento) {
    if (evento.target.id === "fundoModal") {
        fecharCarrinho();
    }
}

function mostrarNotificacao(mensagem) {
    const notificacao = document.getElementById("notificacao");

    notificacao.textContent = mensagem;
    notificacao.classList.add("visivel");

    clearTimeout(temporizadorNotificacao);

    temporizadorNotificacao = setTimeout(() => {
        notificacao.classList.remove("visivel");
    }, 2500);
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao("Adicione algum produto antes de finalizar.");
        return;
    }

    const resumo = carrinho.map(item =>
        `${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco * item.quantidade)}`
    ).join("\n");

    const total = calcularTotal();

    const confirmar = window.confirm(
        "CONFIRMAR PEDIDO — AÇAÍ MAROMBA\n\n" +
        resumo +
        "\n\nTOTAL: " + formatarPreco(total) +
        "\n\nEsta é uma compra demonstrativa. Nenhum pagamento ou entrega real será realizado.\n\nDeseja simular a confirmação?"
    );

    if (!confirmar) return;

    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();

    window.alert(
        "💪 PEDIDO SIMULADO COM SUCESSO!\n\n" +
        "Valeu por escolher a Açaí Maromba!\n\n" +
        "Seu pedido foi demonstrado no site. Nenhum pagamento foi processado."
    );
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        fecharCarrinho();
    }
});

renderizarProdutos();
atualizarCarrinho();
