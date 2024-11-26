# Back-End Residência

Este é um projeto de API desenvolvida para fornecer análises detalhadas de currículos enviados em formato PDF. A aplicação utiliza **Node.js**, **MongoDB**, **Swagger**, e integra-se com modelos de linguagem (LLM) para gerar sugestões baseadas no conteúdo dos currículos.

## Funcionalidades

- Upload de arquivos PDF para análise.
- Geração de sugestões detalhadas baseadas no conteúdo dos currículos.
- Persistência das análises em um banco de dados MongoDB.
- Endpoints para listar, buscar, atualizar e deletar análises.
- Documentação interativa da API utilizando Swagger.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento back-end.
- **Express**: Framework para criação de rotas e middleware.
- **MongoDB**: Banco de dados NoSQL para armazenar as análises.
- **Mongoose**: ODM para interação com o MongoDB.
- **Multer**: Middleware para upload de arquivos.
- **Swagger**: Para documentação interativa da API.
- **Axios**: Para integração com APIs externas.

## Configuração do Projeto

### Pré-requisitos

- Node.js instalado
- MongoDB configurado
- Chave de API do OpenAI para uso dos modelos de linguagem

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/IvsonSantana/Back-end-PI-Web.git

2. Acesse o diretório do projeto:
    cd Back-end-PI-Web

3. Instale as dependências:
    npm install

4. Configure as variáveis de ambiente criando um arquivo .env com os seguintes campos:
    MONGO_URI=<sua-string-de-conexão-mongodb>
    OPENAI_API_KEY=<sua-chave-da-api-openai>
    PORT=<porta-desejada-ou-3000>

5. Inicie o servidor:
    node app.js

6. Acesse a documentação da API em:
    https://projetoresidenciallm.onrender.com/api/doc-api-residencia

## Colaboradores

Agradecimentos a todos que contribuíram para este projeto:

- [Ivson Santana](https://github.com/IvsonSantana) - Desenvolvedor BackEnd
- [Edson Nasciemento](https://github.com/Edson-N-Silva) - Desenvolvedor FullStack
- [Ruan Ribeiro] - Designer
- [João Guilherme](https://github.com/JotaaLm) - Product Owner
- [Gian Lira](https://github.com/GVlira) - Product Owner
- [Diego Silva]

Se você deseja contribuir, sinta-se à vontade para fazer um pull request ou abrir uma issue!