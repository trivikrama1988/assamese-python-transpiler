import sys
import traceback
import io
from contextlib import redirect_stdout, redirect_stderr

def execute_safely(code):
    safe_builtins = {
        'print': print,
        'len': len,
        'range': range,
        'str': str,
        'int': int,
        'float': float,
        'bool': bool,
        'list': list,
        'dict': dict,
    }
    
    restricted_globals = {
        '__builtins__': safe_builtins,
        '__name__': '__main__',
    }
    
    output_capture = io.StringIO()
    error_capture = io.StringIO()
    
    try:
        with redirect_stdout(output_capture), redirect_stderr(error_capture):
            exec(code, restricted_globals, {})
        
        output = output_capture.getvalue()
        errors = error_capture.getvalue()
        
        if errors:
            return f"Warnings:\n{errors}\nOutput:\n{output}"
        else:
            return output if output else "Code executed successfully (no output)"
            
    except Exception as e:
        return f"Error:\n{type(e).__name__}: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"

def main():
    if len(sys.argv) != 2:
        print("Usage: python sandbox.py <input_file.py>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # Read Python code from file
    with open(input_file, 'r', encoding='utf-8') as f:
        python_code = f.read()
    
    if not python_code.strip():
        print("Error: No Python code provided")
        return
    
    result = execute_safely(python_code)
    print(result)

if __name__ == "__main__":
    main()