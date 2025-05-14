# TU-PINE Software Engineering CN334 Project.

This is project for CN334 Web Application Development.

Create by Kanrat Peetiphop (Mon), Phattaraphol Saeheng (Jai) , Anon Nuangplee (Ohm)

Includes

- app_frontend : NextJS template for Front-end Development
- ecommerce : Django with Restframework, cors-header, requests and Simple_JWT installed
- data : SQLite3 Database file

## Requirements

- Docker and Docker-compose version 2.0+

## Getting Start

To run this dokcer-compose template please folloiwng the instruction following

1. Build the docker container by following command

```
docker-compose up -d
```

```
docker-compose build
```

2.  Start the Docker-compose container by following command

```
docker-compose up -d
```

3.  Install requirements.txt by following command

```
pip install -r requirements.txt
```

4.  Get in docker container by following command

```
docker-compose exec ecommerce_api /bin/bash
```

5.  Make migrations and migrate the django models by following command

```
python manage.py makemigrations
python manage.py migrate
```
