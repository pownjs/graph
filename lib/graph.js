const assert = require('assert')
const process = require('process')
const { EventEmitter } = require('events')

const { makeId } = require('./utils')
const { cytoscape } = require('./cytoscape')

class Graph extends EventEmitter {
    constructor(options) {
        super()

        this.reset(options)
    }

    reset(options) {
        const { cy, ...settings } = options

        if (cy) {
            this.cy = cy
        }
        else {
            this.cy = cytoscape({
                ...settings,

                headless: true
            })
        }

        this.selection = this.cy.collection()
    }

    elements() {
        if (this.selection && this.selection.length) {
            return this.selection.elements()
        }
        else {
            return this.cy.elements()
        }
    }

    serialize() {
        return this.cy.json()
    }

    deserialize(input) {
        this.cy.json(input)
    }

    add(nodes) {
        let collection = this.cy.collection()

        this.cy.startBatch()

        this.emit('barStart', 'Adding nodes', { total: nodes.length })

        nodes.forEach(({ id, type, label, props, edges = [], ...data }, index) => {
            this.emit('barStep', 'Adding nodes', { step: index })

            if (!id) {
                id = makeId(type, label)
            }

            let node = this.cy.getElementById(id)

            if (node.length) {
                let nodeData = node.data()

                try {
                    if (type) {
                        nodeData.type = type
                    }

                    if (label) {
                        nodeData.label = label
                    }

                    if (props) {
                        nodeData.props = { ...nodeData.props, ...props }
                    }

                    node.data({ ...nodeData, ...data })
                }
                catch (e) {
                    this.emit('error', e)

                    return
                }
            }
            else {
                if (process.env.NODE_ENV !== 'production') {
                    assert.ok(type, `Node type is not specified`)
                }

                try {
                    node = this.cy.add({
                        group: 'nodes',
                        data: {
                            ...data,

                            id,
                            type,
                            label,
                            props
                        }
                    })
                }
                catch (e) {
                    this.emit('internal-error', e)

                    return
                }
            }

            try {
                collection = collection.add(node)
            }
            catch (e) {
                this.emit('internal-error', e)

                return
            }

            edges.forEach((edge) => {
                let source
                let type
                let data

                if (typeof(edge) === 'string') {
                    source = edge
                    type = ''
                    data = {}
                }
                else {
                    source = edge.source || ''
                    type = edge.type || ''
                    data = edge
                }

                const target = id

                try {
                    const edgeElement = this.cy.add({
                        group: 'edges',
                        data: {
                            id: `edge:${type}:${source}:${target}`,
                            source: source,
                            target: target,

                            ...data
                        }
                    })

                    collection = collection.add(edgeElement)
                }
                catch (e) {
                    this.emit('internal-error', e)

                    return
                }
            })

            this.emit('barStep', 'Adding nodes', { step: index + 1 })
        })

        this.emit('barEnd', 'Adding nodes')

        this.cy.endBatch()

        return this.selection = collection.nodes()
    }

    remove(nodes) {
        this.cy.startBatch()

        this.emit('barStart', 'Removing nodes', { total: nodes.length })

        nodes.forEach((node, index) => {
            this.cy.getElementById(typeof(node) === 'string' ? node : node.id).remove()

            this.emit('barStep', 'Removing nodes', { step: index + 1 })
        })

        this.emit('barEnd', 'Removing nodes')

        this.cy.endBatch()
    }

    select(...expressions) {
        return this.selection = this.cy.nodes(expressions.join(','))
    }

    unselect() {
        return this.selection = this.cy.collection()
    }

    traverse(...expressions) {
        return this.selection = this.cy.traverse(expressions.join('|'))
    }

    untraverse() {
        return this.selection = this.cy.collection()
    }

    group(label, selection = this.selection) {
        const parentId = makeId('group', label)

        try {
            this.cy.add({
                data: {
                    id: parentId,
                    type: 'group',
                    label: label,
                    props: {}
                }
            })
        }
        catch (e) {
            this.emit('error', e)
        }

        const parents = selection.parent()

        selection.move({ parent: parentId })

        parents.forEach((parent) => {
            if (parent.isChildless()) {
                parent.remove()
            }
        })
    }

    ungroup(selection = this.selection) {
        const parents = selection.parent()

        selection.move({ parent: null })

        parents.forEach((parent) => {
            if (parent.isChildless()) {
                parent.remove()
            }
        })
    }

    measure(selection = this.selection) {
        selection.nodes().forEach((node) => {
            node.data('weight', node.connectedEdges().length)
        })
    }

    unmeasure(selection = this.selection) {
        selection.nodes().forEach((node) => {
            node.data('weight', 0)
        })
    }
}

module.exports = { Graph }
