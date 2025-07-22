import { PrismaClient } from '@prisma/client';

// Crear instancia única de Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

// Función para desconectar de la base de datos
export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('🔌 Desconectado de la base de datos');
};

export default prisma;
