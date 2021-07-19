const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err
		const queue = 'hello'
		const msg = 'Hello world'

		// Make sure that queue name 'hello' is created
		channel.assertQueue(queue, { durable: false })

		channel.sendToQueue(queue, Buffer.from(msg))
		console.log(' [x] Sent %s', msg)

		setTimeout(function () {
			connection.close()
			process.exit(0)
		}, 500)
	})
})
