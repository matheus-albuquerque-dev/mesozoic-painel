# ⚠️ Status do Projeto: Em Pausa Temporária
> Este projeto se encontra em pausa temporária devido a [problemas técnicos de hardware / foco em outro projeto (GameDev]. Sinta-se à vontade para explorar o código.

# 🦖 Mesozoic Painel - Full Stack Personal Project
> Painel interativo de **controle biotecnológico e administração de parques mesozoicos retrô**.

## 📝 Sobre o Mesozoic Painel
Este é um projeto **Full Stack pessoal** desenvolvido para consolidar conhecimentos em criação de **interfaces responsivas** e **integração de APIs**. O sistema utiliza uma comunicação eficiente entre um front-end reativo e um **banco de dados relacional (PostgreSQL)**, indo além da simples manipulação de arquivos JSON para garantir a persistência e integridade dos dados em um ambiente escalável. O sistema simula um painel de controle de um parque retrô com animais pré-históricos, atualmente contendo **CRUD** de espécies, suas sequências genéticas e, futuramente, outras funcionalidades.

## 🚀 Tecnologias Utilizadas
### Front-end

* React.js: Criar uma interface reativa baseada em componentes reutilizáveis e gerenciamento de estado via Hooks.

* Vite: Ferramenta de build para garantir um ambiente de desenvolvimento rápido e alta performance no carregamento final do site.

* CSS3: Estilização modular feita **do zero (sem frameworks externos)**, focada em criar uma interface imersiva e responsiva para o painel, com **estética retrô**.

* SweetAlert2: Biblioteca integrada para padronizar os alertas de confirmação, sucesso e erro em todas as operações.

### Back-end & Database

* Node.js & Express: Estruturação de uma API REST que lida com requisições assíncronas para o processamento de dados do parque.

* PostgreSQL: Banco de dados relacional utilizado para garantir que informações críticas (como Genes) sejam salvas com segurança e integridade.

* node-postgres (pg): Driver utilizado para conectar o servidor ao banco, permitindo a execução de comandos SQL dinâmicos (como atualizações parciais e totais via PATCH).

## 🛠️ Funcionalidades
* ✅ Concluído | 🟦 Em desenvolvimento | ⬜ Planejado

* ✅ Loading Screen --> Exibida por simulação de latência;

* ✅ Efeitos Sonoros --> Implementação de áudios globais para imersão na interface;

* ✅ Sidebar Dinâmica --> Menu responsivo com rotas de navegação;

* ✅ Modelagem e Persistência de Dados --> Estruturação de banco de dados relacional (PostgreSQL) para catálogo e sequenciamento genético;

* ✅ Integridade de Dados --> Sistema de unicidade de registros (Unique Keys) para nomes de espécies e genes;

* ✅ PATCH Dinâmico --> Atualizações parciais de dados otimizadas no servidor;

---

* ✅ Sequenciador de **Genes**: CRUD de cadeias genéticas com validação de bases nitrogenadas (ATCG) e visualização dinâmica;

* ✅ **Dinopédia**: CRUD completo de espécies com persistência e validação em banco de dados SQL;

* ⬜ Monitoramento de **Recintos**: Integração informacional entre espécimes e habitats;

* ⬜ Sistema de **Câmeras**: Interface de visualização simulada para cada recinto;

* ⬜ **Mapa** de Infraestrutura: Visualização geográfica responsiva, interativa e informacional.

## 🎥 Demonstração
![Demonstração do Mesozoic Painel](./client/public/assets/demo.gif)
