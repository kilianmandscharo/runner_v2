import { PropsWithChildren } from "react";
import { Text, View, Dimensions } from "react-native";

export const width = Dimensions.get("window").width;

type Row = {
  id: number;
  [k: string]: number | string;
};

interface TableProps<T extends Row> {
  columns: Partial<Record<keyof T, string>>;
  rows: T[];
}

export default function Table<T extends Row>({ columns, rows }: TableProps<T>) {
  const columnItems = Object.entries(columns).map(([name, label]) => ({
    name,
    label,
  }));

  return (
    <View>
      <TableRow isLast={rows.length === 0}>
        {columnItems.map((item, i) => (
          <TableCell
            key={item.name}
            isLast={i === columnItems.length - 1}
            width={width / 4}
          >
            {item.label}
          </TableCell>
        ))}
      </TableRow>
      {rows.map((row, i) => (
        <TableRow key={row.id} isLast={i === rows.length - 1}>
          {columnItems.map((item, j) => (
            <TableCell
              key={item.name}
              width={width / 4}
              isLast={j === columnItems.length - 1}
            >
              {row[item.name]}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </View>
  );
}

interface TableRowProps {
  isLast?: boolean;
}

function TableRow({ isLast, children }: PropsWithChildren<TableRowProps>) {
  const borderBottom = isLast ? " border-b border-b-white" : "";

  return (
    <View className={`flex flex-row border-t border-t-white${borderBottom}`}>
      {children}
    </View>
  );
}

interface TableCellProps {
  width: number;
  isLast?: boolean;
}

function TableCell({
  width,
  isLast,
  children,
}: PropsWithChildren<TableCellProps>) {
  const borderRight = isLast ? " border-r border-r-white" : "";

  return (
    <Text
      className={`p-2 text-white text-lg border-l border-l-white${borderRight}`}
      style={{ width }}
    >
      {children}
    </Text>
  );
}
