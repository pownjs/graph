const { Bar } = require('@pown/cli/lib/bar')

const { Graph } = require('../../../../lib/graph')

const graph = new Graph()

graph.on('info', console.info.bind(console))
graph.on('warn', console.warn.bind(console))
graph.on('error', console.error.bind(console))
graph.on('debug', console.debug.bind(console))

// TODO: show internal-error

const bars = {}

graph.on('barStart', (name, { total = 0 }) => {
    if (total < 1000) {
        return
    }

    const bar = new Bar()

    bar.start(total, 0)

    bars[name] = bar
})

graph.on('barStep', (name, { step = 0 }) => {
    const bar = bars[name]

    if (!bar) {
        return
    }

    bar.update(step)
})

graph.on('barEnd', (name) => {
    const bar = bars[name]

    if (!bar) {
        return
    }

    bar.stop()

    delete bars[name]
})

module.exports = { graph }
