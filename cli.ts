import { Command, type CommandArgs, type CommandOptions, ShellCommand, type ShellCommandOptions } from "@gnome/exec";
import { pathFinder } from "@gnome/exec/path-finder";
import { isAbsolute, resolve } from "@std/path";
import { makeTempFileSync, writeTextFileSync } from "@gnome/fs";

pathFinder.set("deno", {
    name: "deno",
    windows: [  
        "${UserProfile}\\.deno\\bin\\deno.exe",
        "${ChocolateyInstall}\\lib\\deno\\deno.exe",
        "${ALLUSERSPROFILE}\\chocolatey\\lib\\deno\\deno.exe",
    ],
    linux: [
        "${HOME}/.deno/bin/deno",
        "/usr/local/bin/deno",
    ],
});

/**
 * File extension for javascript.
 */
export const DENO_EXT = ".ts";

/**
 * Represents a Deno command.
 */
export class DenoCliCommand extends Command {
    /**
     * Creates a new instance of the `DenoCliCommand` class.
     * @param args The command arguments.
     * @param options The command options.
     */
    constructor(args?: CommandArgs, options?: CommandOptions) {
        super("deno", args, options);
    }
}

/**
 * Represents a Deno script or inline file executed using the `Deno` commandline.
 */
export class DenoShellCommand extends ShellCommand {
    /**
     * Creates a new instance of the `DenoShellCommand` class.
     * @param script The javascript to execute.
     * @param options The options for the Deno command.
     */
    constructor(script: string, options?: ShellCommandOptions) {
        super("deno", script.trimEnd(), options);
    }

    /**
     * Gets the file extension associated with Deno scripts.
     */
    get ext(): string {
        return DENO_EXT;
    }

    getScriptFile(): { file: string | undefined; generated: boolean } {
        let script = this.script.trimEnd();

        const exts = [".ts", ".js"];
        if (!script.match(/\n/) && exts.some((ext) => script.endsWith(ext))) {
            script = script.trimStart();
            if (!isAbsolute(script)) {
                script = resolve(script);
            }
            return { file: script, generated: false };
        }

        const ext = exts.find((ext) => script.endsWith(ext)) ?? ".ts";

        const file = makeTempFileSync({
            prefix: "script_",
            suffix: ext,
        });

        writeTextFileSync(file, script);

        return { file, generated: false };
    }

    /**
     * Gets the Deno arguments for executing the javascript.
     * @param script The javascript to execute.
     * @param isFile Specifies whether the script is a file or a command.
     * @returns The Deno arguments for executing the script.
     */
    // deno-lint-ignore no-unused-vars
    getShellArgs(script: string, isFile: boolean): string[] {
        const params = this.shellArgs ?? ["run", "-A", "--unstable-cron", "--unstable-worker-options", "--unstable-ffi", "--unstable-http", "--unstable-net",  "--unstable-fs", "--unstable-kv"];

        params.push(script);

        return params;
    }
}

/**
 * Executes the Deno command line using the DenoCliCommand class.
 *
 * @param args The command arguments.
 * @param options The command options.
 * @returns a new instance of the DenoCliCommand class.
 *
 * @example
 * ```ts
 * import { denoCli } from "@gnome/deno-cli";
 *
 * const result = await DenoCli("--version");
 * console.log(result.code);
 * console.log(result.text());
 * ```
 *
 * @example
 * ```ts
 * import { denoCli } from "@gnome/deno-cli";
 *
 * /// execute the Deno command and writes the version to stdout.
 * await denoCli(["--version"]).run();
 * ```
 */
export function denoCli(args?: CommandArgs, options?: CommandOptions): DenoCliCommand {
    return new DenoCliCommand(args, options);
}

/**
 * Executes a Deno inline script or script file using the DenoShellCommand class.
 *
 * @param script - The Deno script to execute.
 * @param options - Optional options for the Deno shell command.
 * @returns A new instance of the DenoShellCommand class.
 * @example
 * ```ts
 * import { deno } from "@gnome/deno-cli";
 * 
 * const result = await deno("console.log('Hello, World!');");
 * console.log(result.code);
 * console.log(result.text());
 * ```
 */
export function deno(script: string, options?: ShellCommandOptions): DenoShellCommand {
    return new DenoShellCommand(script, options);
}
