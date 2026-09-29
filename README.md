# GerenteMax Protótipo v7

Protótipo React + Vite baseado em shadcn/ui, com tema claro/escuro e identidade visual azul.

## Alterações da v7 — Grupo de Contas

- Título da página reduzido aproximadamente à metade do tamanho anterior.
- Filtro de status inicia em **Ativos**.
- A coluna **Status** só aparece quando o filtro estiver em **Todos**.
- Status **Ativo** usa verde e **Desativado** usa vermelho.
- Coluna Status reposicionada depois de **Observação**.
- Botões da barra: **Filtros → Impressão → Adicionar**.
- O botão Impressão aciona a impressão do navegador e esconde navegação/controles na mídia impressa.
- Textos descritivos da tabela sem negrito.
- Código do registro no padrão `000` (`001`, `002`, ...).
- Cabeçalhos de dados são clicáveis e ordenam ascendente/descendente, com seta indicando o estado.
- Mantida a responsividade e o dark/light mode.

## Executar

```bash
npm install
npm run dev
```


## Ajustes v7
- Título e descrição de Grupo de Contas movidos para o header.
- Busca global reduzida ao ícone de lupa no lado direito do header.
- Cores dos ícones dos grupos passam a ser definidas por registro, simulando a cor escolhida no cadastro.
- Cores dos 10 primeiros mocks baseadas exclusivamente na referência enviada; demais mocks usam cores complementares fixas.
- Coluna Contas centralizada horizontalmente.


## v8 — Contas Financeiras
- Nova listagem de Contas Financeiras seguindo o mesmo padrão visual de Grupo de Contas.
- Colunas: código, descrição/banco, grupo, tipo, empresa, saldo inicial, status condicional e ações.
- Saldo positivo em azul, zerado em cinza e negativo em vermelho.
- Status padrão Ativo; coluna Status aparece somente no filtro Todos.
- Filtros laterais, impressão, ordenação por coluna, responsividade e dark mode mantidos.
