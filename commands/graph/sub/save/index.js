exports.yargs = {
    command: 'save <file>',
    describe: 'Save to file',
    aliases: ['o'],

    builder: (yargs) => {
        const { installReadOptions } = require('../../lib/handlers/file')

        installReadOptions(yargs)
    },

    handler: async(argv) => {
        const { file } = argv

        const { graph } = require('../../lib/globals/graph')

        const { handleReadOptions, handleWriteOptions } = require('../../lib/handlers/file')

        await handleReadOptions(argv, graph)

        await handleWriteOptions({ write: file }, graph)
    }
}
