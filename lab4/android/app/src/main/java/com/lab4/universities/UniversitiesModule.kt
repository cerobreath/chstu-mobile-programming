package com.lab4.universities

import androidx.room.Room
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
import java.io.IOException
import java.util.concurrent.Executors

@ReactModule(name = UniversitiesModule.NAME)
class UniversitiesModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "UniversitiesModule"
    }

    private val executor = Executors.newSingleThreadExecutor()

    private val db: UniversitiesDatabase by lazy {
        Room.databaseBuilder(
            reactApplicationContext,
            UniversitiesDatabase::class.java,
            "universities.db",
        ).build()
    }

    private val api: UniversitiesApi by lazy {
        val client = OkHttpClient.Builder().build()
        val retrofit = Retrofit.Builder()
            .baseUrl("http://universities.hipolabs.com/")
            .client(client)
            .addConverterFactory(
                JacksonConverterFactory.create(
                    jacksonObjectMapper(),
                ),
            )
            .build()

        retrofit.create(UniversitiesApi::class.java)
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun loadUniversities(country: String, promise: Promise) {
        executor.execute {
            try {
                val dao = db.universitiesDao()
                var fromCache = false
                var networkError: Exception? = null

                try {
                    val resp = api.searchUniversities(country).execute()
                    if (resp.isSuccessful) {
                        val body = resp.body().orEmpty()
                        val entities = body.map { it.toEntity() }

                        db.runInTransaction {
                            dao.deleteByCountry(country)
                            dao.insertAll(entities)
                        }
                    } else {
                        throw IOException("HTTP ${resp.code()}")
                    }
                } catch (netError: Exception) {
                    fromCache = true
                    networkError = netError
                }

                val entities = dao.getByCountry(country)

                if (entities.isEmpty() && fromCache) {
                    UiThreadUtil.runOnUiThread {
                        promise.reject(
                            "UNIVERSITIES_ERROR",
                            networkError?.message ?: "No data (network+cache empty)",
                        )
                    }
                    return@execute
                }

                val arr = Arguments.createArray()
                for (e in entities) {
                    arr.pushMap(e.toWritableMap())
                }

                val result = Arguments.createMap().apply {
                    putString("source", if (fromCache) "cache" else "remote")
                    putArray("items", arr)
                }

                UiThreadUtil.runOnUiThread {
                    promise.resolve(result)
                }
            } catch (e: Exception) {
                UiThreadUtil.runOnUiThread {
                    promise.reject("UNIVERSITIES_ERROR", e.message, e)
                }
            }
        }
    }
}

fun UniversityEntity.toWritableMap(): WritableMap {
    val map = Arguments.createMap()
    map.putString("name", name)
    map.putString("country", country)
    map.putString("alphaTwoCode", alphaTwoCode)

    val webPagesArray = Arguments.createArray()
    if (webPages.isNotEmpty()) {
        webPages.split(",").forEach { webPagesArray.pushString(it) }
    }
    map.putArray("webPages", webPagesArray)

    val domainsArray = Arguments.createArray()
    if (domains.isNotEmpty()) {
        domains.split(",").forEach { domainsArray.pushString(it) }
    }
    map.putArray("domains", domainsArray)

    return map
}