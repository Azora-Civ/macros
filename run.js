/*
 * Info: This is Azora's JsMacros script that runs any Azoran farm (and more).
 * Source: https://github.com/Azora-Civ/macros
 * Author(s): borito185
 */

// ===== Settings =====
debug = true;
do_discord_pings = true; // only for registered Azorans
// ===== Settings =====

update_from_source("Azora-Civ/macros")
start("main.js")


function get_path() {
    const Paths = Java.type("java.nio.file.Paths");
    return debug
        ? Paths.get(".")
        : Paths.get("config", "jsMacros", "cache", "azora").toAbsolutePath()
}

function start(loc) {
    return require(get_path().resolve(loc).toString())
}

function read(path) {
    const Files = Java.type("java.nio.file.Files");
    return path.toFile().exists() ? Files.readString(path) : null
}

function remove_old(file) {
    if (file.isDirectory())
        file.listFiles()?.forEach(remove_old)
    file.delete()
}

function update_from_source(repo) {
    if (debug) return

    // Connect to github and fetch latest release
    const URL = Java.type("java.net.URL");
    const connection = new URL(
        `https://api.github.com/repos/${repo}/releases/latest`
    ).openConnection()
    connection.setRequestProperty("User-Agent", "JsMacros")
    const release = JSON.parse(
        new java.util.Scanner(connection.getInputStream())
            .useDelimiter("\\A")
            .next()
    )

    // compare latest with local version
    const dir = get_path()
    const version = dir.resolve("version.txt")
    if (read(version)?.trim() === release.tag_name)
        return


    const StandardCopyOption = Java.type("java.nio.file.StandardCopyOption");
    const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
    const Files = Java.type("java.nio.file.Files");

    // remove old version
    remove_old(dir.toFile())

    // download new version as zip
    Files.createDirectories(dir)
    const zip = dir.resolve("source.zip")
    const input = new URL(release.zipball_url).openStream()
    Files.copy(input, zip, StandardCopyOption.REPLACE_EXISTING)
    input.close()

    // unpack zip
    const zis = new ZipInputStream(Files.newInputStream(zip))
    let entry, root
    while ((entry = zis.getNextEntry()) !== null) {
        root ??= entry.getName().split("/")[0]

        const name = entry.getName().substring(root.length + 1)
        if (!name) continue

        const out = dir.resolve(name)

        if (entry.isDirectory()) {
            Files.createDirectories(out)
            continue
        }

        Files.createDirectories(out.getParent())
        Files.copy(zis, out, StandardCopyOption.REPLACE_EXISTING)
    }
    zis.close()

    // write new version identifier
    Files.writeString(version, release.tag_name)
}
