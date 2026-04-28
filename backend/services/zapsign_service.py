import requests
import base64
from companies.models import Company 

class ZapSignService:
    def __init__(self, company_name="Challenge ZapSign"):
        try:
            self.company = Company.objects.get(name=company_name)
            self.api_token = self.company.api_token
            self.base_url = "https://sandbox.app.zapsign.com.br/api/v1"
        except Company.DoesNotExist:
            raise Exception(f"Empresa {company_name} não encontrada no banco de dados.")

    def test_connection(self):
        url = f"{self.base_url}/docs/?api_token={self.api_token}"
        response = requests.get(url)
        
        if response.status_code == 200:
            print("Conexão com ZapSign estabelecida com sucesso!")
            
            if response.text and response.text.strip():
                try:
                    return response.json()
                except:
                    print("Resposta não é um JSON válido.")
                    return []
            print("Aviso: A API retornou 200, mas o corpo da resposta está vazio.")
            return [] 
        else:
            print(f"Erro na conexão: {response.status_code} - {response.text}")
            return None

    def create_document(self, file_path, doc_name):
        with open(file_path, "rb") as pdf_file:
            encoded_string = base64.b64encode(pdf_file.read()).decode('utf-8')

        url = f"{self.base_url}/docs/?api_token={self.api_token}"
        
        payload = {
            "name": doc_name,
            "base64_pdf": encoded_string,
            "signers": [
                {
                    "name": "Signatário de Teste",
                    "email": "teste@exemplo.com",
                    "auth_mode": "NONE"
                }
            ]
        }

        response = requests.post(url, json=payload)

        print(f"Status da Resposta: {response.status_code}")
        
        if not response.text.strip():
            return {"status": "sucesso", "message": "Documento criado, mas a API não retornou dados."}

        try:
            return response.json()
        except Exception:
            return {"status": "resposta_estranha", "raw_body": response.text}