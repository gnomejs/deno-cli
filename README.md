# @gnome/deno-cli

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `deno-cli` module provides a simple way to execute
inline Javascript or JavaScript files with deno.

The module relies upon the @gnome/exec module and
has the same basic usage as the `Command` and `ShellCommand` class.

## Basic Usage

```typescript
import { deno } from "@gnome/deno-cli";
 
const cmd = deno("console.log('Hello, World!');");
 
// execute the node command and writes "Hello, World!" to stdout.
await cmd.run();
 
// run a script and writes output to stdout and stderr.
await deno("./test.js").run();
 
const r = await deno("console.log('Hello, World!');");
console.log(r.code);
console.log(r.text());
```

[MIT License](./LICENSE.md)
