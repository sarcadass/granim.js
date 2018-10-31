const Hapi = require('hapi')
const server = new Hapi.Server({ port: 8080, host: 'localhost' })
const init = async () => {
	await server.register([
		require('inert'),
		{
			plugin: require('hapi-pino'),
			options: {
					prettyPrint: true,
					logEvents: ['response', 'onPostStart']
			}
		}
	])

	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: (request, h) => h.file('./' + request.path)
	})
	
	server.route({
		method: 'GET',
		path: '/',
		handler: (request, h) => h.file('./index.html')
	})

	await server.start()
	console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
	console.log(err)
	process.exit(1)
})

init()
