"""
List available Gemini models
"""
import os
import google.generativeai as genai

os.environ['GEMINI_API_KEY'] = 'AIzaSyBIHQct4HZQuTL8uSQgg2ZjrtKki4W5Yss'
genai.configure(api_key=os.environ['GEMINI_API_KEY'])

print("\nAvailable Gemini Models:")
print("=" * 60)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"\nModel: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print(f"  Methods: {model.supported_generation_methods}")
