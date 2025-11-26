// android/app/src/main/java/com/lab3b/SavingsExecutorModule.kt
package com.lab3b

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class SavingsExecutorModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val executor: ExecutorService = Executors.newSingleThreadExecutor()

    override fun getName(): String = "SavingsExecutor"

    @ReactMethod
    fun calculateSavings(
        M: Double,
        p: Double,
        currency: String,
        cStart: Double,
        cEnd: Double,
        promise: Promise
    ) {
        executor.submit {
            try {
                val result = SavingsCalculator.calculate(M, p, currency, cStart, cEnd)

                val map: WritableMap = Arguments.createMap()
                map.putString("currency", result.currency)
                map.putDouble("M", result.M)
                map.putDouble("p", result.p)
                map.putDouble("S_Y", result.S_Y)
                map.putDouble("S_C", result.S_C)
                map.putDouble("W", result.W)
                map.putDouble("S_H", result.S_H)
                map.putDouble("S_L", result.S_L)
                map.putDouble("H", result.H)
                map.putDouble("R", result.R)

                val ratesArray: WritableArray = Arguments.createArray()
                result.monthlyRates.forEach { rate ->
                    ratesArray.pushDouble(rate)
                }
                map.putArray("monthlyRates", ratesArray)

                promise.resolve(map)
            } catch (e: Exception) {
                promise.reject("CALC_ERROR", e.localizedMessage ?: "Unknown error", e)
            }
        }
    }

    override fun invalidate() {
        super.invalidate()
        executor.shutdownNow()
    }
}
