import Lottie from "react-lottie";
import type { ReactElement } from "react";

interface LottieAnimationProps {
  animation: unknown;
  height: string;
  width: string;
}

export function LottieAnimation({
  animation,
  height,
  width,
}: Readonly<LottieAnimationProps>): ReactElement {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };

  return (
    <Lottie
      options={defaultOptions}
      height={`${height}px`}
      width={`${width}px`}
      isClickToPauseDisabled
    />
  );
}
