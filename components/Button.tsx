import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
interface Props {
  onPress: (...args: any[]) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
  text?: string;
  icon?: JSX.Element;
  bg?: string;
}

export default function Button({
  onPress,
  disabled,
  width,
  height,
  fontSize,
  text,
  icon,
  bg,
}: Props) {
  width = width ?? 300;
  height = height ?? 70;
  bg = bg ?? "teal";
  fontSize = fontSize ?? 24;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View
        style={{
          ...styles.container,
          width: width,
          height: height,
          backgroundColor: bg,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {text && <Text style={{ fontSize, color: "white" }}>{text}</Text>}
        {icon && icon}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "teal",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
