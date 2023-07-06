FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ["pyproject.toml","README.md","poetry.lock","/poetry/"]
COPY Docker/django/docker-entrypoint.sh /
WORKDIR /poetry

RUN apt update && \
    python3 -m pip install --upgrade pip &&\
    pip3 install gunicorn && \
    pip3 install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root && \
    apt-get clean -y

RUN /app/Docker/django/docker-entrypoint.sh
