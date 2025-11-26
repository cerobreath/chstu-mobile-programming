package com.lab3a

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.Collections
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import org.json.JSONArray

class GalleryTasksModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private val executor: ExecutorService = Executors.newSingleThreadExecutor()

  override fun getName(): String = "GalleryTasks"

  /**
   * Завантажує рандомну сторінку Picsum і повертає масив елементів галереї
   * Виконується у потоці ExecutorService (фоновий потік)
   */
  @ReactMethod
  fun fetchRemoteGallery(limit: Int, promise: Promise) {
    executor.submit {
      try {
        val page = (1..10).random()
        val ts = System.currentTimeMillis()
        val urlStr =
          "https://picsum.photos/v2/list?page=$page&limit=$limit&ts=$ts"

        val url = URL(urlStr)
        val conn = (url.openConnection() as HttpURLConnection).apply {
          requestMethod = "GET"
          connectTimeout = 15000
          readTimeout = 15000
        }

        val code = conn.responseCode
        if (code != HttpURLConnection.HTTP_OK) {
          conn.disconnect()
          throw RuntimeException("HTTP $code from Picsum")
        }

        val sb = StringBuilder()
        BufferedReader(InputStreamReader(conn.inputStream)).use { reader ->
          var line: String? = reader.readLine()
          while (line != null) {
            sb.append(line)
            line = reader.readLine()
          }
        }
        conn.disconnect()

        val jsonArray = JSONArray(sb.toString())
        val list = mutableListOf<WritableMap>()

        for (i in 0 until jsonArray.length()) {
          val obj = jsonArray.getJSONObject(i)

          val map: WritableMap = Arguments.createMap()
          map.putString("id", obj.optString("id"))
          map.putString("author", obj.optString("author"))
          map.putInt("width", obj.optInt("width"))
          map.putInt("height", obj.optInt("height"))
          map.putString("url", obj.optString("url"))
          map.putString("download_url", obj.optString("download_url"))

          list.add(map)
        }

        // Рандомізація
        Collections.shuffle(list)

        val resultArray: WritableArray = Arguments.createArray()
        list.forEach { resultArray.pushMap(it) }

        promise.resolve(resultArray)
      } catch (e: Exception) {
        promise.reject("GALLERY_FETCH_ERROR", e.localizedMessage ?: "Unknown error", e)
      }
    }
  }

  override fun invalidate() {
    super.invalidate()
    executor.shutdownNow()
  }
}
