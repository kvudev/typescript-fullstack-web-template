# Feature name: Gemini Summarizer for YouTube Videos

# Feature Description:

inside backend/workers/fetch_latest_video/index.js, generateContentWithGemini function will be updated to call Gemini API to generate content based on the latest video fetched from YouTube. The generated content will then be stored in the database along with the video information. This will allow the frontend to display the latest video along with the generated content based on that video.