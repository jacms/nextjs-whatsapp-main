import getPrismaInstance from '../utils/PrismaClient.js'

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.json({ msg: 'Email is required', status: false })
    }
    const prisma = getPrismaInstance()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.json({ msg: 'User not found', status: false })
    } else {
      return res.json({ msg: 'User found', status: true, data: user })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, image: profilePicture, about } = req.body
    if (!email || !name || !profilePicture) {
      return res.send('Email, Name and Profile picture are required.')
    }
    const prisma = getPrismaInstance()

    const user = await prisma.user.create({
      data: {
        email,
        name,
        profilePicture,
        about
      }
    })
    return res.json({ msg: 'Success', status: true, data: user })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        about: true
      }
    })

    const userGroupedByInitialLetter = {}
    users.forEach((user) => {
      const firstLetter = user.name.charAt(0).toUpperCase()
      if (!userGroupedByInitialLetter[firstLetter]) {
        userGroupedByInitialLetter[firstLetter] = []
      }
      userGroupedByInitialLetter[firstLetter].push(user)
    })

    return res.status(200).send({ users: userGroupedByInitialLetter })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
