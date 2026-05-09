import requests
import time
import json

BASE_URL = "http://localhost:8000"

def run_tests():
    print("Iniciando testes de integração com o Backend...\n")

    # 1. Testar conexão com o servidor
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Health Check: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Erro: Backend não está rodando. Por favor, inicie o servidor FastAPI na porta 8000.")
        return

    # 2. Registrar um IP único
    print("\n--- Teste 1: Registrar um IP Único ---")
    ip_data_1 = {
        "content": "Este é um algoritmo inovador de IA para otimização de rotas usando reinforcement learning. O sistema mapeia dados geográficos e aplica DQN.",
        "metadata": {"author": "JoaoF", "type": "algorithm"}
    }
    res1 = requests.post(f"{BASE_URL}/verify", json=ip_data_1)
    print(f"Status Code: {res1.status_code}")
    print(f"Response: {json.dumps(res1.json(), indent=2)}")
    
    # Pausar para garantir processamento (Ollama pode demorar alguns segundos na primeira execução)
    time.sleep(2)

    # 3. Registrar um IP muito similar (deve cair em PENDING)
    print("\n--- Teste 2: Registrar um IP Similar (Deve ser PENDING) ---")
    ip_data_2 = {
        "content": "Um algoritmo de IA inovador que otimiza rotas através de reinforcement learning (DQN). Mapeia informações geográficas.",
        "metadata": {"author": "CloneUser", "type": "algorithm"}
    }
    res2 = requests.post(f"{BASE_URL}/verify", json=ip_data_2)
    print(f"Status Code: {res2.status_code}")
    print(f"Response: {json.dumps(res2.json(), indent=2)}")
    
    # 4. Listar pendências no Admin
    print("\n--- Teste 3: Listar Pendências no Admin ---")
    res_pending = requests.get(f"{BASE_URL}/admin/pending")
    pending_list = res_pending.json()
    print(f"Total Pendências: {len(pending_list)}")
    print(f"Pendências: {json.dumps(pending_list, indent=2)}")

    # 5. Resolver uma pendência (se houver)
    print("\n--- Teste 4: Resolver a primeira pendência como REJECTED ---")
    if pending_list:
        request_id = pending_list[0]["_id"]
        res_resolve = requests.post(f"{BASE_URL}/admin/resolve?request_id={request_id}&decision=REJECTED")
        print(f"Status Code: {res_resolve.status_code}")
        print(f"Response: {json.dumps(res_resolve.json(), indent=2)}")
    else:
        print("Nenhuma pendência encontrada para resolver.")

if __name__ == "__main__":
    run_tests()
