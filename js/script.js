// Lista de produtos e preços demonstrativos da Mila.
const produtos = [
  { id: 1, nome: "Camiseta masculina", categoria: "Masculino", preco: 79.90, imagem: "img/camiseta-masculina.jpg" },
  { id: 2, nome: "Moletom masculino", categoria: "Masculino", preco: 129.90, imagem: "img/moletom-masculino.jpg" },
  { id: 3, nome: "Calça jeans masculina", categoria: "Masculino", preco: 149.90, imagem: "img/calca-jeans-masculina.jpg" },
  { id: 4, nome: "Bermuda esportiva", categoria: "Masculino", preco: 89.90, imagem: "img/bermuda-esportiva.jpg" },
  { id: 5, nome: "Polo masculina", categoria: "Masculino", preco: 99.90, imagem: "img/polo-masculina.jpg" },
  { id: 6, nome: "Blusa feminina", categoria: "Feminino", preco: 69.90, imagem: "img/blusa-feminina.jpg" },
  { id: 7, nome: "Calça jeans feminina", categoria: "Feminino", preco: 139.90, imagem: "img/calca-jeans-feminina.jpg" },
  { id: 8, nome: "Vestido casual", categoria: "Feminino", preco: 129.90, imagem: "img/vestido-casual.jpg" },
  { id: 9, nome: "Suéter feminino", categoria: "Feminino", preco: 119.90, imagem: "img/sueter-feminino.jpg" },
  { id: 10, nome: "Cropped feminino", categoria: "Feminino", preco: 79.90, imagem: "img/cropped-feminino.jpg" },
  { id: 11, nome: "Camiseta infantil", categoria: "Infantil", preco: 59.90, imagem: "img/camiseta-infantil.jpg" },
  { id: 12, nome: "Vestido infantil", categoria: "Infantil", preco: 89.90, imagem: "img/vestido-infantil.jpg" },
  { id: 13, nome: "Conjunto infantil", categoria: "Infantil", preco: 119.90, imagem: "img/conjunto-infantil.jpg" },
  { id: 14, nome: "Moletom infantil", categoria: "Infantil", preco: 99.90, imagem: "img/moletom-infantil.jpg" },
  { id: 15, nome: "Jardineira infantil", categoria: "Infantil", preco: 109.90, imagem: "img/jardineira-infantil.jpg" }
];

// Carrinho: guarda o código do produto e a quantidade escolhida.
let carrinho = [];

// Mostra os produtos da categoria escolhida.
function mostrarProdutos(categoria) {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";

  for (let produto of produtos) {
    if (produto.categoria === categoria) {
      lista.innerHTML += `
        <div class="produto">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p class="preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
          <button onclick="adicionarCarrinho(${produto.id})">Adicionar</button>
        </div>`;
    }
  }
}

// Adiciona um produto ao carrinho ou aumenta sua quantidade.
function adicionarCarrinho(id) {
  let item = carrinho.find(produto => produto.id === id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id: id, quantidade: 1 });
  }

  atualizarCarrinho();
}

// Atualiza a lista e calcula o total da compra.
function atualizarCarrinho() {
  const area = document.getElementById("itens-carrinho");
  let total = 0;
  let quantidadeTotal = 0;
  area.innerHTML = "";

  for (let item of carrinho) {
    let produto = produtos.find(p => p.id === item.id);
    let subtotal = produto.preco * item.quantidade;
    total += subtotal;
    quantidadeTotal += item.quantidade;

    area.innerHTML += `
      <div class="item-carrinho">
        <strong>${produto.nome}</strong><br>
        ${item.quantidade} unidade(s) — R$ ${subtotal.toFixed(2).replace(".", ",")}
        <br>
        <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
        <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
        <button onclick="removerProduto(${item.id})">Remover</button>
      </div>`;
  }

  document.getElementById("valor-total").textContent =
    "R$ " + total.toFixed(2).replace(".", ",");
  document.getElementById("quantidade-carrinho").textContent = quantidadeTotal;
  document.getElementById("finalizar").disabled = carrinho.length === 0;
}

// Altera a quantidade de um produto.
function alterarQuantidade(id, valor) {
  let item = carrinho.find(produto => produto.id === id);
  if (item) {
    item.quantidade += valor;
    if (item.quantidade <= 0) {
      removerProduto(id);
    } else if (item.quantidade > 20) {
      item.quantidade = 20;
      document.getElementById("mensagem").textContent = "Limite de 20 unidades por produto.";
    } else {
      atualizarCarrinho();
    }
  }
}

// Remove um produto do carrinho.
function removerProduto(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}

// Eventos dos filtros.
document.querySelectorAll(".filtro").forEach(function(botao) {
  botao.addEventListener("click", function() {
    document.querySelectorAll(".filtro").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    mostrarProdutos(botao.dataset.categoria);
  });
});

// Botões do carrinho.
document.getElementById("abrir-carrinho").addEventListener("click", function() {
  document.getElementById("carrinho").classList.remove("escondido");
});
document.getElementById("fechar-carrinho").addEventListener("click", function() {
  document.getElementById("carrinho").classList.add("escondido");
});

// Confere o carrinho e prepara a mensagem para o WhatsApp.
document.getElementById("finalizar").addEventListener("click", function() {
  try {
    if (carrinho.length === 0) {
      throw new Error("Adicione pelo menos um produto ao carrinho.");
    }

    let mensagem = "Olá! Gostaria de consultar estes produtos:\\n";
    let total = 0;

    for (let item of carrinho) {
      let produto = produtos.find(p => p.id === item.id);
      if (!produto || item.quantidade < 1 || item.quantidade > 20) {
        throw new Error("Confira os produtos e as quantidades.");
      }
      total += produto.preco * item.quantidade;
      mensagem += `- ${produto.nome}: ${item.quantidade} unidade(s)\\n`;
    }

    if (!Number.isFinite(total) || total <= 0) {
      throw new Error("Não foi possível calcular o total.");
    }

    mensagem += "Total demonstrativo: R$ " + total.toFixed(2).replace(".", ",");
    const numero = "5547934371198";
    window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem), "_blank");
  } catch (erro) {
    document.getElementById("mensagem").textContent = erro.message;
  }
});

// Ao abrir a página, mostra a primeira categoria.
mostrarProdutos("Masculino");
