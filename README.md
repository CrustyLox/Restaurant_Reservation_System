# Restaurant_Reservation_System

## Restaurant Reservation System Backend

This section is for how to run the backend of the application

### Prerequisities

Ensure you have :
1 - PostgreSQL
2 - pip
3 - git
4 - python

### 1. Clone the repository (or download the files)

```bash
git clone <your-repo-url>
cd Restaurant_Reservation_System
```

You can use this or just download the files

### 2. Create and activate a virtual environment

#### Windows (PowerShell)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

#### Mac/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create the database

As of 08/03/2026 the DBMS being used is currently PostgreSQL
so ensure postgre is downloaded and run this on psql

```sql
CREATE DATABASE restaurant_db;
```

### 5. Set up environmental variables

Create a `.env` file in the backend folder
follow the template used in `.env.example`

### 6. Run the FastAPI server

Ensure this is being run in Restaurant_Reservation_System\backend

```bash
uvicorn main:app --reload
```
