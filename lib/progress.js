const progressStack = []
const WINDOW_SIZE = 20
const TRIMMED_SAMPLE_SIZE = 16

bot_state.on_repeat.set("progress", renderProgress)

exports.progress = {
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
    },

    finish() {
        const progress = progressStack.pop()
        if (!progress) return

        // Finishing a nested task completes one unit of its parent.
        if (progressStack.length > 0) {
            this.increment()
        }
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

    Chat.actionbar(
        `Progress: [${bar}] ${percentage}% | ${getGlobalEta()}`
    )
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
    const active = progressStack.at(-1)
    const activeMsPerUnit = estimateMsPerUnit(active, true)

    if (activeMsPerUnit == null) {
        return "ETA: --"
    }

    const now = Date.now()
    const elapsedCurrentUnit = now - active.lastIncrementAt

    let remainingMs =
        activeMsPerUnit * Math.max(active.total - active.current, 0)

    remainingMs -= Math.min(elapsedCurrentUnit, activeMsPerUnit)
    remainingMs = Math.max(remainingMs, 0)

    /*
     * Estimated duration of one complete unit in the parent.
     * Initially, this is the estimated total duration of the active scope.
     */
    let childTotalEstimate = activeMsPerUnit * active.total

    for (let i = progressStack.length - 2; i >= 0; i--) {
        const parent = progressStack[i]

        /*
         * Prefer durations from previously completed children.
         * Before any child has completed, use the active child's estimate.
         */
        const parentMsPerUnit =
            estimateMsPerUnit(parent, false) ?? childTotalEstimate

        /*
         * The currently active child is already represented by remainingMs,
         * so only add the children that come after it.
         */
        const laterUnits = Math.max(
            parent.total - parent.current - 1,
            0
        )

        remainingMs += parentMsPerUnit * laterUnits

        // Used as fallback for the next parent outward.
        childTotalEstimate = parentMsPerUnit * parent.total
    }

    return formatEta(remainingMs)
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
