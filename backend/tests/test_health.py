import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import health_check, root

def test_health_check():
    data = health_check()
    assert data["status"] == "healthy"
    assert "CommerceChain 360" in data["service"]
    assert data["dataset_ready"] is True

def test_root():
    data = root()
    assert "docs" in data
    assert "health" in data
    assert "CommerceChain 360" in data["message"]
