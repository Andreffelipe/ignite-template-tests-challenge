export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || "1234567890",
    expiresIn: '1d'
  }
}
