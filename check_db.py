import sqlite3
import os

db_path = r"c:\Users\karin\Documents\Teste técnico da ZapSing\doc-sing-zapsign\backend\db.sqlite3"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("Tabelas no banco de dados:")
    for table in tables:
        print(f"  - {table[0]}")
    conn.close()
else:
    print(f"Banco de dados não encontrado em: {db_path}")