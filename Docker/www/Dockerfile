FROM python:slim-buster
WORKDIR /app
COPY ["pyproject.toml","README.md","poetry.lock","/poetry/"]
COPY ["manage.py","/app/"]
COPY Docker/www/docker-entrypoint.sh /
WORKDIR /poetry
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --only main --no-root

CMD ["/docker-entrypoint.sh"]
