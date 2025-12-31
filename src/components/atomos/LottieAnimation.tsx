import Lottie from "react-lottie";
import type { ReactElement } from "react";

interface LottieAnimationProps {
  alto: string;
  ancho: string;
  animacion: unknown;
}

export function LottieAnimation({
  alto,
  ancho,
  animacion,
}: Readonly<LottieAnimationProps>): ReactElement {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animacion,
  };

  return (
    <Lottie
      options={defaultOptions}
      height={`${alto}px`}
      width={`${ancho}px`}
      isClickToPauseDisabled
    />
  );
}
