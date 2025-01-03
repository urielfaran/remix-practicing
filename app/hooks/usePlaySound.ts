import { useEffect } from "react";

interface usePlaySoundProps {
  url: string;
}

function usePlaySound({ url }: usePlaySoundProps) {
  useEffect(() => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  }, [url]);
}

export default usePlaySound;
