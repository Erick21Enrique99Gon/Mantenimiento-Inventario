import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { LibroModule } from './libro/libro.module';
import { EquipoModule } from './equipo/equipo.module';
import { MobiliarioModule } from './mobiliario/mobiliario.module';
import { RecursoModule } from './recurso/recurso.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { HistorialModule } from './historial/historial.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { EditorialModule } from './editorial/editorial.module';
import { EstadoModule } from './estado/estado.module';
import { TipoEquipoModule } from './tipo_equipo/tipo_equipo.module';
import { TipoMobiliarioModule } from './tipo_mobiliario/tipo_mobiliario.module';
import { CodigoLibroModule } from './codigo_libro/codigo_libro.module';
import { RolModule } from './rol/rol.module';
import { DetallePrestamoModule } from './detalle_prestamo/detalle_prestamo.module';
import { AuthModule } from './auth/auth.module';
import { CategoriaEquipoModule } from './categoria_equipo/categoria_equipo.module';
import { CodigoInventarioModule } from './codigo_inventario/codigo_inventario.module';
import { RfidRegistroModule } from './rfid_registro/rfid_registro.module';
import { ProcedimientosModule } from './procedimientos/procedimientos.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

@Module({
  imports: [
    PrometheusModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Ruta donde se almacenan las imágenes
      serveRoot: '/uploads', // URL base para acceder a los archivos
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true, // Carga automáticamente las entidades
      synchronize: process.env.NODE_ENV !== 'production', // No usar en producción
      logging: process.env.NODE_ENV === 'development', // Logs solo en desarrollo
    }),
    UsuarioModule,
    LibroModule,
    EquipoModule,
    MobiliarioModule,
    RecursoModule,
    PrestamoModule,
    HistorialModule,
    UbicacionModule,
    EditorialModule,
    EstadoModule,
    TipoEquipoModule,
    TipoMobiliarioModule,
    CodigoLibroModule,
    RolModule,
    DetallePrestamoModule,
    AuthModule,
    CategoriaEquipoModule,
    CodigoInventarioModule,
    RfidRegistroModule,
    ProcedimientosModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}