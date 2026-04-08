debug = true;
emergency_chat = "/g bozos <@450908675457024001>"

const File = Java.type("java.io.File");
const Files = Java.type("java.nio.file.Files");
const Paths = Java.type("java.nio.file.Paths");
const URL = Java.type("java.net.URL");
const StandardCopyOption = Java.type("java.nio.file.StandardCopyOption");
const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
const BufferedInputStream = Java.type("java.io.BufferedInputStream");
const BufferedOutputStream = Java.type("java.io.BufferedOutputStream");
const FileOutputStream = Java.type("java.io.FileOutputStream");

function deleteDir(file) {
    if (file.isDirectory()) {
        const files = file.listFiles()
        if (files) for (let f of files) deleteDir(f)
    }
    file.delete()
}

function get_path() {
    if (debug) return "."

    return Paths.get("").toAbsolutePath()
        .resolve("config")
        .resolve("jsMacros")
        .resolve("cache")
        .resolve("azora")
}

function load(loc) {
    return require(get_path() + File.separator + loc)
}

function readFileIfExists(path) {
    const f = path.toFile()
    if (!f.exists()) return null
    return new java.lang.String(
        Files.readAllBytes(path),
        java.nio.charset.StandardCharsets.UTF_8
    )
}

function reload_from_source() {
    if (debug) return;

    const api = `https://api.github.com/repos/Azora-Civ/macros/releases/latest`
    const connection = new URL(api).openConnection()
    connection.setRequestProperty("User-Agent", "JsMacros")

    const scanner = new java.util.Scanner(connection.getInputStream()).useDelimiter("\\A")
    const json = scanner.hasNext() ? scanner.next() : ""
    scanner.close()

    const release = JSON.parse(json)
    if (!release.zipball_url)
        throw "No release zipball found"

    const dir = get_path()
    Files.createDirectories(dir)
    const versionPath = dir.resolve("version.txt")
    const storedVersion = readFileIfExists(versionPath)
    const latestVersion = release.tag_name

    // 🔹 If same version → skip download
    if (storedVersion && storedVersion.trim() === latestVersion) {
        return
    }

    // 🔹 Clean old cache
    const dirFile = dir.toFile()
    if (dirFile.exists()) deleteDir(dirFile)
    Files.createDirectories(dir)

    const zipPath = dir.resolve("source.zip")

    const inStream = new URL(release.zipball_url).openStream()
    Files.copy(inStream, zipPath, StandardCopyOption.REPLACE_EXISTING)
    inStream.close()

    const zis = new ZipInputStream(new BufferedInputStream(Files.newInputStream(zipPath)));

    let entry;
    let rootFolder = null;

    while ((entry = zis.getNextEntry()) !== null) {
        const name = entry.getName();

        // detect root folder once
        if (!rootFolder)
            rootFolder = name.split("/")[0];

        // strip root folder from path
        let stripped = name.substring(rootFolder.length + 1);

        if (!stripped) continue; // skip empty root entry

        const outPath = dir.resolve(stripped);

        if (entry.isDirectory()) {
            Files.createDirectories(outPath);
        } else {
            Files.createDirectories(outPath.getParent());

            const out = new BufferedOutputStream(
                new FileOutputStream(outPath.toFile())
            );

            let b;
            while ((b = zis.read()) !== -1)
                out.write(b);

            out.close();
        }
    }

    zis.close();

    // save version
    Files.writeString(versionPath, latestVersion);
}

reload_from_source()
load("main.js")
