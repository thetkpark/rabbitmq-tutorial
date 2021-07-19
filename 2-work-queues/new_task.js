const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
	if (err) throw err

	connection.createChannel((err, channel) => {
		if (err) throw err

		const queue = 'task_queue'
		const msg = process.argv.slice(2).join(' ') || 'Hello World!'

		// Make sure that queue name 'hello' with durable is created
		// Durable make sure that data store in disk not memory
		channel.assertQueue(queue, { durable: true })

		// Mark this message to be persis in disk
		channel.sendToQueue(queue, Buffer.from(msg), {
			persistent: true,
		})
		console.log(' [x] Sent %s', msg)

		setTimeout(function () {
			connection.close()
			process.exit(0)
		}, 500)
	})
})
