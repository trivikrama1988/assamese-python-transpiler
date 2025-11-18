import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Assamese Python extension is now active!');

    let disposable = vscode.commands.registerCommand('assamesePython.run', async () => {
        // Get active editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found! Please open an Assamese Python file (.aspy)');
            return;
        }

        // Check if it's an .aspy file
        const document = editor.document;
        if (!document.fileName.endsWith('.aspy')) {
            vscode.window.showErrorMessage('This command only works with .aspy files. Please save your file with .aspy extension.');
            return;
        }

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Running Assamese Python Code",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: "Starting transpilation..." });

            try {
                const aspyCode = document.getText();
                
                // Get server path (one level up from client)
                const clientPath = context.extensionPath;
                const serverPath = path.join(clientPath, '..', 'server');
                const transpilerPath = path.join(serverPath, 'transpiler.py');
                const sandboxPath = path.join(serverPath, 'sandbox.py');

                // Check if Python files exist
                if (!fs.existsSync(transpilerPath)) {
                    vscode.window.showErrorMessage(`Transpiler not found at: ${transpilerPath}`);
                    return;
                }
                if (!fs.existsSync(sandboxPath)) {
                    vscode.window.showErrorMessage(`Sandbox not found at: ${sandboxPath}`);
                    return;
                }

                progress.report({ increment: 30, message: "Transpiling Assamese to Python..." });

                // Step 1: Transpile using FILE ARGUMENT approach (not pipes)
                const tempInputPath = path.join(clientPath, 'temp_input.aspy');
                fs.writeFileSync(tempInputPath, aspyCode, 'utf8');

                const pythonCode = await new Promise<string>((resolve, reject) => {
                    // Use file argument instead of pipe
                    exec(`python "${transpilerPath}" "${tempInputPath}"`, 
                        { cwd: serverPath }, 
                        (error, stdout, stderr) => {
                        // Clean up temp file
                        try { fs.unlinkSync(tempInputPath); } catch (e) {}
                        
                        if (error) {
                            reject(new Error(`Transpilation failed: ${stderr || error.message}`));
                            return;
                        }
                        if (stderr && !stdout) {
                            reject(new Error(`Transpilation error: ${stderr}`));
                            return;
                        }
                        resolve(stdout);
                    });
                });

                progress.report({ increment: 60, message: "Executing Python code..." });

                // Step 2: Execute in sandbox using FILE ARGUMENT approach
                const tempPythonPath = path.join(clientPath, 'temp_output.py');
                fs.writeFileSync(tempPythonPath, pythonCode, 'utf8');

                const output = await new Promise<string>((resolve, reject) => {
                    // Use file argument instead of pipe
                    exec(`python "${sandboxPath}" "${tempPythonPath}"`, 
                        { cwd: serverPath }, 
                        (error, stdout, stderr) => {
                        // Clean up temp file
                        try { fs.unlinkSync(tempPythonPath); } catch (e) {}
                        
                        if (error) {
                            reject(new Error(`Execution failed: ${stderr || error.message}`));
                            return;
                        }
                        resolve(stdout || 'Code executed successfully (no output)');
                    });
                });

                progress.report({ increment: 100, message: "Displaying results..." });

                // Display results
                const panel = vscode.window.createOutputChannel('Assamese Python Output');
                panel.clear();
                panel.appendLine('=== Transpiled Python Code ===');
                panel.appendLine(pythonCode);
                panel.appendLine('\n=== Execution Output ===');
                panel.appendLine(output);
                panel.appendLine('\n=== End ===');
                panel.show();

                vscode.window.showInformationMessage('Assamese Python code executed successfully!');

            } catch (error: any) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
                console.error('Extension error:', error);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Assamese Python extension deactivated');
}