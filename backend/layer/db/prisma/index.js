function createPrismaClient() {
    try {
        const { PrismaClient } = require('@prisma/client');
        return new PrismaClient();
    } catch (error) {
        const { PrismaClient } = require('/app/database/node_modules/@prisma/client');
        return new PrismaClient();
    }
}

const prisma = createPrismaClient();

module.exports = {
    prisma,
};