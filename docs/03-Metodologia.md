
# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

Descreva aqui a metodologia de trabalho do grupo para atacar o problema. Definições sobre os ambiente de trabalho utilizados pela  equipe para desenvolver o projeto. Abrange a relação de ambientes utilizados, a estrutura para gestão do código fonte, além da definição do processo e ferramenta através dos quais a equipe se organiza (Gestão de Times).

## Relação de Ambientes de Trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas. A tabela a seguir apresenta a relação dos ambientes utilizados no desenvolvimento do sistema, bem como suas respectivas plataformas e links de acesso.

| Ambiente | Plataforma | Link de Acesso |
|--------|-------------|---------------|
| Prototipação de Interface | Figma | https://www.figma.com/ |
| IDE de Desenvolvimento Back-end | Visual Studio 2022 | https://visualstudio.microsoft.com/ |
| IDE de Desenvolvimento Front-end e Mobile | Visual Studio Code | https://code.visualstudio.com/ |
| Framework Back-end | ASP.NET Core (.NET 10) | https://dotnet.microsoft.com/ |
| ORM (Mapeamento Objeto-Relacional) | Entity Framework Core | https://learn.microsoft.com/ef/core/ |
|  Banco de Dados NoSQL | MongoDB | https://www.mongodb.com/ |
| Framework Front-end Web | React | https://react.dev |
| Ferramenta de Build Front-end | Vite | https://vitejs.dev/ |
| Framework Mobile | React Native | https://reactnative.dev/ |
| Ambiente de Testes Mobile | Android Studio | https://developer.android.com/studio |
| Containerização | Docker | https://www.docker.com/ |
| Controle de Versão | Git | https://git-scm.com/ |
| Repositório Remoto | GitHub | https://github.com/ |
| Testes de API | Postman | https://www.postman.com/ |


## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

## Gerenciamento de Projeto

### Divisão de Papéis

A equipe utiliza metodologias ágeis, tendo escolhido o Scrum como base para definição do processo de desenvolvimento. A metodologia Scrum permite que o desenvolvimento seja organizado em ciclos curtos de trabalho (Sprints), facilitando o acompanhamento do progresso do projeto e a colaboração entre os membros da equipe.

A equipe está organizada da seguinte maneira:

Scrum Master:
- Rafael Henrique dos Santos Silva
  
Product Owner:

- Vitor Bisi Vieira
  
Equipe de Desenvolvimento:

- Marcos Eduardo Fortunato – Desenvolvedor Backend
- Rayssa Eduarda Guilherme Viana – Desenvolvedor Frontend
- Isaque Albertini Silva Oliveira – Desenvolvedor Backend
- Guilherme Henrique Cardoso Souza – Desenvolvedor Frontend

Essa divisão permite que as responsabilidades sejam distribuídas de forma equilibrada entre os membros da equipe. O Scrum Master é responsável por acompanhar o andamento do projeto e garantir que a metodologia seja aplicada corretamente, enquanto o Product Owner define as prioridades das funcionalidades do sistema. A equipe de desenvolvimento é responsável pela implementação técnica da aplicação.

## Processo

O processo de desenvolvimento do projeto foi baseado no framework Scrum, utilizando ciclos de desenvolvimento chamados Sprints.

Cada Sprint possui duração média de uma semana, durante a qual a equipe desenvolve um conjunto de funcionalidades previamente definidas no backlog do projeto.

O processo de desenvolvimento segue as seguintes etapas:

### Planejamento da Sprint

Durante o planejamento da Sprint são definidas as tarefas que serão realizadas pela equipe naquele ciclo de desenvolvimento.

### Desenvolvimento

Os membros da equipe trabalham nas tarefas atribuídas, realizando commits frequentes no repositório do projeto.

### Acompanhamento das Tarefas

O progresso das tarefas é acompanhado através do GitHub Projects, que organiza as atividades em colunas como:

-  To Do

-  In Progress

- Review

- Done

### Revisão da Sprint

Ao final de cada Sprint, a equipe realiza uma revisão para avaliar as funcionalidades implementadas e verificar se atendem aos requisitos definidos.

### Retrospectiva

Também é realizada uma retrospectiva para identificar pontos de melhoria no processo de desenvolvimento.

# Ferramentas

As ferramentas empregadas no desenvolvimento do projeto foram selecionadas com base na **eficiência no desenvolvimento, facilidade de integração entre tecnologias e suporte ao trabalho colaborativo da equipe**. Essas ferramentas auxiliam tanto na implementação da aplicação quanto na organização e comunicação do grupo durante o projeto.

---

## Ambiente de Desenvolvimento

Para o desenvolvimento da aplicação foram utilizadas duas IDEs principais:

### Visual Studio 2022

O **Visual Studio 2022** foi utilizado como ambiente principal para o desenvolvimento do **back-end da aplicação**, utilizando o framework **ASP.NET Core com a linguagem C#**.  

A ferramenta foi escolhida por oferecer suporte completo ao desenvolvimento em .NET, integração com banco de dados, depuração avançada e integração com sistemas de versionamento.

### Visual Studio Code

O **Visual Studio Code** foi utilizado para o desenvolvimento **front-end e mobile**, por ser um editor leve, altamente extensível e possuir suporte a diversas linguagens e frameworks utilizados no projeto, como **React e React Native**.

---

## Desenvolvimento Back-end

O desenvolvimento do back-end da aplicação foi realizado utilizando **ASP.NET Core (.NET)**, um framework moderno e multiplataforma que permite a construção de APIs robustas e escaláveis.

Para realizar o mapeamento entre objetos da aplicação e o banco de dados foi utilizado o **Entity Framework Core**, um ORM (Object-Relational Mapping) que facilita a manipulação de dados e reduz a necessidade de escrita de consultas SQL complexas.

O sistema também utiliza o **MongoDB** como banco de dados **NoSQL**, permitindo maior flexibilidade na estrutura de armazenamento de dados e melhor adaptação a aplicações distribuídas.

---

## Desenvolvimento Front-end

A interface web da aplicação foi desenvolvida utilizando o **React**, uma biblioteca JavaScript amplamente utilizada para construção de interfaces modernas e dinâmicas.

Para otimizar o processo de desenvolvimento e build da aplicação front-end foi utilizado o **Vite**, uma ferramenta que oferece inicialização rápida do ambiente de desenvolvimento e melhor desempenho durante o processo de compilação.

---

## Desenvolvimento Mobile

Para o desenvolvimento da aplicação mobile foi utilizado o **React Native**, framework que permite criar aplicações móveis multiplataforma utilizando JavaScript e React.

Para testes e execução da aplicação mobile foi utilizado o **Android Studio**, que fornece emuladores e ferramentas necessárias para o desenvolvimento e testes em dispositivos Android.

---

## Containerização

Para facilitar a execução da aplicação em diferentes ambientes foi utilizado o **Docker**, permitindo empacotar a aplicação e suas dependências em containers.

Essa abordagem contribui para maior consistência entre ambientes de desenvolvimento e produção.

---

## Controle de Versão

O controle de versão do projeto foi realizado utilizando o **Git**, enquanto o **GitHub** foi utilizado para hospedagem do repositório remoto e colaboração entre os membros da equipe.

O GitHub também foi utilizado para o gerenciamento das tarefas do projeto por meio do **GitHub Projects**, permitindo organizar as atividades da equipe e acompanhar o progresso do desenvolvimento.

---

## Comunicação da Equipe

A comunicação entre os membros da equipe foi realizada por meio do **Microsoft Teams**, permitindo troca de mensagens, reuniões online e compartilhamento de arquivos, facilitando a colaboração durante o desenvolvimento do projeto.

---

## Testes de API

Para testes das rotas e funcionalidades da API desenvolvida foi utilizado o **Postman**, ferramenta que permite realizar requisições HTTP, testar endpoints e validar respostas do servidor durante o processo de desenvolvimento.
