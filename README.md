[README (1).md](https://github.com/user-attachments/files/29072479/README.1.md)
# MURAL_TÓXICO 🧪

Link: https://samuelarthuralmeidadejesus.github.io/mural-toxico/

Um mural de recados estático, com visual hacker/cybersecurity, criado como
**laboratório educacional de Stored XSS** (Cross-Site Scripting persistido).

O projeto roda 100% no navegador — sem servidor, sem backend, sem
frameworks e sem bibliotecas externas. Tudo é HTML, CSS e JavaScript puro,
e os recados ficam salvos no `localStorage` do próprio navegador de quem
estiver usando a página.

> ⚠️ **Apenas para fins educacionais.** O objetivo é mostrar, na prática,
> a diferença entre exibir conteúdo de usuário com `innerHTML` (inseguro)
> e com `textContent` (seguro). Não publique dados reais e não use estas
> técnicas fora de ambientes onde você tem autorização para testar.

---

## O que é o mural

O mural é uma página única onde qualquer pessoa pode escrever um recado
em uma caixa de texto e publicá-lo. Os recados publicados aparecem como
cartões no estilo "janela de terminal", com um número de identificação e
a data/hora da publicação.

A particularidade do projeto é que ele possui **dois modos de exibição**,
alternáveis por um botão:

- **Modo Seguro** (`textContent`) — o texto do recado é tratado como
  texto puro. Qualquer HTML ou script digitado aparece literalmente na
  tela, sem ser executado. É o jeito correto de exibir conteúdo de
  usuário.
- **Modo Vulnerável** (`innerHTML`) — o texto do recado é interpretado
  como HTML. Se alguém publicar algo como
  `<img src=x onerror="alert('XSS')">`, o navegador vai tentar carregar a
  imagem, falhar e executar o JavaScript do `onerror`, demonstrando um
  Stored XSS clássico.

Como os recados ficam guardados no `localStorage`, ao alternar entre os
dois modos os **mesmos recados já publicados** são renderizados de novo,
sob a regra do modo atual — isso deixa bem visível o efeito de cada
abordagem sobre o mesmo conteúdo.

---

## Estrutura dos arquivos

### `index.html`
Estrutura da página. Contém:
- O cabeçalho com a "barra de terminal" decorativa e o título com efeito
  de glitch.
- O aviso de uso educacional, em destaque vermelho.
- O painel de modo, que mostra qual modo está ativo e o botão para
  alternar entre eles.
- O formulário de publicação (textarea + botões "Publicar" e "Limpar
  tudo").
- O contêiner vazio (`#mural`) onde os cartões de recado são inseridos
  dinamicamente pelo `script.js`.

Não há lógica nem estilo embutido no HTML — ele só define a estrutura e
referencia os outros dois arquivos.

### `style.css`
Toda a aparência visual do site, organizada por seções comentadas:
- **Tokens** (`:root`): paleta de cores (fundo escuro, verde neon,
  vermelho de alerta), fonte monoespaçada e variáveis reaproveitadas em
  todo o CSS.
- **Scanlines**: uma sobreposição sutil que simula um monitor antigo de
  terminal.
- **Header**: estilo da barra de terminal, do título com glitch e do
  cursor piscante.
- **Painel de modo**: estilo do badge que muda de verde (seguro) para
  vermelho pulsante (vulnerável) conforme o modo ativo.
- **Botões, formulário e cartões do mural**: estilos dos componentes
  interativos.
- **Responsividade**: ajustes para telas pequenas e respeito à
  preferência `prefers-reduced-motion` (desliga animações para quem
  configurou isso no sistema).

### `script.js`
Toda a lógica do site, sem dependências externas. Principais
responsabilidades:
- **Persistência**: funções `getRecados` / `saveRecados` (lista de
  recados) e `getModo` / `setModo` (modo ativo), todas usando
  `localStorage`.
- **Renderização** (`renderizarMural`): lê os recados salvos e monta um
  cartão para cada um. É aqui que está o ponto central da demonstração —
  dependendo do modo ativo, o conteúdo do recado é inserido com
  `body.innerHTML = recado.texto` (vulnerável) ou
  `body.textContent = recado.texto` (seguro).
- **Ações do usuário**: `publicarRecado` (valida e salva um novo
  recado), `limparRecados` (apaga tudo, com confirmação) e
  `alternarModo` (troca o modo salvo e re-renderiza o mural).
- **Inicialização**: ao carregar a página, o badge de modo e a lista de
  recados já salvos são exibidos imediatamente.

---

Para testar a demonstração de XSS localmente: publique um recado normal
no modo seguro, depois alterne para o modo vulnerável e publique algo
como `<img src=x onerror="alert('XSS')">` para observar a diferença.
