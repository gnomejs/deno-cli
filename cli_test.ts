import { deno, denoCli } from "./cli.ts";
import { remove, writeTextFile } from "@gnome/fs";
import { assert as ok, assertEquals as equals } from "jsr:@std/assert@0.225.3";

Deno.test("deno", async () => {
    const result = await deno("console.log('Hello, World!');");
    equals(await result.text(), `Hello, World!\n`);
    equals(result.code, 0);
});

Deno.test("denoCli", async () => {
    const result = await denoCli("--version");
    equals(result.code, 0);
    ok(result.text().startsWith("deno"));
});

Deno.test("files", async () => {
    const script = `console.log('Hello, World!');`;
    await writeTextFile("test.js", script);
    await writeTextFile("test.ts", script);


    try {
        const result = await deno("test.js");
        equals(await result.text(), `Hello, World!\n`);
        equals(result.code, 0);

        const result2 = await deno("test.ts");
        equals(await result2.text(), `Hello, World!\n`);
        equals(result2.code, 0);
    } finally {
        await remove("test.js");
        await remove("test.ts");
    }
});
