import Image from "next/image";

const ILLUSTRATION_SRC = "/images/signup-marketing-illustration.png";

export function SignupMarketingVisual() {
  return (
    <div
      className="relative mx-auto aspect-[385/255] w-full max-w-[365px] shrink-0 bg-transparent min-[768px]:aspect-auto min-[768px]:h-[215px] min-[768px]:w-[325px] min-[768px]:max-w-none min-[1200px]:h-[255px] min-[1200px]:w-[385px]"
      aria-hidden="true"
    >
      <Image
        src={ILLUSTRATION_SRC}
        alt=""
        fill
        priority
        sizes="(min-width: 1200px) 800px, (min-width: 768px) 325px, 365px"
        className="block h-full w-full object-contain"
      />
    </div>
  );
}
