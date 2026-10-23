import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@northline.com'
  const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeThisStrongPassword123!'
  const name = process.env.ADMIN_SEED_NAME || 'Store Admin'

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', isActive: true },
    create: { name, email, passwordHash, role: 'ADMIN' },
  })

  console.log(`✅ Admin ready: ${admin.email}`)
  console.log('   Password: (from ADMIN_SEED_PASSWORD env, change after first login)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
