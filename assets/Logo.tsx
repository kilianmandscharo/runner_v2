import { Dimensions } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Logo() {
  return (
    <Svg
      width={width / 7}
      height={height / 20}
      style={{ transform: [{ rotate: "-79deg" }], marginTop: height / 250 }}
      viewBox="0 0 717 374"
      fill="none"
    >
      <Path
        d="M0 85.5V76.2604C0 68.9369 5.9369 63 13.2604 63C17.7725 63 21.9749 65.2943 24.4148 69.0898L29.5 77L34 87.5L39.5 100.5L44 109L49 117.5L59.5 131.5L66 138L73.5 145L80 149.5L84 152.5L88.5 155.5L97.5 160L106.5 164L116.5 167.5L127.5 170L134.5 171L139 171.5L144 172H153L160 171.5L165 171L171 170L174.5 169.5L178.5 168.5L185.5 166.5L193.5 163.5L198.5 161.5L208.5 156.5L221 148.5L225 145L228.5 142L232.5 138.5L237.5 133.5L243 127L248 120.5L252.5 113.5L254.5 110L258 103.5L260.5 98.5L262.5 93.5L265 82.5L268 51V21L270 12.5L273 6.5L278.5 2L286 0C294.178 0 301.873 3.87248 306.746 10.4403L310.5 15.5L322 31L333 44.5L349 61L373 85L404.5 115.5L425 135L435 145L439 149.5L448.5 157.5L463 172L469.5 178.5L478.5 185L491 197L511 211L525.5 221L533 226L542.5 229L554.5 233L566.5 234.5L592.5 235.5L660 234C691.72 234.835 717 260.789 717 292.52V313.5C717 346.637 690.137 373.5 657 373.5H60C26.8629 373.5 0 346.637 0 313.5V85.5Z"
        fill="blue"
      />
      <Path
        d="M0 310H717V314L716.9 318L716.5 321.5L716 324.5L715.5 327L714.5 331L713.5 334L712 337.5L711 340L709.258 343H7.75014L6.71575 341.266L5.5 339L3.5 334.5L2 329L1 325L0.161301 320.387C0.0539848 319.797 0 319.198 0 318.598V310Z"
        fill="white"
      />
      <Rect
        x="291"
        y="138.882"
        width="96"
        height="25"
        transform="rotate(-45 291 138.882)"
        fill="white"
      />
      <Rect
        x="354"
        y="199.882"
        width="96"
        height="25"
        transform="rotate(-45 354 199.882)"
        fill="white"
      />
      <Rect
        x="384"
        y="228.882"
        width="96"
        height="25"
        transform="rotate(-45 384 228.882)"
        fill="white"
      />
      <Rect
        x="322"
        y="168.882"
        width="96"
        height="25"
        transform="rotate(-45 322 168.882)"
        fill="white"
      />
    </Svg>
  );
}
