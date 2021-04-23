exports.yargs = {
    command: 'remove <expressions...>',
    describe: 'Remove nodes',
    aliases: ['r'],

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
    },

    handler: async(argv) => {
        const { traverse, expressions } = argv

        const { graph } = require('../../lib/globals/graph')

        const { handleReadOptions, handleWriteOptions } = require('../../lib/handlers/file')

        await handleReadOptions(argv, graph)

        let resultNodes

        if (traverse) {
            resultNodes = graph.traverse(...expressions).map(node => node.data())
        }
        else {
            resultNodes = graph.select(...expressions).map(node => node.data())
        }

        graph.selection.remove()

        await handleWriteOptions(argv, graph)

        const { handleOutputOptions } = require('../../lib/handlers/output')

        await handleOutputOptions(argv, resultNodes)
    }
}
