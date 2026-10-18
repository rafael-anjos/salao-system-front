# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Paula e a equipe do Eula Moraes Studio usam o sistema no balcão, durante o expediente, para agenda, clientes, caixa, estoque e o controle financeiro do salão.

## Product Purpose

Operar o dia do estúdio: agendar, atender, vender, controlar estoque e enxergar entradas, saídas, contas e lucro. Sucesso é fechar o período sabendo o que entrou, o que saiu e o que ainda está para pagar.

## Positioning

Um sistema de salão em que agenda, caixa, estoque e financeiro compartilham o mesmo estado da sessão, sem API.

## Operating Context

Uso no navegador, ao lado do atendimento. Vendas nascem no caixa. Contas fixas, parceladas, avulsas e sangrias nascem no financeiro. Os dados duram enquanto a aplicação está aberta.

## Capabilities and Constraints

- Telas: início, agenda, clientes, caixa, financeiro, estoque, relatórios, serviços, profissionais e configurações.
- Formas de pagamento: Pix, dinheiro, cartão de débito e cartão de crédito.
- Conta fixa se repete todo mês até ser encerrada. Parcelada dura o número de meses informado. Avulsa sai da lista depois de paga.
- Sangria é saída sem categoria de produto. Toda saída reduz o lucro líquido. Conta pendente só reduz o lucro quando é marcada como paga.
- Contas vencidas aparecem com alerta.

## Brand Commitments

Nome do salão: Eula Moraes Studio. A interface permanece no visual já usado nas outras telas: fundo claro, verde #1C3112, Montserrat, abas e painéis simples.

## Evidence on Hand

Cadastros, agenda e movimentos de demonstração vivem em `src/app/core/salao-estado.service.ts`. Não há depoimentos, preços de mercado nem API para inventar.

## Product Principles

- O número na tela tem de ser o mesmo número do caixa e das contas.
- A tarefa aparece antes do enfeite.
- O mês financeiro avisa o que venceu antes de comemorar o lucro.
- Cada saída, inclusive sangria e conta paga, reduz o lucro.
- A linguagem é a do salão, em português.
