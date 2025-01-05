Instructions to clone the porject

git clone https://github.com/YousafZahid/Fiscal-project-management.git


Backend setup:
cd <backend-folder>
python -m venv env
source env/bin/activate  # macOS/Linux
env\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Frontend setup:

cd <frontend-folder>
npm install
npm start
