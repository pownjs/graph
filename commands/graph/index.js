exports.yargs = {
    command: 'graph <command>',
    describe: 'Graph manipulation toolkit',

    builder: (yargs) => {
        yargs.command(require('./sub/template').yargs)
        yargs.command(require('./sub/select').yargs)
        yargs.command(require('./sub/traverse').yargs)
        yargs.command(require('./sub/add').yargs)
        yargs.command(require('./sub/remove').yargs)
        yargs.command(require('./sub/edit').yargs)
        yargs.command(require('./sub/merge').yargs)
        yargs.command(require('./sub/diff').yargs)
        yargs.command(require('./sub/group').yargs)
        yargs.command(require('./sub/ungroup').yargs)
        yargs.command(require('./sub/load').yargs)
        yargs.command(require('./sub/save').yargs)
        yargs.command(require('./sub/import').yargs)
        yargs.command(require('./sub/export').yargs)
        yargs.command(require('./sub/layout').yargs)
        yargs.command(require('./sub/summary').yargs)
        yargs.command(require('./sub/exec').yargs)
    }
}
