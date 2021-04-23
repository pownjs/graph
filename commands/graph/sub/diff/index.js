exports.yargs = {
    command: 'diff <fileA> <fileB>',
    describe: 'Perform a diff between two graph files',
    aliases: ['d'],

    builder: (yargs) => {
        yargs.option('subset', {
            alias: 's',
            choices: ['left', 'right', 'both'],
            default: 'left',
            describe: 'The subset to select'
        })

        const { installWriteOptions } = require('../../lib/handlers/file')

        installWriteOptions(yargs)

        const { installOutputOptions } = require('../../lib/handlers/output')

        installOutputOptions(yargs)
    },

    handler: async(argv) => {
        const { fileA, fileB, subset } = argv

        const { readFile } = require('@pown/file/lib/file') // TODO: remove and use fs instead

        const { Graph } = require('../../../../lib/graph')

        let fileAData

        try {
            fileAData = await readFile(fileA)
        }
        catch (e) {
            console.error(`Cannot read file ${fileA}`)

            return
        }

        let fileAJSON

        try {
            fileAJSON = JSON.parse(fileAData.toString())
        }
        catch (e) {
            console.error(`Cannot unpack file ${fileA}`)

            return
        }

        const graphA = new Graph()

        graphA.on('info', console.info.bind(console))
        graphA.on('warn', console.warn.bind(console))
        graphA.on('error', console.error.bind(console))
        graphA.on('debug', console.debug.bind(console))

        try {
            graphA.deserialize(fileAJSON)
        }
        catch (e) {
            console.error(`Cannot load file ${fileA}`)

            return
        }

        let fileBData

        try {
            fileBData = await readFile(fileB)
        }
        catch (e) {
            console.error(`Cannot read file ${fileB}`)

            return
        }

        let fileBJSON

        try {
            fileBJSON = JSON.parse(fileBData.toString())
        }
        catch (e) {
            console.error(`Cannot parse file ${fileB}`)

            return
        }

        const graphB = new Graph()

        graphB.on('info', console.info.bind(console))
        graphB.on('warn', console.warn.bind(console))
        graphB.on('error', console.error.bind(console))
        graphB.on('debug', console.debug.bind(console))

        try {
            graphB.deserialize(fileBJSON)
        }
        catch (e) {
            console.error(`Cannot load file ${fileB}`)

            return
        }

        const {
            [subset]: collection
        } = graphA.cy.elements().diff(graphB.cy.elements())

        const resultNodes = collection.map(node => node.data())

        const { handleWriteOptions } = require('../../lib/handlers/file')

        const graph = new Graph()

        graph.on('info', console.info.bind(console))
        graph.on('warn', console.warn.bind(console))
        graph.on('error', console.error.bind(console))
        graph.on('debug', console.debug.bind(console))

        graph.cy.add({
            group: 'nodes',
            data: {
                id: 'previous',
                type: 'previous',
                label: 'Previous',
                props: {}
            }
        })

        collection.nodes().forEach((node) => {
            graph.cy.add(node)
        })

        collection.edges().forEach((edge) => {
            const data = edge.data()

            let { source, target } = data

            let move

            if (!source || !collection.getElementById(source).length) {
                source = 'previous'
                move = true
            }

            if (!target || !collection.getElementById(target).length) {
                target = 'previous'
                move = true
            }

            if (move) {
                graph.cy.add({
                    group: 'edges',
                    data: { ...data, source, target }
                })
            }
            else {
                graph.cy.add({
                    group: 'edges',
                    data: data
                })
            }
        })

        await handleWriteOptions(argv, graph)

        const { handleOutputOptions } = require('../../lib/handlers/output')

        await handleOutputOptions(argv, resultNodes)

    }
}
