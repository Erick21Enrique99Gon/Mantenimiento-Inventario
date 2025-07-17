# PracticaFinal-Aplicacion-Inventario

## Levantar el proyecto local

### Docker externar network

Se debe crear una red externa en docker con el comando:

```
docker network create pf_inventario_external_network
```

### Levantar base de datos

Se debe ejecutar primero el docker compose de la carpeta database con el comando

```
docker-compose up -d --build
```

### Levantar el proyecto con docker local

Para levantar el backend y frontend usar el docker-compose.dev.yaml, ejecutar el siguiente comando:

```
docker-compose -f docker-compose.dev.yaml up -d --build
```

### Lavantar el proyecto en produccion

Para levantar el proyecto en produccion es necesario tener el archivo .env de la carpeta raiz del proyecto copiado en la misma carpeta que el archivo docker-compose.prod.yaml

Luego ejecutar el comando:

```
docker-compose -f docker-compose.prod.yaml up -d
```

# PRODUCCION

## Para construir las imagenes de docker con soporte para todas las arquitecturas utilizar el script de linux 
## build-all.sh

chmod +x build-all.sh
./build-all.sh


## Correr entorno de produccion usando el .env.prod

docker-compose --env-file .env.prod -f docker-compose.prod.yaml up -d

## Eliminar contenedores, volumenes e imagenes

docker-compose --env-file .env.prod -f docker-compose.prod.yaml down -v --rmi all