exports.yargs = {
    command: 'edit <expressions...>',
    describe: 'Edit nodes',
    aliases: ['e'],

    builder: (yargs) => {
        const { installReadOptions, installWriteOptions } = require('../../lib/handlers/file')

        installReadOptions(yargs)
        installWriteOptions(yargs)

        const { installOutputOptions } = require('../../lib/handlers/output')

        installOutputOptions(yargs)

        yargs.options('traverse', {
            alias: 'v',
            type: 'boolean',
            describe: 'Traverse graph',
            default: false
        })

        yargs.options('auto-weight', {
            alias: 't',
            type: 'boolean',
            describe: 'Auto weight nodes',
            default: false
        })
    },

    handler: async(argv) => {
        const { traverse, autoWeight, expressions } = argv

        const { graph } = require('../../lib/globals/graph')

        const { handleReadOptions, handleWriteOptions } = require('../../lib/handlers/file')

        await handleReadOptions(argv, graph)

        let resultNodes

        if (traverse) {
            resultNodes = graph.traverse(...expressions)
        }
        else {
            resultNodes = graph.select(...expressions)
        }

        if (autoWeight) {
            graph.measure(resultNodes)
        }

        resultNodes = resultNodes.map(node => node.data())

        await handleWriteOptions(argv, graph)

        const { handleOutputOptions } = require('../../lib/handlers/output')

        await handleOutputOptions(argv, resultNodes)
    }
}
