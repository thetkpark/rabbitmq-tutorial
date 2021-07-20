const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
	console.log('Usage: receive_logs_direct.js [info] [warning] [error]')
	process.exit(1)
}

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'direct_logs'

		channel.assertExchange(exchange, 'direct', { durable: false })

		// Provide empty string queue name -> Let Rabbit generate random queue idemtifier
		channel.assertQueue('', { exclusive: true }, (err, q) => {
			if (err) throw err

			console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue)

			// Bind the queue with the exchange with `binding key` or `routing key` of severity
			args.forEach(function (severity) {
				channel.bindQueue(q.queue, exchange, severity)
			})

			channel.consume(
				q.queue,
				msg => {
					console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString())
				},
				{ noAck: true }
			)
		})
	})
})
