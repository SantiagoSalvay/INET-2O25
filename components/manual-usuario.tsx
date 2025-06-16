import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, ShoppingCart, Package, Settings } from "lucide-react"

export default function ManualUsuario() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Manual de Usuario - TurismoWeb</h1>
        <p className="text-gray-600">Guía completa para usar el sistema de carrito de compras</p>
      </div>

      <Tabs defaultValue="cliente" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cliente">Manual Cliente</TabsTrigger>
          <TabsTrigger value="admin">Manual Jefe de Ventas</TabsTrigger>
        </TabsList>

        {/* Manual Cliente */}
        <TabsContent value="cliente">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Registro e Inicio de Sesión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Crear una cuenta</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Haga clic en "Registrarse" en la página principal</li>
                    <li>Complete todos los campos requeridos: nombre, apellido, email, teléfono y contraseña</li>
                    <li>Confirme su contraseña</li>
                    <li>Haga clic en "Crear Cuenta"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Iniciar sesión</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Ingrese su email y contraseña</li>
                    <li>Haga clic en "Iniciar Sesión"</li>
                    <li>Será redirigido al panel de cliente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Realizar Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Explorar productos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>En el panel principal verá todos los productos disponibles</li>
                    <li>
                      Los productos están organizados por categorías: vuelos, hoteles, autos, paquetes, excursiones
                    </li>
                    <li>Cada producto muestra: descripción, código, precio y categoría</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Agregar al carrito</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Haga clic en el botón "Agregar" del producto deseado</li>
                    <li>El producto aparecerá en su carrito (panel derecho)</li>
                    <li>Puede ajustar las cantidades usando los botones + y -</li>
                    <li>Para eliminar un producto, reduzca la cantidad a 0</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Finalizar compra</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Revise los productos en su carrito</li>
                    <li>Verifique el total a pagar</li>
                    <li>Haga clic en "Realizar Pedido"</li>
                    <li>Recibirá una confirmación por email</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Gestionar Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ver mis pedidos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>En el panel derecho verá sus últimos pedidos</li>
                    <li>Cada pedido muestra: número, fecha, estado y total</li>
                    <li>
                      Los estados pueden ser: <Badge variant="default">pendiente</Badge>,{" "}
                      <Badge variant="secondary">entregado</Badge>, <Badge variant="destructive">cancelado</Badge>
                    </li>
                    <li>Para ver todos sus pedidos, haga clic en "Ver todos los pedidos"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manual Admin */}
        <TabsContent value="admin">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Acceso al Panel Administrativo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Credenciales de acceso</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>
                      <strong>Email:</strong> admin@turismoweb.com
                    </li>
                    <li>
                      <strong>Contraseña:</strong> admin123
                    </li>
                    <li>Al iniciar sesión será redirigido al panel administrativo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard y Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Panel principal</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>
                      <strong>Total Productos:</strong> Cantidad de productos en el catálogo
                    </li>
                    <li>
                      <strong>Pedidos Pendientes:</strong> Pedidos que requieren atención
                    </li>
                    <li>
                      <strong>Ventas del Mes:</strong> Ingresos del mes actual
                    </li>
                    <li>
                      <strong>Total Clientes:</strong> Usuarios registrados
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Ver productos existentes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>En la pestaña "Productos" verá todos los productos</li>
                    <li>Cada producto muestra: descripción, código, precio, categoría</li>
                    <li>Puede editar o eliminar productos usando los botones correspondientes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Crear nuevo producto</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Vaya a la pestaña "Nuevo Producto"</li>
                    <li>Complete: código único, descripción, precio, categoría</li>
                    <li>Las categorías disponibles son: vuelos, hoteles, autos, paquetes, excursiones</li>
                    <li>Haga clic en "Crear Producto"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Ver pedidos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>En la pestaña "Pedidos" verá todos los pedidos del sistema</li>
                    <li>Información mostrada: número de pedido, cliente, fecha, estado, total</li>
                    <li>También se muestran los items incluidos en cada pedido</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Procesar pedidos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Para pedidos pendientes, puede:</li>
                    <li>
                      <strong>Marcar como Entregado:</strong> Completa el pedido y lo mueve al histórico
                    </li>
                    <li>
                      <strong>Cancelar:</strong> Cancela el pedido
                    </li>
                    <li>Los cambios de estado se reflejan inmediatamente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Cuenta y Reportes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Información disponible</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Las estadísticas se actualizan en tiempo real</li>
                    <li>Puede ver el total de ventas del mes actual</li>
                    <li>Los pedidos entregados se archivan automáticamente</li>
                    <li>Toda la información de ventas se registra para auditoría</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Soporte Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Para soporte técnico o consultas adicionales, contacte a:
            <strong> soporte@turismoweb.com</strong> o<strong> +54 11 1234-5678</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
