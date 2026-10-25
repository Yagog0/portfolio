# Yago Maba | Portfólio

Portfólio pessoal em preto e prata, com abertura animada, caricatura em pixel art e uma estante de CDs com meus projetos. Construído com HTML, CSS e JavaScript, com todos os recursos visuais locais e sem etapa de compilação.

## Abrir

Abra `index.html` no navegador. Os caminhos relativos funcionam localmente e no GitHub Pages.

Para servir por HTTP, a partir desta pasta:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Acesse `http://127.0.0.1:8000`.

## Estante de projetos

Cada CD representa um repositório público. Ao passar o mouse ou focar pelo teclado, o estojo gira para mostrar a capa e os detalhes do projeto. Clicar abre o GitHub em outra aba.

O primeiro projeto já aparece com a capa aberta. Use as setas no topo da estante para percorrer a coleção. No celular, tocar em outro CD mostra a capa; um segundo toque na capa, ou o link **Abrir repositório**, abre o GitHub. A estante permite rolagem horizontal sem deslocar a página na vertical. As teclas de seta, Home e End percorrem os CDs, e Escape ou **Guardar CD** recolhem a seleção.

A estante reúne 11 projetos: Pokédex Web, Cardápio Digital, Chat WebSocket, Controle de Pedidos, API Imobiliária, Jogos em C++, PixelHub, Use by Cami, Heliby Studio, Estudos Web e Estudos em C++. Os links e descrições foram conferidos nos respectivos repositórios públicos de [Yagog0](https://github.com/Yagog0). O repositório Estudos Web inclui a apresentação original e o chat de estudo.

Para alterar um CD, edite o item `.cd-slot` em `index.html`: link, atributos `data-title`, `data-description`, `data-stack`, nome na lombada e imagem. As capas são SVGs locais em `imagens/projetos/`. O JavaScript calcula o total e a numeração automaticamente ao acrescentar ou remover projetos. Atualize os contadores iniciais no HTML para manter a alternativa sem JavaScript consistente.

## Outros recursos

- Abertura com nome metálico, botão de pular e repetição opcional. A apresentação automática aparece uma vez por sessão da aba.
- Caricatura em pixel art com fundo transparente, baseada na foto original, com enquadramento responsivo e sem animação contínua.
- Respeito à preferência de movimento reduzido, navegação com teclado e conteúdo principal disponível sem JavaScript.
- Apresentação pessoal, tecnologias, filmes e músicas em abas.
- E-mail, botão de copiar, WhatsApp e GitHub.

## Arquivos

| Caminho                          | Conteúdo                                                      |
| -------------------------------- | ------------------------------------------------------------- |
| `index.html`                     | Estrutura, informações, CDs e links                           |
| `styles.css`                     | Identidade visual, animações e responsividade                 |
| `shelf.css`                      | Estojos em 3D, lombadas, capas e estante                      |
| `script.js`                      | Abertura, estante, menu, abas e cópia do e-mail               |
| `imagens/yago-pixel-caricatura.png` | Caricatura usada na abertura                              |
| `portrait-points.js`             | Mapa da versão anterior, preservado e sem uso no site       |
| `imagens/projetos/`              | Onze capas de CD em SVG                                       |
| `imagens/`                       | Foto e imagens dos interesses pessoais                        |
| `Pagina Basica de apresentação/` | Apresentação original preservada, fora da navegação principal |

Para trocar a caricatura, atualize a imagem `.portrait-art` em `index.html`. O site não precisa consultar a API do GitHub nem carregar bibliotecas externas para funcionar. A referência e o prompt da arte estão em `docs/arte-pixel.md`.
