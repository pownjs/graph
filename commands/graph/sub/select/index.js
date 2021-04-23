exports.yargs = {
    command: 'select <expressions...>',
    describe: 'Select nodes',
    aliases: ['s'],

    builder: (yargs) => {
        const { installReadOptions, installWriteOptions } = require('../../lib/handlers/file')

        installReadOptions(yargs)
        installWriteOptions(yargs)

        const { installOutputOptions } = require('../../lib/handlers/output')

        installOutputOptions(yargs)
    },

    handler: async(argv) => {
        const { expressions } = argv

        const { graph } = require('../../lib/globals/graph')

        const { handleReadOptions, handleWriteOptions } = require('../../lib/handlers/file')

        await handleReadOptions(argv, graph)

        const resultNodes = graph.select(...expressions).map(node => node.data())

        await handleWriteOptions(argv, graph)

        const { handleOutputOptions } = require('../../lib/handlers/output')

        await handleOutputOptions(argv, resultNodes)
    }
}
