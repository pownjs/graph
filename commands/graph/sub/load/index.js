exports.yargs = {
    command: 'load <file>',
    describe: 'Load a file',
    aliases: ['l'],

    builder: (yargs) => {
        const { installWriteOptions } = require('../../lib/handlers/file')

        installWriteOptions(yargs)
    },

    handler: async(argv) => {
        const { file } = argv

        const { graph } = require('../../lib/globals/graph')

        const { handleWriteOptions, handleReadOptions } = require('../../lib/handlers/file')

        await handleReadOptions({ read: file }, graph)

        await handleWriteOptions(argv, graph)
    }
}
