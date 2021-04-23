const installReadOptions = (yargs) => {
    yargs.option('read', {
        alias: 'r',
        type: 'string',
        description: 'Read file'
    })
}

const installWriteOptions = (yargs) => {
    yargs.option('write', {
        alias: 'w',
        type: 'string',
        description: 'Write file'
    })
}

const handleReadOptions = async(argv, graph) => {
    const { read } = argv

    if (!read) {
        return
    }

    console.warn(`reading from file ${read}`)

    const { readFile } = require('@pown/file/lib/file') // TODO: remove and use fs instead

    let data

    try {
        data = await readFile(read)
    }
    catch (e) {
        console.error(`Cannot read file ${read}`)

        return
    }

    console.debug(`read ${data.length} bytes`)

    let json

    try {
        json = JSON.parse(data.toString())
    }
    catch (e) {
        console.error(`Cannot deserialize graph data`)

        return
    }

    try {
        graph.deserialize(json)
    }
    catch (e) {
        console.error(`Cannot load graph data`)
    }
}

const handleWriteOptions = async(argv, graph) => {
    const { write } = argv

    if (!write) {
        return
    }

    console.warn(`writing to file ${write}`)

    const { writeFile } = require('@pown/file/lib/file') // TODO: remove and use fs instead

    let json

    try {
        json = graph.serialize()
    }
    catch (e) {
        console.error(`Cannot save graph data`)

        return
    }

    let data

    try {
        data = JSON.stringify(json)
    }
    catch (e) {
        console.error(`Cannot serialize graph data`)

        return
    }

    if (data) {
        try {
            await writeFile(write, data)
        }
        catch (e) {
            console.error(`Cannot write file ${write}`)

            return
        }
    }

    console.debug(`wrote ${data.length} bytes`)
}

module.exports = { installReadOptions, installWriteOptions, handleReadOptions, handleWriteOptions }
