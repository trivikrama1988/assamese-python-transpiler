<!-- filepath: c:\Users\rdash\MyWork\assamese-python-transpiler\ReadMe.md -->
# Assamese Python Transpiler

Lightweight VS Code extension + server tools to write simple Assamese-flavored Python ("*.aspy") and run it as Python.

## Repository layout

- [client/package.json](client/package.json) — VS Code extension manifest and build scripts  
- [client/src/extension.ts](client/src/extension.ts) — VS Code extension entry (`client.src.extension.activate`)  
- [client/syntaxes/aspy.tmLanguage.json](client/syntaxes/aspy.tmLanguage.json) — TextMate grammar for `.aspy` files  
- [server/transpiler.py](server/transpiler.py) — Transpiler implementation (`server.transpiler.AssamesePythonTranspiler`)  
- [server/sandbox.py](server/sandbox.py) — Safe execution sandbox (`server.sandbox.execute_safely`)  
- [server/mapping.json](server/mapping.json) — Assamese → Python token mapping  
- [samples/fibonacci.aspy](samples/fibonacci.aspy), [samples/function.aspy](samples/function.aspy), [samples/loop.aspy](samples/loop.aspy) — example `.aspy` files  
- [test-extension/extension.js](test-extension/extension.js), [test-extension/package.json](test-extension/package.json) — small sample extension

## Features

- Transpile Assamese keywords/operators/literals (via [server/transpiler.py](server/transpiler.py) using [server/mapping.json](server/mapping.json)) into Python.
- Execute transpiled Python inside a restricted sandbox ([server/sandbox.py](server/sandbox.py)).
- VS Code command "Run Assamese Python File" registered by [client/src/extension.ts](client/src/extension.ts) (command id: `assamesePython.run`).

## Prerequisites

- Node.js (for building the extension)  
- Python 3 (for transpiler and sandbox)

## Quick start (development)

1. Install dependencies and compile the extension:
   ```sh
   cd client
   npm install
   npm run compile
   ```
   (See [client/package.json](client/package.json) for scripts.)

2. Launch the extension in VS Code:
   - Open the workspace in VS Code.
   - Press F5 or use the "Run Extension" launch configuration ([.vscode/launch.json](.vscode/launch.json)).

3. Open any sample `.aspy` file (e.g. [samples/fibonacci.aspy](samples/fibonacci.aspy)) and run the command "Run Assamese Python File" from the Command Palette. The extension's activation is implemented in [client/src/extension.ts](client/src/extension.ts).

## Manual transpile + run (without VS Code)

You can run the tools directly:

1. Transpile an `.aspy` file to Python:
   ```sh
   python server/transpiler.py samples/fibonacci.aspy > out.py
   ```
   The transpiler class is [`server.transpiler.AssamesePythonTranspiler`](server/transpiler.py) and uses the mapping in [server/mapping.json](server/mapping.json).

2. Execute the generated `out.py` in the sandbox:
   ```sh
   python server/sandbox.py out.py
   ```
   The sandbox exposes `server.sandbox.execute_safely` and will print program output or error details.

## Notes & troubleshooting

- The transpiler performs simple string replacements based on [server/mapping.json](server/mapping.json). It does not parse strings or comments specially — avoid ambiguous text inside string literals.
- The extension writes temporary files under the extension directory when running; it expects the `server` folder next to the `client` folder as in this repo layout (see path logic in [client/src/extension.ts](client/src/extension.ts)).
- If the extension reports missing Python files, confirm the `server` folder exists and contains [server/transpiler.py](server/transpiler.py) and [server/sandbox.py](server/sandbox.py).

## Examples

- See [samples/function.aspy](samples/function.aspy), [samples/loop.aspy](samples/loop.aspy), and [samples/fibonacci.aspy](samples/fibonacci.aspy).

## Tests / quick demo extension

A minimal test extension is included under [test-extension/extension.js](test-extension/extension.js) and [test-extension/package.json](test-extension/package.json) if you want to inspect a simple command extension example.

## License

This project is released under the MIT License. See the included LICENSE file for full text.