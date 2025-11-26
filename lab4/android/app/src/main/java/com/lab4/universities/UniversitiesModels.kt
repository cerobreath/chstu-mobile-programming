package com.lab4.universities

import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.RoomDatabase
import androidx.room.Query as RoomQuery
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

@Entity(tableName = "universities")
data class UniversityEntity(
    @PrimaryKey val name: String,
    val country: String,
    @ColumnInfo(name = "alpha_two_code") val alphaTwoCode: String,
    @ColumnInfo(name = "web_pages") val webPages: String,
    val domains: String,
)

@Dao
interface UniversitiesDao {

    @RoomQuery("SELECT * FROM universities WHERE country = :country ORDER BY name")
    fun getByCountry(country: String): List<UniversityEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertAll(entities: List<UniversityEntity>)

    @RoomQuery("DELETE FROM universities WHERE country = :country")
    fun deleteByCountry(country: String)
}

@Database(
    entities = [UniversityEntity::class],
    version = 1,
    exportSchema = false,
)
abstract class UniversitiesDatabase : RoomDatabase() {
    abstract fun universitiesDao(): UniversitiesDao
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class UniversityDto(
    val name: String?,
    val country: String?,
    @JsonProperty("alpha_two_code")
    val alphaTwoCode: String?,
    @JsonProperty("web_pages")
    val webPages: List<String>?,
    val domains: List<String>?,
)

interface UniversitiesApi {
    @GET("search")
    fun searchUniversities(
        @Query("country") country: String,
    ): Call<List<UniversityDto>>
}

fun UniversityDto.toEntity(): UniversityEntity {
    val safeName = name ?: ""
    val safeCountry = country ?: ""
    val safeAlpha = alphaTwoCode ?: ""
    val wp = (webPages ?: emptyList()).joinToString(",")
    val dom = (domains ?: emptyList()).joinToString(",")

    return UniversityEntity(
        name = safeName,
        country = safeCountry,
        alphaTwoCode = safeAlpha,
        webPages = wp,
        domains = dom,
    )
}