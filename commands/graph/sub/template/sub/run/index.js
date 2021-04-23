exports.yargs = {
    command: 'run <templates...>',
    describe: 'Run template',
    aliases: ['r'],

    builder: (yargs) => {
        const { installReadOptions, installWriteOptions } = require('../../../../lib/handlers/file')

        installReadOptions(yargs)
        installWriteOptions(yargs)

        const { installOutputOptions } = require('../../../../lib/handlers/output')

        installOutputOptions(yargs)
    },

    handler: async(argv) => {
        const { templates } = argv

        const { graph: gGraph } = require('../../../../lib/globals/graph')

        const { handleReadOptions, handleWriteOptions } = require('../../../../lib/handlers/file')

        await handleReadOptions(argv, gGraph)

        const jsYaml = require('js-yaml')

        const { extname, join } = require('path')
        const { statSync, readdirSync, readFileSync } = require('fs')

        const { GraphTemplate } = require('../../../../../../lib/template')

        const findTemplates = function*(paths) {
            for (let path of paths) {
                const stat = statSync(path)

                if (stat.isDirectory()) {
                    for (let dir of readdirSync(path)) {
                        yield* findTemplates([join(path, dir)])
                    }
                }
                else {
                    const ext = extname(path)

                    let doc

                    if (['.yaml', '.yml'].includes(ext)) {
                        const data = readFileSync(path)

                        doc = jsYaml.load(data)
                    }
                    else
                    if (['.json'].includes(ext)) {
                        const data = readFileSync(path)

                        doc = JSON.parse(data)
                    }
                    else {
                        return
                    }

                    const template = new GraphTemplate(doc)

                    template.path = path

                    yield template
                }
            }
        }

        const { handleOutputOptions } = require('../../../../lib/handlers/output')

        for (let template of findTemplates(templates)) {
            console.info(`running template ${template.id || template.path}`)

            await template.run({}, gGraph)

            const resultNodes = gGraph.selection.map(node => node.data())

            await handleOutputOptions(argv, resultNodes)
        }

        await handleWriteOptions(argv, gGraph)
    }
}
