# Especificações do Projeto

## Personas

| Dra. Patrícia Lima | <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/3c7f7bf7-f384-4910-8865-1eeb5f25f385" /> |
|-----------------------|-|
| Idade: | 38 |
| Ocupação: | Psicóloga Clínica |
| Motivações | Analisar os registros de humor em tempo real para planejar intervenções mais assertivas durante as sessões presenciais |
| Frustrações | Quando o paciente não consegue descrever o que sentiu em momentos de crise por falta de um registro feito na hora do evento |
| Hobbies | Fotografia de natureza |

| Dr. Arnaldo Peixoto | <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/3ccb895c-50b5-4e64-81af-09412db44aca" /> |
|-----------------------|-|
| Idade: | 48 |
| Ocupação: | Psicólogo Clínico |
| Motivações | Analisar os diários dos pacientes entre as sessões para preparar intervenções mais precisas, inserir observações que ajudem o paciente a refletir sobre seus gatilhos |
| Frustrações | Chegar na sessão e o paciente não lembrar de detalhes importantes da semana, falta de ferramentas para registrar análises pontuais sobre relatos específicos |
| Hobbies | Tocar violão, leitura de filosofia e vinhos |

| Tiago Alves | <img width="200" height="200" alt="tiago" src="https://github.com/user-attachments/assets/7aaf7ebe-4e65-49cf-b61b-6079ee6bf05b" />  |
|-----------------------|-|
| Idade: | 29 |
| Ocupação: | Analista de Sistemas |
| Motivações | Registrar seus pensamentos de forma técnica e objetiva, receber validação profissional sobre seus padrões de comportamento através das observações do psicólogo |
| Frustrações | Sente que escreve muito no diário mas não tem certeza se o conteúdo está sendo lido, dificuldade em notar sua própria evolução sem um feedback externo |
| Hobbies | Games, café especial e musculação |

| Sofia Mendes | <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/c3b59cb9-c946-4f81-9db2-8624c1ad67ce" />  |
|-----------------------|-|
| Idade: | 25 |
| Ocupação: | Arquiteta |
| Motivações | Desabafar sobre crises de ansiedade no momento em que ocorrem, ter um suporte emocional rápido através das notas que o doutor insere em seu diário |
| Frustrações | Ter crises agudas no início da semana e precisar esperar até a sessão presencial para ter uma orientação profissional sobre o ocorrido |
| Hobbies | Fotografia, aquarela e trilhas |

| Mariana Costa | <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/95c31edd-6b81-47df-8aa4-65f834251ebb" />|
|-----------------------|-|
| Idade: | 34 |
| Ocupação: | Executiva de Vendas |
| Motivações | Registrar pensamentos detalhados para documentar crises de Burnout e receber orientações práticas de sua psicóloga através do sistema |
| Frustrações | Sentir-se perdida sem saber quais atividades realizar para melhorar seu bem-estar entre as sessões, dificuldade em organizar relatos longos de forma cronológica |
| Hobbies | Yoga, leitura de suspenses |

## Histórias de Usuários

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Dra. Patrícia | Exibir diário enviado pelo paciente | Analisar as emoções em tempo real e planejar a sessão |
| Dr. Arnaldo | Inserir observações técnicas no diário | Registrar minha análise clínica e guiar o raciocínio terapêutico do paciente |
| Tiago Alves | Inserir entradas de diário de pensamentos | Documentar minhas emoções e padrões de comportamento de forma cronológica |
| Sofia Mendes | Visualizar observações e devolutivas | Receber suporte emocional e técnico nos intervalos entre as consultas presenciais |
| Mariana Costa | Visualizar atividades recomendadas | Ter um guia prático do que fazer para melhorar meu bem-estar entre as sessões |
| Roberta Santos | Usar o chat para falar com minha psicóloga | Tirar dúvidas rápidas sobre o meu tratamento sem precisar esperar pela próxima sessão |
| Ricardo Oliveira | Ver minhas anotações antigas separadas por data | Perceber se o meu humor melhorou ou mudou desde o mês passado |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.


# Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RF-001 | O sistema deve autenticar usuários do tipo paciente e psicólogo, permitindo login e logout de forma segura. | Alta |
| RF-002 | O sistema deve permitir o cadastro de pacientes mediante informação de nome, e-mail e senha. | Alta |
| RF-003 | O sistema deve permitir o cadastro de psicólogos mediante informação de dados profissionais básicos, como nome, e-mail, senha e número de registro no CRP. | Alta |
| RF-004 | O sistema deve permitir a vinculação de um paciente a um psicólogo para fins de acompanhamento terapêutico. | Alta |
| RF-005 | O sistema deve permitir que o paciente registre entradas no diário contendo texto livre. | Alta |
| RF-006 | O sistema deve exibir ao paciente o histórico de suas entradas no diário em ordem cronológica. | Alta |
| RF-007 | O sistema deve permitir que o psicólogo visualize as entradas do diário dos pacientes a ele vinculados. | Alta |
| RF-008 | O sistema deve permitir a filtragem das entradas do diário por data específica ou intervalo de datas. | Média |
| RF-010 | O sistema deve permitir que o psicólogo registre devolutivas comportamentais direcionadas ao paciente. | Média |
| RF-011 | O sistema deve permitir que o psicólogo registre atividades recomendadas ao paciente no contexto do tratamento em andamento. | Média |
| RF-012 | O sistema deve disponibilizar um canal de comunicação via chat entre paciente e psicólogo vinculados. | Média |
| RF-013 | O sistema deve analisar automaticamente cada frase das entradas do diário, identificando a emoção predominante e sua intensidade, utilizando um modelo de inteligência artificial. | Média |
| RF-014 | O sistema deve determinar a emoção predominante de cada entrada do diário com base nas intensidades identificadas pelo modelo de inteligência artificial. | Média |


---

# Requisitos Não Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RNF-001 | A aplicação deve funcionar corretamente em navegadores e dispositivos móveis. | ALTA |
| RNF-002 | O sistema deve ser compatível com navegadores modernos (Chrome, Firefox e Edge). | MÉDIA |
| RNF-003 | O sistema deve garantir segurança na autenticação, exigindo senha com no mínimo 6 caracteres e armazenamento seguro. | ALTA |
| RNF-004 | O sistema deve proteger dados sensíveis, garantindo que apenas usuários autorizados acessem informações do diário. | ALTA |
| RNF-005 | O sistema deve responder às requisições do usuário em tempo aceitável. | MÉDIA |
| RNF-006 | A interface deve seguir boas práticas de usabilidade, sendo simples e intuitiva. | ALTA |

---

# Restrições do Projeto

| ID | Restrição |
|----|-----------|
| RST-001 | O projeto deve ser desenvolvido exclusivamente pela equipe de alunos e entregue até o final do semestre. |
| RST-002 | A solução deve possuir versão Web e versão Mobile (App). |
| RST-003 | O acesso aos dados deve ser restrito por perfil (paciente e psicólogo) e por vínculo entre eles. |

---


## Diagrama de Casos de Uso

![Diagrama de casos de uso](https://github.com/user-attachments/assets/283fe1fe-93a8-4be9-9fb0-e81abecdd011)






# Gerenciamento de Projeto

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo

Abaixo, estão representadas as etapas e atividades para o desenvolvimento do projeto organizadas cronologicamente em um Gráfico de Gantt. Podem ser observadas as descrições das atividades e etapas, as suas datas de início e fim, e também as suas durações. Os períodos de tempo alocados para cada atividade são estimados de forma arbitrária e servirão como referência conceitual.

<img width="6117" height="2460" alt="Grafico gantt tarefas" src="https://github.com/user-attachments/assets/1cb98c05-7015-4804-a725-7171d144614c" />

## Gerenciamento de Equipe

O gerenciamento adequado de tarefas contribuirá para que o projeto alcance altos níveis de produtividade. Por isso, é fundamental que ocorra a gestão de tarefas e de pessoas, de modo que os times envolvidos no projeto possam ser facilmente gerenciados. 

<img width="1589" height="408" alt="tabela equipe" src="https://github.com/user-attachments/assets/35cfc3d6-b754-4835-b665-c21659fe0688" />

