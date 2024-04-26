import PageContainer from "../../components/PageContainer";
import Button from "../../components/Button";
import { currentRunTestDb } from "../../database/index";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import { Text, View } from "react-native";
import { RunState } from "../../types/types";

function logError(error: unknown) {
  console.error(
    `ERROR: ${error instanceof Error ? error.message : "unknown error"}`,
  );
}

function wrapTest(test: () => Promise<any>) {
  return async function () {
    try {
      const result = await test();
      console.log(result);
    } catch (error) {
      logError(error);
    }
  };
}

const testFunctions = {
  testGetCurrentRun: wrapTest(
    currentRunTestDb.getCurrentRun.bind(currentRunTestDb),
  ),
  testGetLocations: wrapTest(
    currentRunTestDb.getLocations.bind(currentRunTestDb),
  ),
  testGetCurrentRunWithLocations: wrapTest(
    currentRunTestDb.getCurrentRunWithLocations.bind(currentRunTestDb),
  ),
  testGetLastLocation: wrapTest(
    currentRunTestDb.getLastLocation.bind(currentRunTestDb),
  ),
  testGetDistance: wrapTest(
    currentRunTestDb.getDistance.bind(currentRunTestDb),
  ),
  testGetCurrentRunId: wrapTest(
    currentRunTestDb.getCurrentRunId.bind(currentRunTestDb),
  ),
  testCreateCurrentRun: wrapTest(
    currentRunTestDb.createCurrentRun.bind(currentRunTestDb),
  ),
  testAddLocations: wrapTest(
    async () =>
      await currentRunTestDb.addLocations.bind(currentRunTestDb)([
        {
          lon: Math.round(Math.random() * 100),
          lat: Math.round(Math.random() * 100),
          timestamp: new Date().getMilliseconds(),
          speed: Math.round(Math.random() * 30),
          altitude: Math.round(Math.random() * 500),
        },
      ]),
  ),
  testUpdateRun: wrapTest(
    async () =>
      await currentRunTestDb.updateRun.bind(currentRunTestDb)({
        time: Math.round(Math.random() * 100),
        state: RunState.Started,
        start: new Date().toISOString(),
      }),
  ),
  testDeleteCurrentRun: wrapTest(
    currentRunTestDb.deleteCurrentRun.bind(currentRunTestDb),
  ),
};

type TestFuncName = keyof typeof testFunctions;

export default function Test() {
  const { success, error } = useMigrations(
    currentRunTestDb.getDb(),
    migrations,
  );

  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        {error && (
          <Text className="text-white">
            Fehler beim initialisieren der Datenbank
          </Text>
        )}
        {success && (
          <>
            {Object.keys(testFunctions).map((funcName) => (
              <Button
                key={funcName}
                onPress={testFunctions[funcName as TestFuncName]}
                height={50}
                fontSize={18}
                text={funcName}
              />
            ))}
          </>
        )}
      </View>
    </PageContainer>
  );
}
