import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


# Add backend directory to Python path
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

sys.path.insert(0, str(BACKEND_DIR))

from app.main import app


@pytest.fixture
def client():
    """
    Provides a FastAPI test client for API tests.
    """
    with TestClient(app) as test_client:
        yield test_client
        