.PHONY: build, up, import

build:
	docker pull python:3 && \
		docker-compose build --force-rm

up:
	# the crawlers
	docker-compose up -d crawler-my crawler-vn crawler-mm crawler-kh crawler-id

	# the API
	docker-compose up -d backend

	# the static react site

import:
	if cd test-lists; then git pull; else git clone https://github.com/citizenlab/test-lists/ test-lists; fi &&\
		docker-compose up importer-my importer-vn importer-mm importer-kh importer-id