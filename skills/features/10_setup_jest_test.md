set up jest test for workers cron job and backend/server routes

inside workers/fetch_latest_video, create a test file named gemini-api.e2e.test.js to test the integration with Gemini API. This test will mock the YouTube API response to simulate fetching the latest video and then call the generateContentWithGemini function to verify that it correctly calls the Gemini API and processes the response as expected. The test will use Jest as the testing framework and will be added to the existing test script in package.json for easy execution.

inside backend/server, create a test file named api-routes.test.js to test the API routes. This test will use supertest to make HTTP requests to the API endpoints and verify that they return the expected responses. The test will cover various scenarios, including successful requests, error handling, and edge cases. This will ensure that the API routes are functioning correctly and can handle different types of requests as intended.

Create a jest test enviroment, put the file inside test folder 
test enviroment incude nodejs docker. 
package json to run test with docker compose, include api_test and cron_test services.
