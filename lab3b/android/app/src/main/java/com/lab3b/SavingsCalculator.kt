package com.lab3b

object SavingsCalculator {

    data class Result(
        val currency: String,
        val M: Double,
        val p: Double,
        val S_Y: Double,
        val S_C: Double,
        val W: Double,
        val S_H: Double,
        val S_L: Double,
        val H: Double,
        val R: Double,
        val monthlyRates: List<Double>,
    )

    /**
     * Повна копія нашого алгоритму з TypeScript:
     * - M, p, currency — як у JS
     * - cStart, cEnd   — C_START, C_END для обраної валюти
     */
    fun calculate(
        M: Double,
        p: Double,
        currency: String,
        cStart: Double,
        cEnd: Double,
    ): Result {
        val S_Y = 12.0 * M
        val S_C = p * S_Y

        // Інтерполяція курсів за місяцями
        val monthlyRates = mutableListOf<Double>()
        val delta = (cEnd - cStart) / 12.0
        for (i in 1..12) {
            val Ci = cStart + i * delta
            monthlyRates.add(Ci)
        }

        val monthlyPortion = p * M
        var W = 0.0
        for (Ci in monthlyRates) {
            W += monthlyPortion / Ci
        }

        val S_H = W * cEnd
        val S_L = S_Y - S_C
        val H = S_H + S_L
        val R = H - S_Y

        return Result(
            currency = currency,
            M = M,
            p = p,
            S_Y = S_Y,
            S_C = S_C,
            W = W,
            S_H = S_H,
            S_L = S_L,
            H = H,
            R = R,
            monthlyRates = monthlyRates,
        )
    }
}
