import json
import sys
from pathlib import Path

class AssamesePythonTranspiler:
    def __init__(self):
        self.mapping = self.load_mapping()

    def load_mapping(self):
        with open(Path(__file__).parent / "mapping.json", "r", encoding="utf-8") as f:
            return json.load(f)

    def transpile(self, aspy_code: str) -> str:
        # Simple replacement - no regex, no string parsing
        python_code = aspy_code
        
        # Replace in order: literals, operators, keywords
        for category in [self.mapping["literals"], self.mapping["operators"], self.mapping["keywords"]]:
            for assamese, english in category.items():
                python_code = python_code.replace(assamese, english)
        
        return python_code

def main():
    if len(sys.argv) != 2:
        print("Usage: python transpiler.py <input_file.aspy>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # Read input file with UTF-8 encoding
    with open(input_file, 'r', encoding='utf-8') as f:
        aspy_code = f.read()
    
    transpiler = AssamesePythonTranspiler()
    python_code = transpiler.transpile(aspy_code)
    print(python_code)

if __name__ == "__main__":
    main()