# VibeCheck — Documentação de Template de Design

---

## 1. Visão Geral

O **VibeCheck** é uma plataforma de acompanhamento emocional e clínico que conecta psicólogos e pacientes. Oferece duas interfaces distintas:

- **App Mobile** (Expo Go / React Native) — voltado ao uso no dia a dia tanto de psicólogos quanto de pacientes.
- **Página Web** — interface complementar, com foco na visão do psicólogo e do paciente em desktop.

### Perfis de Usuário

| Perfil | Acesso Principal | Funcionalidades Principais |
|---|---|---|
| Paciente | App Mobile + Web | Diário emocional, devolutivas, atividades, chat |
| Psicólogo | App Mobile + Web | Painel de pacientes, análise de período, atividades, chat |

---

## 2. Identidade Visual

### 2.1 Logo e Mascote

<img width="90" height="90" alt="adaptive-icon" src="https://github.com/user-attachments/assets/13876d22-35c2-4f61-943c-064d64b66fb6" />

- **Nome:** VibeCheck
- **Mascote:** Um rato cinza lendo um livro azul com ícone de cérebro e check verde — representa estudo, mente e acompanhamento.
- **Tipografia do logotipo:** Negrito, sem serifa. A palavra "Vibe" e "Check" formam um bloco único.
- **Uso da logo:** Splash screen (fundo branco), tela de login (fundo lavanda), cabeçalho da web.

### 2.2 Paleta de Cores

<img width="1600" height="1200" alt="paleta_vibecheck" src="https://github.com/user-attachments/assets/b32c9497-f03b-4a98-b77e-397bc3e61faa" />


| Token | Cor | Hex Aproximado | Uso |
|---|---|---|---|
| `--color-primary` | Roxo médio | `#6B3FA0` / `#7B52AB` | Header, botões primários, ícones ativos, avatares |
| `--color-primary-dark` | Roxo escuro | `#3D1F6E` / `#2D1B5E` | Botão "Salvar", "Vincular", "Aplicar", fundo de header app |
| `--color-primary-light` | Lavanda | `#EDE9F6` / `#F0ECFA` | Fundo de telas, balões de mensagem enviada (tom médio) |
| `--color-background` | Lavanda suave | `#F3F0FA` | Background padrão de telas internas |
| `--color-surface` | Branco | `#FFFFFF` | Cards, inputs, modais |
| `--color-surface-gray` | Cinza claro | `#F5F5F5` / `#EFEFEF` | Fundo de cards em telas de detalhe |
| `--color-accent` | Salmão / Rosa acastanhado | `#C47E6E` / `#C97B6B` | Botão de ação secundária ("Enviar", "Criar conta", "Registrar devolutiva") |
| `--color-text-primary` | Roxo muito escuro / quase preto | `#1A0A3D` | Títulos principais |
| `--color-text-secondary` | Roxo médio acinzentado | `#6B5A8A` | Subtítulos, rótulos, textos de apoio |
| `--color-text-muted` | Cinza lavanda | `#A49BB8` | Placeholders, textos inativos, timestamps |
| `--color-border` | Lavanda | `#D4CCE8` | Bordas de inputs, cards com borda tracejada |
| `--color-completed` | Roxo médio (opaco) | `#7B52AB` com 60% opacidade | Ícone de check em atividades concluídas |



### 2.3 Tipografia

**Fonte: Nunito**

<img width="1443" height="705" alt="Screenshot 2026-05-31 at 9 03 27 PM" src="https://github.com/user-attachments/assets/6e454ec6-0f3a-412a-b44a-4c0d9a6c61bc" />


| Uso | Peso | Tamanho Aproximado |
|---|---|---|
| Título de tela (ex: "Atividades", "Análise do período") | Bold | 22–26px |
| Subtítulo / descrição de seção | Regular | 13–14px |
| Label de campo (ex: "PACIENTE", "DATA DA ENTREGA") | Semibold, uppercase, letter-spacing | 11–12px |
| Corpo de texto / mensagens | Regular | 15–16px |
| Timestamp / texto auxiliar | Regular | 12px |
| Botão | Bold | 15–16px |



---

## 3. Componentes de UI

### 3.1 Header

#### App Mobile

<img width="392" height="56" alt="Screenshot 2026-05-31 at 9 11 46 PM" src="https://github.com/user-attachments/assets/8df3f881-5af0-4ca7-b06b-389d36be1ba0" />

- Fundo: `--color-primary` (roxo médio)
- Texto branco, bold, alinhado à esquerda
- Seta de voltar (←) à direita nas telas internas
- Logo "VibeCheck" ou nome da tela como título

#### Web
- Fundo: `--color-primary` (roxo médio)
- Logo + nome à esquerda
- Navegação principal à direita: links de texto branco (Pacientes, Atividades) + botão "Chat" em salmão com ícone de balão
- Botão "Sair" à direita como texto simples

---

### 3.2 Barra de Navegação Inferior (App Mobile)

Três abas fixas na parte inferior:

| Aba | Ícone | Estado Ativo |
|---|---|---|
| Pacientes | Ícone de duas pessoas | Roxo primário + label roxo |
| Atividades | Ícone de prancheta | Roxo primário + label roxo |
| Chat | Ícone de balão de fala | Roxo primário + label roxo |

- Estado inativo: ícone e label em cinza acinzentado (`--color-text-muted`)

<img width="388" height="58" alt="Screenshot 2026-05-31 at 9 12 41 PM" src="https://github.com/user-attachments/assets/2c1a0b63-4798-4e17-a087-2f9bbf8a076f" />
 
- Estado ativo: ícone e label em `--color-primary`

<img width="390" height="55" alt="Screenshot 2026-05-31 at 9 14 01 PM" src="https://github.com/user-attachments/assets/a7cf7995-39f4-45ae-936d-ffa794206033" />


---

### 3.3 Botões

| Variante | Fundo | Texto | Border Radius | Uso |
|---|---|---|---|---|
| Primário cheio (roxo) | `--color-primary-dark` | Branco bold | Grande (~12px) | "Vincular", "Salvar Atividade", "Aplicar", "Enviar" (chat) |
| Secundário (acento salmão) | `--color-accent` | Branco bold | Grande (~12px) | "Criar conta", "Entrar", "Registrar devolutiva", "Enviar" (devolutiva) |
| Outline (cancelar) | Branco / transparente | Roxo bold | Grande (~12px) | "Cancelar" |
| Ghost / Texto | Transparente | Roxo ou cinza | — | "Cancelar" em modal, "Sair" no header web |
| Pill pequeno | `--color-primary-dark` | Branco bold | Pill completo | "+ Nova Atividade" no topo de tela |

- Primário cheio:
<img width="360" height="55" alt="Screenshot 2026-05-31 at 9 15 05 PM" src="https://github.com/user-attachments/assets/fbac5605-dd84-4b9c-869a-f744ff0da223" />

- Secundário (acento salmão):
<img width="358" height="47" alt="Screenshot 2026-05-31 at 9 15 56 PM" src="https://github.com/user-attachments/assets/f66c7b6f-69a7-420c-bf68-232bb202c708" />

- Ghost / Texto:
<img width="296" height="39" alt="Screenshot 2026-05-31 at 9 27 35 PM" src="https://github.com/user-attachments/assets/886d129a-b9f8-4723-8443-c47c47ae8e22" />

- Pill pequeno:
<img width="138" height="41" alt="Screenshot 2026-05-31 at 9 16 52 PM" src="https://github.com/user-attachments/assets/ff84d3d1-af07-4239-b8e4-08d2fbb74d4b" />



---

### 3.4 Inputs e Formulários

- **Border radius:** Grande (~10–12px)
- **Fundo:** Branco (`#FFFFFF`) com borda fina em `--color-border`
- **Placeholder:** `--color-text-muted`
- **Label acima do campo:** uppercase, semibold, `--color-primary` ou `--color-text-secondary`
- **Dropdown:** seta chevron ▼ no lado direito, fundo branco

**Exemplo — Formulário "Nova Atividade":**

<img width="348" height="397" alt="Captura de tela 2026-05-31 224123" src="https://github.com/user-attachments/assets/dbdbc10a-6c6b-4c7f-a6ac-32a474d3ea03" />

**Formulário de cadastro:** switch toggle entre "Paciente" e "Psicólogo" — a opção ativa tem fundo `--color-primary-dark`, a inativa fica com fundo branco e borda roxa.

---

### 3.5 Cards

#### Card de Paciente (lista)

<img width="355" height="406" alt="Captura de tela 2026-05-31 224601" src="https://github.com/user-attachments/assets/223b9c40-9c08-49a3-86bb-3e07897eabe2" />

- Fundo branco com sombra suave
- Avatar circular com iniciais (fundo `--color-primary`, texto branco)
- Nome em bold + subtexto muted
- Chevron `›` à direita

#### Card de Atividade (pendente)

<img width="353" height="210" alt="Captura de tela 2026-05-31 224644" src="https://github.com/user-attachments/assets/fa1972ef-1d42-4eb3-91e8-7893d6e495b9" />

- Fundo branco com sombra suave
- Checkbox circular à esquerda (outline roxo)
- Texto da atividade + label colorida do paciente + data de entrega
- Ícone de lixeira à direita


#### Card de Atividade (concluída)

<img width="360" height="351" alt="Captura de tela 2026-05-31 224656" src="https://github.com/user-attachments/assets/43bf1fe7-6666-4bad-8ab7-954984badd72" />

- Fundo lavanda suave
- Checkbox preenchido com roxo + ícone ✓ branco
- Texto riscado, opacidade reduzida



#### Card de Entrada do Diário (App — visão do psicólogo)

<img width="347" height="430" alt="Captura de tela 2026-05-31 224720" src="https://github.com/user-attachments/assets/72bc7ca9-7647-44e0-ade4-a6e561659382" />

- Fundo branco com borda suave
- Timestamp em roxo no topo + botão "recolher / expandir" pill
- Texto da entrada
- Sub-card de **Análise de IA**: fundo cinza claro, ícone de robô, rótulo do sentimento em pill cinza, score numérico + barra de progresso roxa

---

### 3.6 Avatar

<img width="165" height="69" alt="Captura de tela 2026-05-31 223009" src="https://github.com/user-attachments/assets/e91b51f8-4098-4aa0-a7eb-f9e30f4350d1" />

- Forma: círculo
- Fundo: `--color-primary` (roxo)
- Conteúdo: iniciais em maiúscula, texto branco bold
- Tamanhos: pequeno (lista de pacientes), médio (cabeçalho de detalhe)

---

### 3.7 Gráficos e Análises

**Tela "Análise do período":**

<img width="358" height="176" alt="Captura de tela 2026-05-31 223647" src="https://github.com/user-attachments/assets/a2d006c4-63e6-4d85-abea-fb48005ddf33" />

- Seletor de período: campos de data inline + pills de atalho (7d, 14d, 30d) com borda roxa e border-radius pill
- Botão "Aplicar": primário roxo escuro, largura total


**Gráfico de Barras — Frequência de Registro:**

<img width="350" height="273" alt="Captura de tela 2026-05-31 223705" src="https://github.com/user-attachments/assets/a7c70509-601b-4779-9592-ca2de93369f9" />

- Barras: `--color-primary` (roxo)
- Barras futuras/sem dados: lavanda claro
- Labels: roxo abaixo de cada barra (sem, 1 – sem 8)
- Título bold + subtítulo muted

**Gráfico Radar — Perfil Emocional:**

<img width="345" height="334" alt="Captura de tela 2026-05-31 223716" src="https://github.com/user-attachments/assets/f7d3a24f-d135-4c67-bc93-a59fdb45523c" />

- Linhas da grade: roxo muito claro
- Área preenchida: lavanda suave com borda `--color-primary-dark`
- Labels das emoções ao redor: Nojo, Medo, Alegria, Tristeza, Surpresa, Raiva

---

### 3.8 Modal

**Exemplo — "Vincular paciente":**

<img width="338" height="239" alt="Captura de tela 2026-05-31 223209" src="https://github.com/user-attachments/assets/bb4556af-45e6-4ac6-8973-e48e32250743" />

- Fundo branco, border-radius grande
- Sobreposição escura no conteúdo atrás
- Título bold grande + subtítulo muted
- Input CPF centralizado
- Botão primário roxo + botão "Cancelar" como texto simples abaixo

---

### 3.9 Chat
#### App Mobile

<img width="377" height="721" alt="Captura de tela 2026-05-31 224336" src="https://github.com/user-attachments/assets/d1b94b1a-5eb9-471d-b159-4ebc69aabf1b" />

- Background geral: `--color-background` (lavanda suave)
- Mensagem recebida: fundo branco, texto escuro, alinhada à esquerda
- Mensagem enviada: fundo `--color-primary-light` (lavanda mais saturada), alinhada à direita
- Balão especial (mensagem destacada do psicólogo): fundo lavanda médio, borda-radius grande, mais largo
- Input: placeholder "Digite uma mensagem" à esquerda + botão "Enviar" roxo escuro à direita

#### Web
- Layout duas colunas: sidebar esquerda (lista de conversas) + área de chat direita
- Sidebar: lista de pacientes com avatar + última mensagem
- Header da conversa: nome + status "Conectado ao hub" + info do psicólogo à direita
- Mensagens: mesmo padrão do app (branco / lavanda)
- Input na base + botão de envio em roxo (ícone ►)

---

## 4. Fluxo de Telas — App Mobile

```
Splash Screen (logo + mascote)
    │
    ▼
Login / Cadastro
    ├── Entrar (e-mail + senha)
    └── Cadastrar
          ├── Paciente (CPF, nome, e-mail, nascimento, senha)
          └── Psicólogo (CRP, nome, e-mail, nascimento, senha)
                │
                ▼
         Dashboard Principal — Psicólogo
         ┌─────────────────────────────┐
         │  Header: "Olá, Dra. [Nome]" │
         │  Cards: pacientes / entradas│
         │  Lista de pacientes         │
         │  [+ Vincular paciente]      │
         └─────────┬───────────────────┘
                   │
         ┌─────────┼──────────────┐
         ▼         ▼              ▼
    Pacientes  Atividades       Chat
         │         │
         ▼         ▼
  Detalhe do    Nova Atividade
  Paciente      (formulário)
         │
    ┌────┴────────────┐
    ▼                 ▼
Registrar        Análise do
Devolutiva       Período
```

---

## 5. Fluxo de Telas — Web

```
Login / Cadastro
    │
    ▼
Dashboard do Psicólogo
    ├── Header: logo + nav (Pacientes | Atividades | Chat | Sair)
    ├── Banner de boas-vindas (roxo)
    ├── Cards de resumo (pacientes ativos, entradas hoje, não lidas)
    └── Lista de pacientes + [+ Vincular paciente]

Dashboard do Paciente
    ├── Header: logo + nav (Diário | Devolutivas | Atividades | Chat)
    ├── Banner de boas-vindas (roxo)
    ├── Botão [✏ Nova entrada no diário] (salmão)
    └── Timeline de entradas do diário

Chat (Web — Psicólogo)
    ├── Sidebar: lista de conversas
    └── Área de mensagens com input na base
```

---

## 6. Padrões de Interação

- **Toggle de tipo de usuário** (Paciente / Psicólogo): segmented control com fundo ativo em roxo
- **Expand / Recolher entradas**: pill com ▼ / ▲ nos cards de entrada do diário
- **Checkbox de atividade**: circular, borda roxa → preenchido roxo com ✓ ao concluir
- **Análise de IA**: bloco colapsável dentro de cada entrada, mostrando sentimento + score + barra de progresso

---

## 7. Tokens Resumidos

```css
/* Cores */
--color-primary:        #7B52AB;
--color-primary-dark:   #3D2072;
--color-primary-light:  #EDE9F6;
--color-background:     #F3F0FA;
--color-surface:        #FFFFFF;
--color-surface-gray:   #F0EEEE;
--color-accent:         #C47E6E;
--color-text-primary:   #1A0A3D;
--color-text-secondary: #6B5A8A;
--color-text-muted:     #A49BB8;
--color-border:         #D4CCE8;

/* Border Radius */
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   14px;
--radius-pill: 999px;

/* Sombra padrão de card */
box-shadow: 0 2px 8px rgba(107, 63, 160, 0.08);
```
