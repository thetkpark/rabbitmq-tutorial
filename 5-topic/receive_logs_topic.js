const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
	console.log('Usage: receive_logs_topic.js <facility>.<severity>')
	process.exit(1)
}

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'topic_logs'

		channel.assertExchange(exchange, 'topic', { durable: false })

		// Provide empty string queue name -> Let Rabbit generate random queue idemtifier
		channel.assertQueue('', { exclusive: true }, (err, q) => {
			if (err) throw err

			console.log(' [*] Waiting for logs. To exit press CTRL+C')

			// Bind the queue with the exchange with `binding key` or `routing key` of key
			// # -> Match zero or more word
			// * -> Match only one word
			args.forEach(function (key) {
				channel.bindQueue(q.queue, exchange, key)
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
