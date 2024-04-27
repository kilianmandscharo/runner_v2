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
  round?: boolean;
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
  round,
  variant = "primary",
}: Props) {
  const colorMap: Record<ButtonColor, string> = {
    primary: "#0d9488",
    danger: "#ef4444",
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colorMap[bg];
      case "secondary":
        return "transparent";
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "primary":
        return "transparent";
      case "secondary":
        return colorMap[bg];
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View
        className="justify-center items-center flex-row"
        style={{
          width: width,
          height: height,
          opacity: disabled ? 0.4 : 1,
          borderRadius: round ? width / 2 : 40,
          borderWidth: variant === "primary" ? 0 : 2,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          gap: 16,
        }}
      >
        {icon && icon}
        {text && (
          <Text className="text-white" style={{ fontSize }}>
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
