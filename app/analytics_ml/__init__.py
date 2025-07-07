"""
Module Analytics ML pour Finance & Assurance
Version simplifiée pour démarrage rapide
"""

# Utiliser la version simplifiée pour le moment
try:
    from .router_simple import router
    print("✅ Router Analytics ML simple chargé")
except ImportError as e:
    print(f"❌ Erreur chargement router_simple: {e}")
    router = None

__version__ = "1.0.0"
__author__ = "PI BICARS Team"

__all__ = ["router"]
