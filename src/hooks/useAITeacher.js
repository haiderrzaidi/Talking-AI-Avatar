export async function askAI(question) {
    // Make a request to the Flask server to get the chat response
    try {
        const url = `http://127.0.0.1:8080/get?question=${encodeURIComponent(question)}`;
        const response = await fetch(url);
    
        const data = await response.json();
        
        // Return the answer
        return data.response;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error; // Re-throw the error to let the caller handle it
    }
}

const { create } = require("zustand");

export const teachers = ["Nanami", "Naoki"];

export const useAITeacher = create((set, get) => ({
    messages: [],
    currentMessage: null,
    teacher: teachers[0],
    setTeacher: (teacher) => {
        set(() => ({
            teacher,
            messages: get().messages.map((message) => {
                message.audioPlayer = null; // New teacher, new Voice
                return message;
            }),
        }));
    },
    classroom: "default",
    setClassroom: (classroom) => {
        set(() => ({
            classroom,
        }));
    },
    loading: false,


    english: true,
    setEnglish: (english) => {
        set(() => ({
            english,
        }));
    },
    askAI: async (question) => {
        if (!question) {
            return;
        }
        const message = {
            question,
            id: get().messages.length,
        };
        set(() => ({
            loading: true,
        }));

        const response = await askAI(question);
        // Assign server response to message.answer
        message.answer = response; // Assuming server response is an object with 'response' key
        set(() => ({
            currentMessage: message,
          }));
      
          set((state) => ({
            messages: [...state.messages, message],
            loading: false,
          }));
          get().playMessage(message);
        },
        playMessage: async (message) => {
            set(() => ({
              currentMessage: message,
            }));
        
            if (!message.audioPlayer) {
              set(() => ({
                loading: true,
              }));
              // Get TTS
              const audioRes = await fetch(
                `/api/tts?teacher=${get().teacher}&text=${message.answer}`
              );
              const audio = await audioRes.blob();
              const visemes = JSON.parse(await audioRes.headers.get("visemes"));
              const audioUrl = URL.createObjectURL(audio);
              const audioPlayer = new Audio(audioUrl);
        
              message.visemes = visemes;
              message.audioPlayer = audioPlayer;
              message.audioPlayer.onended = () => {
                set(() => ({
                  currentMessage: null,
                }));
              };
              set(() => ({
                loading: false,
                messages: get().messages.map((m) => {
                  if (m.id === message.id) {
                    return message;
                  }
                  return m;
                }),
              }));
            }
        
            message.audioPlayer.currentTime = 0;
            message.audioPlayer.play();
          },
          stopMessage: (message) => {
          },
        }));
