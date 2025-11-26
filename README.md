# Programming of Mobile Devices – React Native Labs

This repository contains **all laboratory works** for the course **“Programming of Mobile Devices”** at **Chernihiv Polytechnic National University**, specialty **123 “Computer Engineering”**.

The goal of the repository is to collect every lab assignment for the course in one place, using a **modern React Native + TypeScript** stack instead of only classic Java/Kotlin Android.

> Each lab lives in its own folder: `lab1/`, `lab2a/`, `lab2b/`, `lab3a/`, `lab3b/`, `lab4/`, etc.

## Lab overview

### Lab 1 – Intro & basic mobile tasks

Folder: `lab1/`

Lab 1 focuses on:
* setting up the React Native environment;
* building a small multi-screen mobile app;
* implementing:
  * a **Hello World** screen;
  * a **variant generator** (lab number based on student data);
  * a **calculation task** with simple business logic.

It also experiments with a **text-only ASCII-style UI** (monospace fonts, box drawing, cats, moon/sun theme toggle) while keeping the navigation and logic clean and modular.

### Lab 2a – Random Gallery (services, background updates & notifications)

Folder: `lab2a/`

Task: **“Random Gallery”** Android app that loads photos from a remote gallery, lets the user browse them, and checks for gallery updates.

Main features:

1. **Two screens**
   * **Gallery screen** – grid of thumbnail images.
   * **Photo screen** – full photo view with meta info and download button.

2. **Background gallery updates**
   * Scheduled background job using `react-native-background-fetch`.
   * Updates are allowed **only on unmetered networks (Wi-Fi)** using `@react-native-community/netinfo`.
   * While the new gallery is being fetched, the user can still browse the old one.
   * After a successful update, the gallery screen automatically refreshes.

3. **Notifications & BOOT_COMPLETED**
   * On app start, the gallery is checked for updates.
   * If updates are available, the user gets a **notification** with an action to start the update (`@notifee/react-native`).
   * On **system boot** (`BOOT_COMPLETED`), a native **`BootCompletedReceiver` (Kotlin)** shows a notification that suggests checking for gallery updates.  
     If the user agrees, the app runs an update check in the background and shows a **Toast** “Доступні оновлення галереї” (“Gallery updates available”) if updates exist.

4. **Local cache & downloading**
   * Gallery metadata is cached using `@react-native-async-storage/async-storage`.
   * Image files are downloaded via `react-native-fs` and saved to the system gallery with `@react-native-camera-roll/camera-roll`.
   * The download screen shows **progress in percent** with a progress bar.

5. **Navigation**
   * Navigation is built with **React Navigation** (`@react-navigation/native` + `@react-navigation/native-stack`), acting as an analogue of Android fragments.

### Lab 2b – Savings in Foreign Currency (services, observer pattern, LaTeX)

Folder: `lab2b/`

Task: extend the “savings in foreign currency” app so that savings are calculated via a service (IntentService in the original Java/Kotlin version) and currency rates are loaded from a text file when the network is unavailable. Communication with the service uses the **Observer pattern**.

React Native implementation:

* **Multi-step flow**
  * **Intro screen** – explanation of the task and formulas.
  * **Step 1** – input monthly income and percentage of income to convert.
  * **Step 2** – choose the target currency (USD / EUR) and see current rates.
  * **Result screen** – detailed breakdown of all formulas and numeric results.

* **Currency rates**
  * When there is Internet access, the app loads USD/EUR rates from the **NBU API** (National Bank of Ukraine).
  * If the NBU endpoint is not available, the app falls back to a **local JSON file** and finally to built-in fallback values.

* **Observer-like communication**
  * A “service” layer (in TypeScript) encapsulates the calculation logic and exposes events.
  * UI screens subscribe to these events to react to calculation completion, simulating an IntentService + Observer pattern on the React Native side.

* **Math rendering**
  * The result screen shows **formula derivations** and final values using LaTeX via `react-native-mathjax-html-to-svg`.
  * Each step is displayed as:
    * title (step name);
    * LaTeX formula with substituted values;
    * final numeric result.

* **Navigation & UI**
  * Built with React Navigation (stack-based, analogue of Activities).
  * UI based on **React Native Paper** (buttons, cards, typography).

### Lab 3a – Random Gallery (threads instead of services)

Folder: `lab3a/`

Task: modify the **Random Gallery** from Lab 2a so that **all asynchronous operations are executed in threads, not services**.

Key changes:

* **Native module with `ExecutorService`**
  * The heavy part of the gallery logic is moved into a Kotlin native module, e.g. `GalleryTasks`.
  * The module uses **`ExecutorService`** to run:
    * HTTP requests to the Picsum API;
    * randomization / paging logic.
  * React Native calls this module via the bridge and only receives the already prepared list of `GalleryItem` objects.

* **React Native side**
  * The rest of the architecture from Lab 2a is preserved:
    * React Native Paper UI;
    * React Navigation;
    * local gallery cache in `AsyncStorage`;
    * downloads via `react-native-fs` + `@react-native-camera-roll/camera-roll`;
    * notifications via Notifee;
    * BOOT_COMPLETED receiver in Kotlin.
  * The important difference is that **time-consuming work is handled in native threads**, not inside JS background services.

As a result, Lab 3a satisfies the requirement “all async operations are executed in threads” while keeping the user-facing app behaviour from Lab 2a.

### Lab 3b – Savings in Foreign Currency (ExecutorService-based calculations)

Folder: `lab3b/`

Task: modify the savings app from Lab 2b so that **all savings calculations run using `ExecutorService` threads**.

Implementation details:

* **Kotlin module for calculations**
  * A native module (e.g. `SavingsExecutorModule`) is implemented in Kotlin.
  * It uses **`ExecutorService`** to:
    * perform all financial calculations (yearly income, exchanged amount, purchased foreign currency, final balance, savings `R`);
    * fetch rates from the NBU API if needed;
    * fall back to local file and built-in defaults.

* **React Native bridge**
  * The JS/TS side no longer computes savings itself.
  * Instead, it calls a single method on the native module and receives a `SavingsResult` object with all fields:
    * `M`, `p`, `S_Y`, `S_C`, `W`, `S_H`, `S_L`, `H`, `R`, monthly rates, etc.

* **UI & formulas**
  * Same multi-step flow as in Lab 2b (Intro → Step 1 → Step 2 → Result).
  * Result screen shows formulas and intermediate steps using **LaTeX** (`react-native-mathjax-html-to-svg`) structured into blocks:
    * step title;
    * formula with values;
    * human-readable result.

This lab demonstrates how to move “business logic + network I/O” into **native multithreaded code** while keeping the React Native UI.

### Lab 4 – Open Data Universities (Retrofit + Jackson + Room + MVVM-style React Native)

Folder: `lab4/`

Task: develop an Android app that works with an **open data REST API**, fetches JSON via OkHttp/Retrofit, caches data in a local database, and shows a **two-screen UI** (list + details).

API:

* Open Data: **List of universities in the United Kingdom**  
* Docs: <https://github.com/Hipo/university-domains-list>  
* Endpoint: `GET http://universities.hipolabs.com/search` (filtered by `country`)

#### Native (Kotlin) data layer

* **HTTP & JSON**
  * Uses **OkHttp 5.3.2** and **Retrofit 3.0.0**.
  * JSON serialization/deserialization via **Jackson**:
    * `jackson-module-kotlin`
    * `jackson-core`
    * `jackson-databind`
    * `jackson-annotations`

* **Room database**
  * Entity: `UniversityEntity` (name, country, alphaTwoCode, webPages, domains).
  * DAO: `UniversitiesDao` with methods:
    * `getByCountry(country: String)`
    * `insertAll(entities: List<UniversityEntity>)`
    * `deleteByCountry(country: String)`
  * DB: `UniversitiesDatabase` (Room).

* **Native module**
  * `UniversitiesModule` exposes a single method:
    ```kotlin
    @ReactMethod
    fun loadUniversities(country: String, promise: Promise)
    ```
  * Inside `loadUniversities`:
    * runs on a background thread via **`ExecutorService`**;
    * tries to fetch universities from the remote API;
    * if successful, updates Room inside a transaction;
    * if the network fails, reads from Room cache;
    * returns a JS object:
      ```ts
      {
        source: 'remote' | 'cache';
        items: University[];
      }
      ```
    * propagates an error to JS if both network and cache are unavailable.

#### React Native (TypeScript) presentation layer

* **MVVM-style architecture**
  * A custom hook (ViewModel) handles:
    * calling `UniversitiesModule.loadUniversities("United Kingdom")`;
    * tracking `loading`, `error`, `universities`, `source`;
    * using `@react-native-community/netinfo` to detect online/offline status;
    * showing toasts when:
      * data is loaded from cache due to no network;
      * remote service fails but cache is available.

* **Two screens with React Navigation**
  * **UniversitiesListScreen**
    * List of UK universities (React Native Paper `List.Item` / `Card`).
    * Shows the data source: **Remote API** or **Local cache**.
    * Tapping an item navigates to **details**.
  * **UniversityDetailsScreen**
    * Displays:
      * full university name (no truncation);
      * country and alpha-2 code;
      * list of web pages as **clickable links** (opens in browser).
    * “Show on map” button opens **Google Maps** with a search query for the university name.
    * Card layout is visually separated from the header so the title “Details” does not overlap.

* **UI Toolkit**
  * Uses **React Native Paper** (MD3 theme) and  
    `@react-native-vector-icons/material-design-icons` for icons.

* **Android config**
  * `android/app/build.gradle`:
    * `apply plugin: "kotlin-kapt"`
    * OkHttp + Retrofit + Jackson + Room dependencies (see stack below).
  * `android/build.gradle`:
    * `minSdkVersion = 26`.

## Getting started

### 1. Choose a lab

Go into a specific lab folder, for example:

```sh
cd lab1
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the Metro bundler

```sh
npm start
```

### 4. Run on Android

In another terminal:

```sh
npm run android
```

Make sure:

* Android SDK is installed and available in `PATH`;
* An Android emulator is running **or** a real device is connected with USB debugging enabled.

## Building a release `.apk` (per lab)

From inside a specific lab folder (e.g. `lab1/`):

```sh
cd android
./gradlew assembleRelease
```

The release APK will appear at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Install it on a device:

```sh
adb install -r app/build/outputs/apk/release/app-release.apk
```

## License

MIT License – see [LICENSE](LICENSE) for details.