/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/b2/route";
exports.ids = ["app/api/b2/route"];
exports.modules = {

/***/ "(rsc)/./app/api/b2/route.ts":
/*!*****************************!*\
  !*** ./app/api/b2/route.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-s3 */ \"@aws-sdk/client-s3\");\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n\n\n// Backblaze B2 S3-compatible API endpoint\nconst B2_ENDPOINT = `https://s3.${process.env.B2_REGION}.backblazeb2.com`;\n// Create S3 client with Backblaze B2 specific settings\nconst s3Client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({\n    region: process.env.B2_REGION || 'us-east-005',\n    endpoint: B2_ENDPOINT,\n    forcePathStyle: true,\n    credentials: {\n        accessKeyId: process.env.B2_ACCESS_KEY_ID,\n        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY\n    }\n});\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const prefix = searchParams.get('prefix') || '';\n    const delimiter = searchParams.get('delimiter') || '/';\n    console.log('Listing B2 objects with prefix:', prefix);\n    try {\n        const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.ListObjectsV2Command({\n            Bucket: process.env.B2_BUCKET_NAME,\n            Prefix: prefix,\n            Delimiter: delimiter,\n            MaxKeys: 1000\n        });\n        const response = await s3Client.send(command);\n        console.log('B2 API Response:', {\n            prefix,\n            directories: response.CommonPrefixes?.map((p)=>p.Prefix) || [],\n            files: response.Contents?.map((f)=>f.Key) || []\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            directories: response.CommonPrefixes?.map((p)=>p.Prefix).filter(Boolean),\n            files: (response.Contents || []).filter((file)=>{\n                // Exclude the prefix itself and .bzEmpty files\n                const shouldInclude = file.Key !== prefix && !file.Key?.endsWith('.bzEmpty') && !file.Key?.endsWith('/.bzEmpty');\n                return shouldInclude;\n            }).map((file)=>({\n                    key: file.Key,\n                    lastModified: file.LastModified,\n                    size: file.Size\n                }))\n        });\n    } catch (error) {\n        console.error('B2 List Error:', {\n            message: error.message,\n            code: error.$metadata?.httpStatusCode,\n            region: process.env.B2_REGION,\n            endpoint: B2_ENDPOINT,\n            bucket: process.env.B2_BUCKET_NAME\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: 'Failed to list B2 objects',\n            message: error.message,\n            code: error.$metadata?.httpStatusCode,\n            region: process.env.B2_REGION,\n            endpoint: B2_ENDPOINT\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2IyL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBb0U7QUFDekI7QUFFM0MsMENBQTBDO0FBQzFDLE1BQU1HLGNBQWMsQ0FBQyxXQUFXLEVBQUVDLFFBQVFDLEdBQUcsQ0FBQ0MsU0FBUyxDQUFDLGdCQUFnQixDQUFDO0FBRXpFLHVEQUF1RDtBQUN2RCxNQUFNQyxXQUFXLElBQUlQLHdEQUFRQSxDQUFDO0lBQzVCUSxRQUFRSixRQUFRQyxHQUFHLENBQUNDLFNBQVMsSUFBSTtJQUNqQ0csVUFBVU47SUFDVk8sZ0JBQWdCO0lBQ2hCQyxhQUFhO1FBQ1hDLGFBQWFSLFFBQVFDLEdBQUcsQ0FBQ1EsZ0JBQWdCO1FBQ3pDQyxpQkFBaUJWLFFBQVFDLEdBQUcsQ0FBQ1Usb0JBQW9CO0lBQ25EO0FBQ0Y7QUFFTyxlQUFlQyxJQUFJQyxPQUFnQjtJQUN4QyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLFFBQVFHLEdBQUc7SUFDNUMsTUFBTUMsU0FBU0gsYUFBYUksR0FBRyxDQUFDLGFBQWE7SUFDN0MsTUFBTUMsWUFBWUwsYUFBYUksR0FBRyxDQUFDLGdCQUFnQjtJQUVuREUsUUFBUUMsR0FBRyxDQUFDLG1DQUFtQ0o7SUFFL0MsSUFBSTtRQUNGLE1BQU1LLFVBQVUsSUFBSXpCLG9FQUFvQkEsQ0FBQztZQUN2QzBCLFFBQVF2QixRQUFRQyxHQUFHLENBQUN1QixjQUFjO1lBQ2xDQyxRQUFRUjtZQUNSUyxXQUFXUDtZQUNYUSxTQUFTO1FBQ1g7UUFFQSxNQUFNQyxXQUFXLE1BQU16QixTQUFTMEIsSUFBSSxDQUFDUDtRQUVyQ0YsUUFBUUMsR0FBRyxDQUFDLG9CQUFvQjtZQUM5Qko7WUFDQWEsYUFBYUYsU0FBU0csY0FBYyxFQUFFQyxJQUFJQyxDQUFBQSxJQUFLQSxFQUFFUixNQUFNLEtBQUssRUFBRTtZQUM5RFMsT0FBT04sU0FBU08sUUFBUSxFQUFFSCxJQUFJSSxDQUFBQSxJQUFLQSxFQUFFQyxHQUFHLEtBQUssRUFBRTtRQUNqRDtRQUVBLE9BQU92QyxxREFBWUEsQ0FBQ3dDLElBQUksQ0FBQztZQUN2QlIsYUFBYUYsU0FBU0csY0FBYyxFQUFFQyxJQUFJQyxDQUFBQSxJQUFLQSxFQUFFUixNQUFNLEVBQUVjLE9BQU9DO1lBQ2hFTixPQUFPLENBQUNOLFNBQVNPLFFBQVEsSUFBSSxFQUFFLEVBQzVCSSxNQUFNLENBQUNFLENBQUFBO2dCQUNOLCtDQUErQztnQkFDL0MsTUFBTUMsZ0JBQWdCRCxLQUFLSixHQUFHLEtBQUtwQixVQUNmLENBQUN3QixLQUFLSixHQUFHLEVBQUVNLFNBQVMsZUFDcEIsQ0FBQ0YsS0FBS0osR0FBRyxFQUFFTSxTQUFTO2dCQUN4QyxPQUFPRDtZQUNULEdBQ0NWLEdBQUcsQ0FBQ1MsQ0FBQUEsT0FBUztvQkFDWkcsS0FBS0gsS0FBS0osR0FBRztvQkFDYlEsY0FBY0osS0FBS0ssWUFBWTtvQkFDL0JDLE1BQU1OLEtBQUtPLElBQUk7Z0JBQ2pCO1FBQ0o7SUFDRixFQUFFLE9BQU9DLE9BQVk7UUFDbkI3QixRQUFRNkIsS0FBSyxDQUFDLGtCQUFrQjtZQUM5QkMsU0FBU0QsTUFBTUMsT0FBTztZQUN0QkMsTUFBTUYsTUFBTUcsU0FBUyxFQUFFQztZQUN2QmpELFFBQVFKLFFBQVFDLEdBQUcsQ0FBQ0MsU0FBUztZQUM3QkcsVUFBVU47WUFDVnVELFFBQVF0RCxRQUFRQyxHQUFHLENBQUN1QixjQUFjO1FBQ3BDO1FBRUEsT0FBTzFCLHFEQUFZQSxDQUFDd0MsSUFBSSxDQUN0QjtZQUNFVyxPQUFPO1lBQ1BDLFNBQVNELE1BQU1DLE9BQU87WUFDdEJDLE1BQU1GLE1BQU1HLFNBQVMsRUFBRUM7WUFDdkJqRCxRQUFRSixRQUFRQyxHQUFHLENBQUNDLFNBQVM7WUFDN0JHLFVBQVVOO1FBQ1osR0FDQTtZQUFFd0QsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kaGltYXN3ZWViL0Nhc2NhZGVQcm9qZWN0cy9waG90by1nYWxsZXJ5LXBvcnRhbC9hcHAvYXBpL2IyL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFMzQ2xpZW50LCBMaXN0T2JqZWN0c1YyQ29tbWFuZCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zMyc7XG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbi8vIEJhY2tibGF6ZSBCMiBTMy1jb21wYXRpYmxlIEFQSSBlbmRwb2ludFxuY29uc3QgQjJfRU5EUE9JTlQgPSBgaHR0cHM6Ly9zMy4ke3Byb2Nlc3MuZW52LkIyX1JFR0lPTn0uYmFja2JsYXplYjIuY29tYDtcblxuLy8gQ3JlYXRlIFMzIGNsaWVudCB3aXRoIEJhY2tibGF6ZSBCMiBzcGVjaWZpYyBzZXR0aW5nc1xuY29uc3QgczNDbGllbnQgPSBuZXcgUzNDbGllbnQoe1xuICByZWdpb246IHByb2Nlc3MuZW52LkIyX1JFR0lPTiB8fCAndXMtZWFzdC0wMDUnLFxuICBlbmRwb2ludDogQjJfRU5EUE9JTlQsXG4gIGZvcmNlUGF0aFN0eWxlOiB0cnVlLFxuICBjcmVkZW50aWFsczoge1xuICAgIGFjY2Vzc0tleUlkOiBwcm9jZXNzLmVudi5CMl9BQ0NFU1NfS0VZX0lEISxcbiAgICBzZWNyZXRBY2Nlc3NLZXk6IHByb2Nlc3MuZW52LkIyX1NFQ1JFVF9BQ0NFU1NfS0VZIVxuICB9XG59KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgcHJlZml4ID0gc2VhcmNoUGFyYW1zLmdldCgncHJlZml4JykgfHwgJyc7XG4gIGNvbnN0IGRlbGltaXRlciA9IHNlYXJjaFBhcmFtcy5nZXQoJ2RlbGltaXRlcicpIHx8ICcvJztcblxuICBjb25zb2xlLmxvZygnTGlzdGluZyBCMiBvYmplY3RzIHdpdGggcHJlZml4OicsIHByZWZpeCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjb21tYW5kID0gbmV3IExpc3RPYmplY3RzVjJDb21tYW5kKHtcbiAgICAgIEJ1Y2tldDogcHJvY2Vzcy5lbnYuQjJfQlVDS0VUX05BTUUsXG4gICAgICBQcmVmaXg6IHByZWZpeCxcbiAgICAgIERlbGltaXRlcjogZGVsaW1pdGVyLFxuICAgICAgTWF4S2V5czogMTAwMFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzM0NsaWVudC5zZW5kKGNvbW1hbmQpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdCMiBBUEkgUmVzcG9uc2U6Jywge1xuICAgICAgcHJlZml4LFxuICAgICAgZGlyZWN0b3JpZXM6IHJlc3BvbnNlLkNvbW1vblByZWZpeGVzPy5tYXAocCA9PiBwLlByZWZpeCkgfHwgW10sXG4gICAgICBmaWxlczogcmVzcG9uc2UuQ29udGVudHM/Lm1hcChmID0+IGYuS2V5KSB8fCBbXVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBkaXJlY3RvcmllczogcmVzcG9uc2UuQ29tbW9uUHJlZml4ZXM/Lm1hcChwID0+IHAuUHJlZml4KS5maWx0ZXIoQm9vbGVhbikgYXMgc3RyaW5nW10sXG4gICAgICBmaWxlczogKHJlc3BvbnNlLkNvbnRlbnRzIHx8IFtdKVxuICAgICAgICAuZmlsdGVyKGZpbGUgPT4ge1xuICAgICAgICAgIC8vIEV4Y2x1ZGUgdGhlIHByZWZpeCBpdHNlbGYgYW5kIC5iekVtcHR5IGZpbGVzXG4gICAgICAgICAgY29uc3Qgc2hvdWxkSW5jbHVkZSA9IGZpbGUuS2V5ICE9PSBwcmVmaXggJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhZmlsZS5LZXk/LmVuZHNXaXRoKCcuYnpFbXB0eScpICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWZpbGUuS2V5Py5lbmRzV2l0aCgnLy5iekVtcHR5Jyk7XG4gICAgICAgICAgcmV0dXJuIHNob3VsZEluY2x1ZGU7XG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoZmlsZSA9PiAoe1xuICAgICAgICAgIGtleTogZmlsZS5LZXkgYXMgc3RyaW5nLFxuICAgICAgICAgIGxhc3RNb2RpZmllZDogZmlsZS5MYXN0TW9kaWZpZWQsXG4gICAgICAgICAgc2l6ZTogZmlsZS5TaXplXG4gICAgICAgIH0pKVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcignQjIgTGlzdCBFcnJvcjonLCB7XG4gICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgY29kZTogZXJyb3IuJG1ldGFkYXRhPy5odHRwU3RhdHVzQ29kZSxcbiAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQjJfUkVHSU9OLFxuICAgICAgZW5kcG9pbnQ6IEIyX0VORFBPSU5ULFxuICAgICAgYnVja2V0OiBwcm9jZXNzLmVudi5CMl9CVUNLRVRfTkFNRVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBcbiAgICAgICAgZXJyb3I6ICdGYWlsZWQgdG8gbGlzdCBCMiBvYmplY3RzJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgY29kZTogZXJyb3IuJG1ldGFkYXRhPy5odHRwU3RhdHVzQ29kZSxcbiAgICAgICAgcmVnaW9uOiBwcm9jZXNzLmVudi5CMl9SRUdJT04sXG4gICAgICAgIGVuZHBvaW50OiBCMl9FTkRQT0lOVFxuICAgICAgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0iXSwibmFtZXMiOlsiUzNDbGllbnQiLCJMaXN0T2JqZWN0c1YyQ29tbWFuZCIsIk5leHRSZXNwb25zZSIsIkIyX0VORFBPSU5UIiwicHJvY2VzcyIsImVudiIsIkIyX1JFR0lPTiIsInMzQ2xpZW50IiwicmVnaW9uIiwiZW5kcG9pbnQiLCJmb3JjZVBhdGhTdHlsZSIsImNyZWRlbnRpYWxzIiwiYWNjZXNzS2V5SWQiLCJCMl9BQ0NFU1NfS0VZX0lEIiwic2VjcmV0QWNjZXNzS2V5IiwiQjJfU0VDUkVUX0FDQ0VTU19LRVkiLCJHRVQiLCJyZXF1ZXN0Iiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicHJlZml4IiwiZ2V0IiwiZGVsaW1pdGVyIiwiY29uc29sZSIsImxvZyIsImNvbW1hbmQiLCJCdWNrZXQiLCJCMl9CVUNLRVRfTkFNRSIsIlByZWZpeCIsIkRlbGltaXRlciIsIk1heEtleXMiLCJyZXNwb25zZSIsInNlbmQiLCJkaXJlY3RvcmllcyIsIkNvbW1vblByZWZpeGVzIiwibWFwIiwicCIsImZpbGVzIiwiQ29udGVudHMiLCJmIiwiS2V5IiwianNvbiIsImZpbHRlciIsIkJvb2xlYW4iLCJmaWxlIiwic2hvdWxkSW5jbHVkZSIsImVuZHNXaXRoIiwia2V5IiwibGFzdE1vZGlmaWVkIiwiTGFzdE1vZGlmaWVkIiwic2l6ZSIsIlNpemUiLCJlcnJvciIsIm1lc3NhZ2UiLCJjb2RlIiwiJG1ldGFkYXRhIiwiaHR0cFN0YXR1c0NvZGUiLCJidWNrZXQiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/b2/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fb2%2Froute&page=%2Fapi%2Fb2%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fb2%2Froute.ts&appDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fb2%2Froute&page=%2Fapi%2Fb2%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fb2%2Froute.ts&appDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_dhimasweeb_CascadeProjects_photo_gallery_portal_app_api_b2_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/b2/route.ts */ \"(rsc)/./app/api/b2/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/b2/route\",\n        pathname: \"/api/b2\",\n        filename: \"route\",\n        bundlePath: \"app/api/b2/route\"\n    },\n    resolvedPagePath: \"/Users/dhimasweeb/CascadeProjects/photo-gallery-portal/app/api/b2/route.ts\",\n    nextConfigOutput,\n    userland: _Users_dhimasweeb_CascadeProjects_photo_gallery_portal_app_api_b2_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4zLjJfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZiMiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYjIlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZiMiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmRoaW1hc3dlZWIlMkZDYXNjYWRlUHJvamVjdHMlMkZwaG90by1nYWxsZXJ5LXBvcnRhbCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZkaGltYXN3ZWViJTJGQ2FzY2FkZVByb2plY3RzJTJGcGhvdG8tZ2FsbGVyeS1wb3J0YWwmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzBCO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvZGhpbWFzd2VlYi9DYXNjYWRlUHJvamVjdHMvcGhvdG8tZ2FsbGVyeS1wb3J0YWwvYXBwL2FwaS9iMi9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYjIvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9iMlwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYjIvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZGhpbWFzd2VlYi9DYXNjYWRlUHJvamVjdHMvcGhvdG8tZ2FsbGVyeS1wb3J0YWwvYXBwL2FwaS9iMi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fb2%2Froute&page=%2Fapi%2Fb2%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fb2%2Froute.ts&appDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@aws-sdk/client-s3");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.3.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fb2%2Froute&page=%2Fapi%2Fb2%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fb2%2Froute.ts&appDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdhimasweeb%2FCascadeProjects%2Fphoto-gallery-portal&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();