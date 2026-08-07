const Deflater = Java.type("java.util.zip.Deflater");
const Inflater = Java.type("java.util.zip.Inflater");
const ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
const StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
const Base64 = Java.type("java.util.Base64");
const ByteBuffer = Java.type("java.nio.ByteBuffer");

const RESPONSE_WAIT_MS = 1200;
const COMMAND_COOLDOWN_MS = 1000;

// Adjust this if membership names can contain unusual characters.
const MEMBER_REGEX = /^(\S+)\s+\(([^)]+)\)$/;

function utf8Bytes(text) {
    const buffer = StandardCharsets.UTF_8.encode(String(text));
    const bytes = Java.type("java.lang.reflect.Array")
        .newInstance(Java.type("java.lang.Byte").TYPE, buffer.remaining());

    buffer.get(bytes);
    return bytes;
}

function bytesToUtf8(bytes) {
    return String(
        StandardCharsets.UTF_8.decode(ByteBuffer.wrap(bytes))
    );
}

function deflateText(text) {
    const input = utf8Bytes(text);

    const deflater = new Deflater(Deflater.BEST_COMPRESSION);
    deflater.setInput(input);
    deflater.finish();

    const output = new ByteArrayOutputStream();
    const buffer = Java.type("java.lang.reflect.Array")
        .newInstance(Java.type("java.lang.Byte").TYPE, 1024);

    while (!deflater.finished()) {
        const count = deflater.deflate(buffer);
        output.write(buffer, 0, count);
    }

    deflater.end();

    return Base64.getEncoder().encodeToString(output.toByteArray());
}

function inflateText(encoded) {
    const compressed = Base64.getDecoder().decode(encoded.trim());

    const inflater = new Inflater();
    inflater.setInput(compressed);

    const output = new ByteArrayOutputStream();
    const buffer = Java.to(new Array(1024).fill(0), "byte[]");

    try {
        while (!inflater.finished()) {
            const count = inflater.inflate(buffer);

            if (count > 0) {
                output.write(buffer, 0, count);
                continue;
            }

            if (inflater.needsDictionary()) {
                throw new Error("Compressed input requires a dictionary.");
            }

            if (inflater.needsInput()) {
                throw new Error("Compressed input ended unexpectedly.");
            }
        }
    } finally {
        inflater.end();
    }

    return bytesToUtf8(output.toByteArray());
}

function getCurrentTick() {
    const lines = Chat.getHistory().getRecvLines();

    if (lines.length === 0) {
        return -1;
    }

    return lines[0].getCreationTick();
}

function getMembersReceivedAfter(startTick) {
    const result = [];

    for (const line of Chat.getHistory().getRecvLines()) {
        if (line.getCreationTick() <= startTick) {
            continue;
        }

        const text = String(line.getText().getString()).trim();
        const match = MEMBER_REGEX.exec(text);

        if (!match) {
            continue;
        }

        result.push({
            name: match[1],
            membership: match[2]
        });
    }

    return result;
}

function parseSearch(text) {
    const match = /^\/search:\s*(.*)$/s.exec(text.trim());

    if (!match) {
        throw new Error(
            'Decompressed clipboard must have the form "/search:name1 name2".'
        );
    }

    return match[1]
        .trim()
        .split(/\s+/)
        .filter(name => name.length > 0);
}

function serializeMemberships(memberships) {
    /*
     * Compact textual representation:
     *
     * namelayer<TAB>name<TAB>membership
     *
     * One membership per line. This text is then deflated and Base64 encoded.
     */
    return memberships
        .map(entry =>
            `${entry.namelayer}\t${entry.name}\t${entry.membership}`
        )
        .join("\n");
}

function main() {
    const compressedInput = String(Client.getClipboard());
    const input = inflateText(compressedInput);
    const namelayers = parseSearch(input);

    const memberships = [];

    for (const namelayer of namelayers) {
        /*
         * Capture the newest existing tick before issuing the command.
         * Consequently, only lines received after this point are considered.
         */
        const startTick = getCurrentTick();


        Chat.say(`/nllm ${namelayer}`);
        Time.sleep(RESPONSE_WAIT_MS);

        const members = getMembersReceivedAfter(startTick);

        for (const member of members) {
            memberships.push({
                namelayer,
                name: member.name,
                membership: member.membership
            });
        }

        Time.sleep(COMMAND_COOLDOWN_MS);
    }

    const output = serializeMemberships(memberships);
    Client.setClipboard(deflateText(output));

    Chat.log(
        `Exported ${memberships.length} memberships from ` +
        `${namelayers.length} namelayers to the clipboard.`
    );
}


module.exports = function() {
    try {
        main();
    } catch (error) {
        Chat.log(`§cNameLayer export failed: ${error}`);
    }
}
