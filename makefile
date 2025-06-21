.PHONY: run stop

IMAGE_NAME = mafia:dev

run:
	docker build -t $(IMAGE_NAME) .
	docker compose up -d

stop:
	docker compose down

