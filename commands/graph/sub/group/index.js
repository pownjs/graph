exports.yargs = {
    command: 'group <name> <expressions...>',
    describe: 'Group nodes',
    aliases: ['g'],

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
        const { traverse, name, expressions } = argv

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

        await graph.group(name)

        await handleWriteOptions(argv, graph)

        const { handleOutputOptions } = require('../../lib/handlers/output')

        await handleOutputOptions(argv, resultNodes)
    }
}
