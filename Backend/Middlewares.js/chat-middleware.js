import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  // Check if the Authorization header exists and is in the correct format
  const header =
    req.headers.authorization && req.headers.authorization.split(' ')[1]

  // Return an error if the Authorization header is missing or malformed
  if (!header) {
    return res.status(401).send({
      status: 'failed',
      message: 'Unauthorized',
    })
  }

  const token = header
  console.log(token)

  if (!token) {
    return res.status(401).send({
      status: 'failed',
      message: 'Unauthorized',
    }) // Return an error if the token is missing
  }

  try {
    // Verify the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Attach the user object to the request object for access in the next middleware
    req.user = decoded

    // Call the next middleware or route handler
    next()
  } catch (error) {
    // Handle errors that occur during token verification or user lookup
    return res.status(500).json({
      status: 'failed',
      message: 'Error verifying token',
      data: error.message,
    })
  }
}
