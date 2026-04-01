let progress_data = {
    current: 0,
    total: 0,
    times: [],   // timestamps of recent increments
    window: 20   // N
}

bot_state.on_repeat.set("progress", progress)

exports.progress = {
    init(total) {
        progress_data.total = total;
        progress_data.current = 0;
    },

    increment() {
        const now = Date.now()
        progress_data.times.push(now)

        if (progress_data.times.length > progress_data.window)
            progress_data.times.shift()

        progress_data.current++
    }
}

function progress() {
    const { current, total, times } = progress_data
    const width = 20

    if (current == null || total == null || total <= 0) return

    const ratio = Math.min(1, current / total)
    const pct = Math.floor(ratio * 100)

    const filled = Math.round(ratio * width)
    const bar = "█".repeat(filled).padEnd(width, "░")

    let etaStr = "ETA: --"
    if (times.length >= 2) {
        const dt = times[times.length - 1] - times[0]
        const units = times.length - 1

        if (dt > 0) {
            const msPerUnit = dt / units
            const remainingMs = msPerUnit * (total - current)

            const min = Math.floor(remainingMs / 60000)
            const sec = Math.floor((remainingMs / 1000) % 60)
            etaStr = `ETA: ${min}m ${sec}s`
        }
    }

    Chat.actionbar(`Progress: [${bar}] ${pct}% | ${etaStr}`)
}