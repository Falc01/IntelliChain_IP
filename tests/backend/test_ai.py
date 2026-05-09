import pytest
from backend.app.ai_engine import SimilarityEngine
import numpy as np

def test_calculate_similarity_identical_vectors():
    engine = SimilarityEngine()
    v1 = [1.0, 2.0, 3.0]
    v2 = [1.0, 2.0, 3.0]
    
    similarity = engine.calculate_similarity(v1, v2)
    # Cosine similarity de vetores idênticos deve ser 1.0
    assert np.isclose(similarity, 1.0)

def test_calculate_similarity_orthogonal_vectors():
    engine = SimilarityEngine()
    v1 = [1.0, 0.0]
    v2 = [0.0, 1.0]
    
    similarity = engine.calculate_similarity(v1, v2)
    # Cosine similarity de vetores ortogonais deve ser 0.0
    assert np.isclose(similarity, 0.0)

def test_calculate_similarity_opposite_vectors():
    engine = SimilarityEngine()
    v1 = [1.0, 1.0]
    v2 = [-1.0, -1.0]
    
    similarity = engine.calculate_similarity(v1, v2)
    # Cosine similarity de vetores opostos deve ser -1.0
    assert np.isclose(similarity, -1.0)

def test_calculate_similarity_partial_match():
    engine = SimilarityEngine()
    v1 = [1.0, 1.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    
    similarity = engine.calculate_similarity(v1, v2)
    # Cosine similarity de [1,1,0] e [1,0,0] = (1)/(sqrt(2)*1) = 1/sqrt(2) ≈ 0.707
    assert np.isclose(similarity, 0.70710678118)
