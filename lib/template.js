const deepmerge = require('deepmerge')
const { Template } = require('@pown/engine/lib/template')

class GraphTemplate extends Template {
    async runTask(taskName, task, input = {}, template, nodes, ...args) {
        const { select, traverse, ...data } = await this.getTaskDefinition(task)

        if (select) {
            nodes = template.select(select)
        }
        else
        if (traverse) {
            nodes = template.traverse(traverse)
        }
        else {
            nodes = nodes || template.selection
        }

        if (nodes && nodes.length) {
            if (['add'].includes(taskName)) {
                nodes = await Promise.all(nodes.map(async(node) => {
                    const nodeData = node.data()

                    if (await this.matchWithTask(task, nodeData)) {
                        const extract = await this.extractWithTask(task, nodeData)

                        const { id, type, label, props = {} } = deepmerge(extract, data)

                        return { id: id ? id : `${type}:${label}`, type, label, props, edges: [nodeData.id] }
                    }
                }))

                nodes = nodes.filter(node => node)

                template.addNodes(nodes)
            }
            else
            if (['remove'].includes(taskName)) {
                nodes = await Promise.all(nodes.map(async(node) => {
                    const nodeData = node.data()

                    if (await this.matchWithTask(task, nodeData)) {
                        return { id: nodeData.id }
                    }
                }))

                nodes = nodes.filter(node => node)

                template.removeNodes(nodes)
            }
        }

        return { id: task.id, name: taskName, result: {}, input, matches: true, extracts: {}, output: {} }
    }

    async * runTaskSetIt(taskName, tasks, input = {}, template, ...args) {
        if (['op', 'ops', 'operation', 'operations'].includes(taskName)) {
            for (let task of tasks) {
                yield* this.runTaskDefinitionsIt(task, input, template, ...args)
            }
        }
        else
        if (['select', 'selection'].includes(taskName)) {
            for (let task of tasks) {
                const { selection, select = selection, ...rest } = task

                const nodes = template.select(select)

                yield* super.runTaskDefinitionsIt(rest, input, template, nodes, ...args)
            }
        }
        else
        if (['traverse', 'traversal'].includes(taskName)) {
            for (let task of tasks) {
                const { traversal, traverse = traversal, ...rest } = task

                const nodes = template.traverse(traverse)

                yield* super.runTaskDefinitionsIt(rest, input, template, nodes, ...args)
            }
        }
        else {
            yield* super.runTaskSetIt(taskName, tasks, input, template, ...args)
        }
    }
}

module.exports = { GraphTemplate }
