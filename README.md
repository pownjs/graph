[![License](https://img.shields.io/badge/license-MIT-_red.svg)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/release/projectdiscovery/naabu)](https://github.com/projectdiscovery/naabu/releases)
[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/@pown/graph.svg)](https://www.npmjs.com/package/@pown/graph)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/git/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Graph

Graph is a library and utility to work with graphs. It powers other tools such as PownJS [Graph](https://github.com/pownjs/recon).

## Credits

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

> **NB**: Graph is the result of an almost direct copy of SecApps' excellent [Graph](https://recon.secapps.com) tool.

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown) but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Invoke directly from Pown:

```sh
$ pown graph
```

Otherwise, install this module locally from the root of your project:

```sh
$ npm install @pown/graph --save
```

Once done, invoke pown cli:

```sh
$ POWN_ROOT=. ./node_modules/.bin/pown-cli graph
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown graph
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown-cli graph <command>

Target graph

Commands:
  pown-cli graph template <command>             Graph template commands  [aliases: p, templates]
  pown-cli graph select <expressions...>        Select nodes  [aliases: s]
  pown-cli graph traverse <expressions...>      Traverse nodes  [aliases: v]
  pown-cli graph add <nodes...>                 Add nodes  [aliases: a]
  pown-cli graph remove <expressions...>        Remove nodes  [aliases: r]
  pown-cli graph edit <expressions...>          Edit nodes  [aliases: e]
  pown-cli graph merge <files...>               Perform a merge between at least two graph files  [aliases: m]
  pown-cli graph diff <fileA> <fileB>           Perform a diff between two graph files  [aliases: d]
  pown-cli graph group <name> <expressions...>  Group nodes  [aliases: g]
  pown-cli graph ungroup <expressions...>       Ungroup nodes  [aliases: u]
  pown-cli graph load <file>                    Load a file  [aliases: l]
  pown-cli graph save <file>                    Save to file  [aliases: o]
  pown-cli graph import <file>                  Import file  [aliases: i]
  pown-cli graph export <file>                  Export to file  [aliases: x]
  pown-cli graph layout <name>                  Layout the graph  [aliases: k]
  pown-cli graph summary                        Create a summary  [aliases: y]
  pown-cli graph exec <files...>                Execute js file  [aliases: c]

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Selectors

> Some commands expect graph selectors. The rest of the documentation is copy of cytoscape.js selectors manual with some minor differences.

A selector functions similar to a CSS selector on DOM elements, but selectors in Graph instead work on collections of graph elements. This mechanism is provided by the powerful cytoscape.js.

The selectors can be combined together to make powerful queries, for example:

```
pown graph select 'node[weight >= 50][height < 180]'
```

Selectors can be joined together (effectively creating a logical OR) with commas:

```
pown graph select 'node#j, edge[source = "j"]'
```

It is important to note that strings need to be enclosed by quotation marks:

```
pown graph select 'node[type = "domain"]'
```

Note that metacharacters `( ^ $ \ / ( ) | ? + * [ ] { } , . )` need to be escaped:

pown graph select '#some\\$funky\\@id'

### Group, class, & ID

* `node`, `edge`, or `*` (group selector) Matches elements based on group (node for nodes, edge for edges, * for all).
* `.className` Matches elements that have the specified class (e.g. use .foo for a class named "foo").
* The `#id` Matches element with the matching ID (e.g. `#foo` is the same as `[id = 'foo']`)

### Data

* `[name]` Matches elements if they have the specified data attribute defined, i.e. not undefined (e.g. `[foo]` for an attribute named “foo”). Here, null is considered a defined value.
* `[^name]` Matches elements if the specified data attribute is not defined, i.e. undefined (e.g `[^foo]`). Here, null is considered a defined value.
* `[?name]` Matches elements if the specified data attribute is a truthy value (e.g. `[?foo]`).
* `[!name]` Matches elements if the specified data attribute is a falsey value (e.g. `[!foo]`).
* `[name = value]` Matches elements if their data attribute matches a specified value (e.g. `[foo = 'bar']` or `[num = 2]`).
* `[name != value]` Matches elements if their data attribute doesn’t match a specified value (e.g. `[foo != 'bar']` or `[num != 2]`).
* `[name > value]` Matches elements if their data attribute is greater than a specified value (e.g. `[foo > 'bar']` or `[num > 2]`).
* `[name >= value]` Matches elements if their data attribute is greater than or equal to a specified value (e.g. `[foo >= 'bar']` or `[num >= 2]`).
* `[name < value]` Matches elements if their data attribute is less than a specified value (e.g. `[foo < 'bar']` or `[num < 2]`).
* `[name <= value]` Matches elements if their data attribute is less than or equal to a specified value (e.g. `[foo <= 'bar']` or `[num <= 2]`).
* `[name *= value]` Matches elements if their data attribute contains the specified value as a substring (e.g. `[foo *= 'bar']`).
* `[name ^= value]` Matches elements if their data attribute starts with the specified value (e.g. `[foo ^= 'bar']`).
* `[name $= value]` Matches elements if their data attribute ends with the specified value (e.g. `[foo $= 'bar']`).
* `@` (data attribute operator modifier) Prepended to an operator so that is case insensitive (e.g. `[foo @$= 'ar']`, `[foo @>= 'a']`, `[foo @= 'bar']`)
* `!` (data attribute operator modifier) Prepended to an operator so that it is negated (e.g. `[foo !$= 'ar']`, `[foo !>= 'a']`)
* `[[]]` (metadata brackets) Use double square brackets in place of square ones to match against metadata instead of data (e.g. `[[degree > 2]]` matches elements of degree greater than 2). The properties that are supported include `degree`, `indegree`, and `outdegree`.

### Compound nodes

* `>` (child selector) Matches direct children of the parent node (e.g. `node > node`).
* ` ` (descendant selector) Matches descendants of the parent node (e.g. `node node`).
* `$` (subject selector) Sets the subject of the selector (e.g. `$node > node` to select the parent nodes instead of the children).
