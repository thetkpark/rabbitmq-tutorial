const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'direct_logs'
		const args = process.argv.slice(2)
		const msg = args.slice(1).join(' ') || 'Hello World!'
		const severity = args.length > 0 ? args[0] : 'info' // This is used as routing key

		// `direct` a message goes to the queues whose `binding key` exactly matches the `routing key` of the message
		channel.assertExchange(exchange, 'direct', { durable: false })
		// Second argument is `routing key`
		channel.publish(exchange, severity, Buffer.from(msg))
		console.log(' [x] Sent %s', msg)

		setTimeout(function () {
			connection.close()
			process.exit(0)
		}, 500)
	})
})
