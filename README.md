# Collaborative Workspace

Plataforma colaborativa em HTML + C++ via WebAssembly para criar área de trabalho por e-mail, projetos, planilhas e compartilhamento.

## Funcionalidades

- Login com e-mail criando um desktop individual
- Criação de projetos com nome
- Visualização em tabela, tópicos e planner
- Compartilhamento por e-mail
- Estrutura pronta para compilar com Emscripten

## Estrutura

- `public/` — web app
- `src/core/` — lógica em C++
- `src/wasm/` — bindings para WebAssembly
- `CMakeLists.txt` — build com CMake

## Executar localmente

```bash
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Compilar WebAssembly

```bash
emcmake cmake -S . -B build
cmake --build build
```
