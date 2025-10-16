# Instalación de InTouch

## Requisitos del servidor
- PHP 7.2 o superior
- MySQL/MariaDB
- Extensión mysqli habilitada
- Permisos de escritura en la carpeta `php/uploads/`

## Pasos de instalación

### 1. Configurar base de datos
1. Crear una base de datos MySQL llamada `u214138677_intouch`
2. Importar el archivo `u214138677_intouch.sql` en la base de datos
3. Verificar que las tablas se crearon correctamente

### 2. Configurar conexión
Editar el archivo `php/conexion.php` con los datos de tu servidor:
```php
$host = "localhost";       // Tu servidor MySQL
$user = "tu_usuario";      // Tu usuario MySQL  
$pass = "tu_contraseña";   // Tu contraseña MySQL
$dbname = "tu_base_datos"; // Nombre de tu base de datos
```

### 3. Configurar permisos
Crear la carpeta `php/uploads/` y darle permisos de escritura:
```bash
mkdir php/uploads
chmod 755 php/uploads
```

### 4. Poblar base de datos (opcional)
Visitar: `tu-dominio.com/php/setup_database.php`
Esto insertará categorías y pictogramas de ejemplo.

### 5. Verificar instalación
- Visitar: `tu-dominio.com/php/debug.php` - Verificar PHP
- Visitar: `tu-dominio.com/php/categorias.php` - Verificar categorías
- Visitar: `tu-dominio.com/php/api.php` - Verificar API
- Visitar: `tu-dominio.com/` - Probar la aplicación

## Solución de problemas

### Error 500 en APIs PHP
- Verificar que mysqli esté habilitado
- Revisar logs de error del servidor
- Verificar permisos de archivos

### No se cargan pictogramas
- Verificar conexión a base de datos
- Ejecutar `setup_database.php`
- Revisar consola del navegador

### No se pueden subir imágenes
- Verificar permisos de `php/uploads/`
- Verificar configuración PHP (upload_max_filesize)

## Estructura de archivos
```
InTouch/
├── css/                 # Estilos CSS
├── img/                 # Imágenes de la aplicación
├── js/                  # JavaScript
├── php/                 # APIs PHP
│   ├── uploads/         # Imágenes subidas
│   ├── api.php          # API principal
│   ├── categorias.php   # API de categorías
│   ├── conexion.php     # Conexión a BD
│   └── setup_database.php # Configuración inicial
├── index.html           # Página principal
├── abm.html            # Administración
└── u214138677_intouch.sql # Base de datos
```