exports.yargs = {
    command: 'merge <files...>',
    describe: 'Perform a merge between at least two graph files',
    aliases: ['m'],

    builder: (yargs) => {
        const { installWriteOptions } = require('../../lib/handlers/file')

        installWriteOptions(yargs)
    },

    handler: async(argv) => {
        const { files } = argv

        const { readFile } = require('@pown/file/lib/file') // TODO: remove and use fs instead

        const { Graph } = require('../../../../lib/graph')

        const graph = new Graph()

        graph.on('info', console.info.bind(console))
        graph.on('warn', console.warn.bind(console))
        graph.on('error', console.error.bind(console))
        graph.on('debug', console.debug.bind(console))

        await Promise.all(files.map(async(file) => {
            let data

            try {
                data = await readFile(file)
            }
            catch (e) {
                console.error(`Cannot read file ${file}`)

                return
            }

            let json

            try {
                json = JSON.parse(data.toString())
            }
            catch (e) {
                console.error(`Cannot unpack file ${file}`)

                return
            }

            const graphFile = new Graph()

            graphFile.on('info', console.info.bind(console))
            graphFile.on('warn', console.warn.bind(console))
            graphFile.on('error', console.error.bind(console))
            graphFile.on('debug', console.debug.bind(console))

            try {
                graphFile.deserialize(json)
            }
            catch (e) {
                console.error(`Cannot load file ${file}`)

                return
            }

            graph.cy.add(graphFile.cy.elements())
        }))

        const { handleWriteOptions } = require('../../lib/handlers/file')

        await handleWriteOptions(argv, graph)
    }
}
