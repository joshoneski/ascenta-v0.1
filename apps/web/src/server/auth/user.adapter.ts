import { users } from '@/db/schema'
import { UserEntity, UserId } from '@/server/auth/user.entity'
import { UserDTO } from '@/shared/dtos/user.dto'

export const userAdapters = {
    dbToEntity: (user: typeof users.$inferSelect): UserEntity =>
        new UserEntity(new UserId(user.id), user.email, user.name),

    entityToDTO: (user: UserEntity): UserDTO => ({
        id: user.id.value,
        email: user.email,
        name: user.name,
    }),
}
