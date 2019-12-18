.PHONY: build run test

docker-prep:
	docker build . --rm --tag punkbeerproject:stella

test: docker-prep
	docker run punkbeerproject:stella npm run test -- --watchAll=false

dev: docker-prep
	docker run --rm --env PORT=3000 -p 3000:3000 -it punkbeerproject:stella npm run start

build: docker-prep
	docker run punkbeerproject:stella npm run build
