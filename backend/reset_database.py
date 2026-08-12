from sqlalchemy import create_engine, text
from app.core.config import settings


def reset_database():
    print("WARNING: This will DELETE ALL PostgreSQL data.")
    print(f"Database: {settings.database_url}")

    confirmation = input(
        'Type "RESET THORTHEHOST" to continue: '
    )

    if confirmation != "RESET THORTHEHOST":
        print("Reset cancelled.")
        return

    engine = create_engine(settings.database_url)

    with engine.connect() as connection:
        print("Dropping public schema...")

        connection.execute(
            text("DROP SCHEMA public CASCADE;")
        )

        print("Creating fresh public schema...")

        connection.execute(
            text("CREATE SCHEMA public;")
        )

        connection.execute(
            text("GRANT ALL ON SCHEMA public TO PUBLIC;")
        )

        connection.commit()

    engine.dispose()

    print()
    print("PostgreSQL database has been completely reset.")
    print("Run Alembic migrations next.")


if __name__ == "__main__":
    reset_database()