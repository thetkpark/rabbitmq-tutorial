const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const exchange = 'topic_logs'
		const args = process.argv.slice(2)
		const key = args.length > 0 ? args[0] : 'anonymous.info'
		const msg = args.slice(1).join(' ') || 'Hello World!'

		channel.assertExchange(exchange, 'topic', { durable: false })
		// If use exchnage type of 'topic', second argument is the `routing key` which delivered to all the queues that are bound with a matching binding key
		// Format of routing key is <word>.<word> (Can have any length) Ex: quick.orange.rabbit

		channel.publish(exchange, key, Buffer.from(msg))
		console.log(' [x] Sent %s', msg)

		setTimeout(function () {
			connection.close()
			process.exit(0)
		}, 500)
	})
})
