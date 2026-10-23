import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/account/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function AccountProfilePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, phone: true, email: true },
  })

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 22, marginTop: 0 }}>Profile</h2>
      <ProfileForm name={user?.name ?? ''} phone={user?.phone ?? ''} email={user?.email ?? ''} />
    </div>
  )
}
