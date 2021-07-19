const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const queue = 'task_queue'
		channel.assertQueue(queue, { durable: true })

		// Tell RabbitMQ not give more than 1 task (event or message) at a time
		channel.prefetch(1)
		console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

		channel.consume(
			queue,
			msg => {
				const secs = msg.content.toString().split('.').length - 1
				console.log(' [x] Received %s', msg.content.toString())
				setTimeout(function () {
					console.log(' [x] Done')
					// ack the message
					channel.ack(msg)
				}, secs * 1000)
			},
			{
				// Manually ack the message
				noAck: false,
			}
		)
	})
})
