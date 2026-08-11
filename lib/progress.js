const progressStack = []
const WINDOW_SIZE = 20
const TRIMMED_SAMPLE_SIZE = 16

bot.on_repeat.set("progress", renderProgress)

module.exports = {
    init(total) {
        progressStack.push({
            current: 0,
            total,
            durations: [],
            lastIncrementAt: Date.now(),
        })
    },

    increment() {
        const progress = progressStack.at(-1)
        if (!progress) return

        const now = Date.now()
        const duration = now - progress.lastIncrementAt

        progress.current++
        progress.lastIncrementAt = now
        progress.durations.push(duration)

        if (progress.durations.length > WINDOW_SIZE) {
            progress.durations.shift()
        }

        if (progress.current >= progress.total) {
            this.finish()
        }
    },

    finish() {
        progressStack.pop()
    },

    clear() {
        progressStack.length = 0
    },
}

function renderProgress() {
    if (progressStack.length === 0) return

    const width = 20
    const ratio = getGlobalProgressRatio()
    const percentage = Math.floor(ratio * 100)

    const filled = Math.round(ratio * width)
    const bar = "█".repeat(filled).padEnd(width, "░")

    bot.ui.action_bar(`Progress: [${bar}] ${percentage}% | ${getGlobalEta()}`)
}

function getGlobalProgressRatio() {
    const active = progressStack.at(-1)

    let ratio = active.total > 0
        ? active.current / active.total
        : 0

    /*
     * Fold the active child's partial progress into each parent.
     *
     * Example:
     * outer: 2/8 completed
     * inner: 5/10 completed
     *
     * global = (2 + 0.5) / 8
     */
    for (let i = progressStack.length - 2; i >= 0; i--) {
        const parent = progressStack[i]

        if (parent.total <= 0) {
            ratio = 0
            continue
        }

        ratio = (parent.current + ratio) / parent.total
    }

    return Math.min(Math.max(ratio, 0), 1)
}

function getGlobalEta() {
    if (progressStack.length === 0) {
        return "ETA: --"
    }

    const root = progressStack[0]
    const active = progressStack.at(-1)

    // Number of active-level increments contained in one root-level unit.
    // Example: 8 -> 10 gives 10.
    // Example: 8 -> 10 -> 5 gives 50.
    let unitsPerRoot = 1
    for (let i = 1; i < progressStack.length; i++) {
        unitsPerRoot *= progressStack[i].total
    }

    const activeMsPerUnit = estimateMsPerUnit(active, true)
    const rootHistoricalMsPerUnit = estimateMsPerUnit(root, true)

    let rootMsPerUnit

    if (progressStack.length === 1) {
        rootMsPerUnit = rootHistoricalMsPerUnit
    } else if (rootHistoricalMsPerUnit != null) {
        // Completed outer iterations are the best estimate.
        rootMsPerUnit = rootHistoricalMsPerUnit
    } else if (activeMsPerUnit != null) {
        // Before the first outer iteration has completed, extrapolate
        // from the currently active inner progress.
        rootMsPerUnit = activeMsPerUnit * unitsPerRoot
    } else {
        return "ETA: --"
    }

    const ratio = getGlobalProgressRatio()

    // Convert the global nested ratio back to fractional root units.
    const completedRootUnits = ratio * root.total
    const remainingRootUnits = root.total - completedRootUnits

    let remainingMs = remainingRootUnits * rootMsPerUnit

    // Progress ratio only changes when increment() happens, so account
    // for time already spent working on the current inner unit.
    let currentUnitEstimate = activeMsPerUnit

    if (currentUnitEstimate == null && rootMsPerUnit != null) {
        currentUnitEstimate = rootMsPerUnit / unitsPerRoot
    }

    if (currentUnitEstimate != null) {
        const elapsed = Date.now() - active.lastIncrementAt
        remainingMs -= Math.min(elapsed, currentUnitEstimate)
    }

    return formatEta(Math.max(remainingMs, 0))
}

function estimateMsPerUnit(progress, removeOutliers) {
    let durations = progress.durations

    if (durations.length === 0) {
        return null
    }

    if (removeOutliers && durations.length >= WINDOW_SIZE) {
        durations = [...durations].sort((a, b) => a - b)

        const removeCount = Math.floor(
            (durations.length - TRIMMED_SAMPLE_SIZE) / 2
        )

        durations = durations.slice(
            removeCount,
            durations.length - removeCount
        )
    }

    return durations.reduce((sum, duration) => sum + duration, 0)
        / durations.length
}

function formatEta(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `ETA: ${hours}h ${minutes}m ${seconds}s`
    }

    return `ETA: ${minutes}m ${seconds}s`
}
