import random
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.alias import Alias
from app.services.words import ADJECTIVES, NOUNS

class AliasGenerationError(Exception):
    pass

def generate_random_alias_string() -> str:
    """Generates a random string in the format word1_word2NNNN"""
    word1 = random.choice(ADJECTIVES)
    word2 = random.choice(NOUNS)
    number = random.randint(0, 9999)
    return f"{word1}_{word2}{number:04d}"

def create_unique_alias(db: Session, user_id: int, max_attempts: int = 10) -> Alias:
    """
    Generates a unique alias and saves it to the database.
    Retries up to `max_attempts` if a collision occurs.
    """
    for attempt in range(max_attempts):
        alias_str = generate_random_alias_string()
        
        # We also enforce uniqueness via the database unique constraint,
        # but checking first avoids unnecessary rollbacks in normal flow.
        existing = db.query(Alias).filter(Alias.alias == alias_str).first()
        if existing:
            continue
            
        new_alias = Alias(
            user_id=user_id,
            alias=alias_str,
            type="random",
            status="active"
        )
        
        try:
            db.add(new_alias)
            db.commit()
            db.refresh(new_alias)
            return new_alias
        except IntegrityError:
            # Collision caught by DB unique constraint
            db.rollback()
            continue

    raise AliasGenerationError("Failed to generate a unique alias after multiple attempts.")
