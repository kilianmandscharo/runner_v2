import { Text, View, TouchableOpacity } from "react-native";

type ButtonVariant = "primary" | "secondary";
type ButtonColor = "primary" | "danger";

interface Props {
  onPress: (...args: any[]) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
  text?: string;
  icon?: JSX.Element;
  rounded?: boolean;
  variant?: ButtonVariant;
  bg?: ButtonColor;
}

export default function Button({
  onPress,
  disabled,
  width = 300,
  height = 70,
  fontSize = 24,
  text,
  icon,
  bg = "primary",
  rounded,
}: Props) {
  const bgMap: Record<ButtonColor, string> = {
    primary: "bg-teal-600",
    danger: "bg-red-500",
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View
        className={`${bgMap[bg]} justify-center items-center`}
        style={{
          width: width,
          height: height,
          opacity: disabled ? 0.4 : 1,
          borderRadius: rounded ? width / 2 : 4,
        }}
      >
        {text && (
          <Text className="text-white" style={{ fontSize }}>
            {text}
          </Text>
        )}
        {icon && icon}
      </View>
    </TouchableOpacity>
  );
}
