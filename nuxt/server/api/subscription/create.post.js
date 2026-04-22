export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, email, plan } = body

  if (!name || !email || !plan) {
    return {
      success: false,
      message: 'Missing fields'
    }
  }

  // тут може бути логіка збереження (поки просто мок)
  console.log('New subscription:', body)

  return {
    success: true,
    message: 'Subscription created'
  }
})
