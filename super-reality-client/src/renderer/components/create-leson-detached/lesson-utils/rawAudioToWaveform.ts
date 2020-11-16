export default function rawAudioToWaveform(audioData: Float32Array): number[] {
  const arr = Array.from(audioData);
  const newArr: number[] = [];

  for (let i = 0; i < arr.length; i += 1000) {
    let highestAround = 0;

    for (let n = -1000; n < 1000; n += 1) {
      const nPos = i + n;
      if (nPos > 0 && nPos < arr.length) {
        const val = Math.abs(arr[nPos]);
        if (val > highestAround) highestAround = val;
      }
    }

    newArr.push(highestAround);
  }

  return newArr;
}
