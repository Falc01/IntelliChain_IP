import ollama
from typing import List
import numpy as np

class SimilarityEngine:
    def __init__(self, model: str = "nomic-embed-text"):
        self.model = model

    async def get_embedding(self, text: str) -> List[float]:
        """Gera um embedding para o texto fornecido usando o Ollama."""
        try:
            response = ollama.embeddings(model=self.model, prompt=text)
            return response['embedding']
        except Exception as e:
            print(f"Erro ao gerar embedding: {e}")
            # Fallback ou erro
            raise e

    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calcula a similaridade de cosseno entre dois vetores."""
        v1 = np.array(embedding1)
        v2 = np.array(embedding2)
        
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        
        return dot_product / (norm_v1 * norm_v2)

ai_engine = SimilarityEngine()
