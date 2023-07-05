MANAGE := poetry run python3 manage.py

start:
	${MANAGE} runserver 127.0.0.1:8000
shell:
	${MANAGE} shell_plus --plain
db:
	${MANAGE} dbshell
migrate:
	${MANAGE} makemigrations
	${MANAGE} migrate
collectstatic:
	${MANAGE} collectstatic --no-input --clear
test:
	${MANAGE} test --keepdb
install:
	poetry install --no-root
lint:
	poetry run flake8 lowfoundAI --exclude migrations,migrations-old,migrations_old
coverage:
	poetry run python -m coverage run manage.py test
translate:
	${MANAGE} makemessages --locale ru --ignore=venv
	${MANAGE} compilemessages --locale ru
