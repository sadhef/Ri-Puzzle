import axios from 'axios';

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyDlbDag0db5FTrAhUvrWfRV33McIddr1q0';

export class AIWordService {
  static async generateRandomWord(length = 5, category = 'general', difficulty = 'medium') {
    try {
      const prompt = `Generate exactly one English word that meets these requirements:
      - Exactly ${length} letters long
      - ${difficulty} difficulty level
      - Related to ${category} category
      - Common English word suitable for word games
      - No proper nouns, abbreviations, or hyphenated words
      
      Return ONLY the word in uppercase letters with no punctuation, explanations, or extra text.
      
      Example format: HOUSE`;

      // Make direct request to Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Extract response text
      if (response.data &&
          response.data.candidates &&
          response.data.candidates[0] &&
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts[0]) {
        
        let word = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
        
        // Clean the response - remove any non-letter characters
        word = word.replace(/[^A-Z]/g, '');
        
        // Take the first word if multiple words returned
        const words = word.split(/\s+/);
        if (words.length > 0) {
          word = words[0];
        }
        
        // Validate the word length and format
        if (word.length === length && /^[A-Z]+$/.test(word)) {
          console.log(`AI generated word: ${word}`);
          return word;
        } else {
          throw new Error(`Invalid word format from AI: ${word} (length: ${word.length}, expected: ${length})`);
        }
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating word with AI:', error);
      throw error;
    }
  }

  static async generateMultipleWords(count = 5, length = 5, category = 'general') {
    try {
      const prompt = `Generate exactly ${count} different English words that meet these requirements:
      - Each word must be exactly ${length} letters long
      - ${category} category
      - Common English words suitable for word games
      - No proper nouns, abbreviations, or hyphenated words
      - No duplicates
      
      Return ONLY the words, one per line, in uppercase letters with no punctuation or explanations.
      
      Example format:
      HOUSE
      PLANT
      CHAIR`;

      // Make direct request to Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
            topP: 0.9,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000 // 15 second timeout
        }
      );

      // Extract response text
      if (response.data &&
          response.data.candidates &&
          response.data.candidates[0] &&
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts[0]) {
        
        const text = response.data.candidates[0].content.parts[0].text.trim();
        
        // Parse the response
        const lines = text.split('\n');
        const words = [];
        
        for (let line of lines) {
          const word = line.trim().toUpperCase().replace(/[^A-Z]/g, '');
          if (word.length === length && /^[A-Z]+$/.test(word) && !words.includes(word)) {
            words.push(word);
          }
          if (words.length >= count) break;
        }
        
        console.log(`AI generated ${words.length} words:`, words);
        
        if (words.length < count) {
          throw new Error(`Only generated ${words.length} words, expected ${count}`);
        }
        
        return words.slice(0, count);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating multiple words:', error);
      throw error;
    }
  }

  static async validateWord(word) {
    try {
      const prompt = `Is "${word}" a valid English word suitable for word games?
      
      Consider these criteria:
      - Must be a real English word found in standard dictionaries
      - Not a proper noun (names, places, brands)
      - Not slang, informal, or offensive language
      - Appropriate for all ages
      
      Answer with only: YES or NO`;

      // Make direct request to Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10,
            temperature: 0.1,
            topP: 0.5,
            topK: 10
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 8000 // 8 second timeout
        }
      );

      // Extract response text
      if (response.data &&
          response.data.candidates &&
          response.data.candidates[0] &&
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts[0]) {
        
        const answer = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
        return answer.includes('YES');
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error validating word:', error);
      throw error;
    }
  }
}