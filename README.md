# 02-node-ignite-challenger

# REQUISITOS FUNCIONAIS
- [x] Deve ser possível criar um usuário
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    - [x] Nome
    - [x] Descrição
    - [x] Data e Hora
    - [x] Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - [x] Quantidade total de refeições registradas
    - [x] Quantidade total de refeições dentro da dieta
    - [x] Quantidade total de refeições fora da dieta
    - [x] Melhor sequência de refeições dentro da dieta

# REGRAS DE NEGÓCIOS
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível visualizar uma refeição a partir do id da refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Uma nova refeição deve ser relacionadas a um usuário.
- [x] A refeição poder estar ou não dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

# Routes tests
- [x] POST - Create snack
- [x] PUT - Update snack
- [x] GET - List snacks
- [x] GET - Get metrics
- [x] GET - View snack with id
- [x] DEL - Delete snack

