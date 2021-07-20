const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'logs'

		channel.assertExchange(exchange, 'fanout', { durable: false })

		// Provide empty string queue name -> Let Rabbit generate random queue idemtifier
		channel.assertQueue('', { exclusive: true }, (err, q) => {
			if (err) throw err

			console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue)

			// Binding is relation between exchange and queue
			// Tell exchange which queue to send to
			channel.bindQueue(q.queue, exchange, '')

			channel.consume(
				q.queue,
				msg => {
					if (msg.content) {
						console.log(' [x] %s', msg.content.toString())
					}
				},
				{ noAck: true }
			)
		})
	})
})
