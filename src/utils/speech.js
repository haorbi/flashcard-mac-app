/**
 * Web Speech API wrapper for pronouncing English words and example sentences
 */
export const speakText = (text, rate = 0.9, pitch = 1.0) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Try to find a high quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (voice) => (voice.lang.includes('en-US') || voice.lang.includes('en-GB')) && voice.name.includes('Natural')
  ) || voices.find(
    (voice) => voice.lang.startsWith('en')
  );

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
};
