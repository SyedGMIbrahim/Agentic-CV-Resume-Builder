#!/usr/bin/env python3

import sys
import os
sys.path.append('/Users/syedgmibrahim/Desktop/Agentic-CV-Resume-Builder/app')

from utils.pdf_generator import PDFGenerator

# Test 1: Check if pdflatex is in PATH
print("=== Testing pdflatex availability ===")
import shutil
pdflatex_path = shutil.which('pdflatex')
print(f"pdflatex found: {pdflatex_path}")

# Test 2: Test PDFGenerator initialization
print("\n=== Testing PDFGenerator initialization ===")
try:
    pdf_gen = PDFGenerator(session_id="test_session")
    print(f"PDFGenerator created successfully")
    print(f"LaTeX installed: {getattr(pdf_gen, 'latex_installed', 'Not set')}")
    print(f"Temp directory: {pdf_gen.temp_dir}")
    print(f"Directory exists after init: {os.path.exists(pdf_gen.temp_dir)}")
except Exception as e:
    print(f"PDFGenerator initialization failed: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Test LaTeX detection
print("\n=== Testing LaTeX detection ===")
try:
    pdf_gen = PDFGenerator(session_id="test_session")
    is_installed = pdf_gen.ensure_latex_installed()
    print(f"ensure_latex_installed() returned: {is_installed}")
except Exception as e:
    print(f"LaTeX detection failed: {e}")

# Test 4: Test with simple LaTeX
print("\n=== Testing PDF generation ===")
try:
    simple_latex = r"""
\documentclass{article}
\begin{document}
Hello World!
\end{document}
"""
    pdf_gen = PDFGenerator(session_id="test_session")
    
    print(f"Temp directory: {pdf_gen.temp_dir}")
    print(f"Directory exists: {os.path.exists(pdf_gen.temp_dir)}")
    print(f"Directory permissions: {oct(os.stat(pdf_gen.temp_dir).st_mode)}")
    
    # Test the compile_latex_to_pdf method directly
    print("Testing compile_latex_to_pdf directly...")
    pdf_path = pdf_gen.compile_latex_to_pdf(simple_latex)
    print(f"Direct compilation result: {pdf_path}")
    
    # Check what files were created
    if os.path.exists(pdf_gen.temp_dir):
        files = os.listdir(pdf_gen.temp_dir)
        print(f"Files in temp directory: {files}")
        
        # Check for any PDF files
        pdf_files = [f for f in files if f.endswith('.pdf')]
        print(f"PDF files found: {pdf_files}")
        
        # Check for any log files
        log_files = [f for f in files if f.endswith('.log')]
        print(f"Log files found: {log_files}")
        
        if log_files:
            log_path = os.path.join(pdf_gen.temp_dir, log_files[0])
            try:
                with open(log_path, 'r', encoding='utf-8', errors='replace') as f:
                    log_content = f.read()
                print(f"Log file content (first 500 chars): {log_content[:500]}")
            except Exception as e:
                print(f"Could not read log file: {e}")
    
    if pdf_path and os.path.exists(pdf_path):
        print(f"PDF file size: {os.path.getsize(pdf_path)} bytes")
    else:
        print("PDF generation returned None or file doesn't exist")
except Exception as e:
    print(f"PDF generation failed: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Debug complete ===")