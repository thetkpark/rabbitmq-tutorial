const amqp = require('amqplib/callback_api')

// Emit message to Exchange not a queue
// The exchange will handle the delivering msg to appropiate queue (as it bind to)

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'logs'
		const msg = process.argv.slice(2).join(' ') || 'Hello World!'

		// Exchange is middleman that responsible for forwarding msg to the queue
		channel.assertExchange(exchange, 'fanout', { durable: false })
		channel.publish(exchange, '', Buffer.from(msg))
		console.log(' [x] Sent %s', msg)

		setTimeout(function () {
			connection.close()
			process.exit(0)
		}, 500)
	})
})
