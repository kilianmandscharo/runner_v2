import { Run } from "../types/types";
import * as FileSystem from "expo-file-system";

export async function parseAndSaveToDisk(run: Run): Promise<void> {
  const data = parse([run]);
  await saveToDisk(data, run.id.toString());
}

function parse(runs: Run[]): string {
  const firstLine = '<?xml version="1.0" encoding="UTF-8"?>';
  const secondLine =
    '\n<gpx creator="Running App" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">';
  const metaData = "\n  <metadata>\n    <name>All Runs</name>\n  </metadata>";
  const lastLine = "\n</gpx>";

  let runData = "";

  for (const run of runs) {
    let track = `\n  <trk>\n    <time>${run.start}</time>\n    <trkseg>`;
    for (const location of run.path) {
      track += `\n      <trkpt lat=\"${location.lat}\" lon=\"${location.lon}\"></trkpt>`;
    }
    track += "\n    </trkseg>\n  </trk>";
    runData += track;
  }

  const gpx = firstLine + secondLine + metaData + runData + lastLine;
  return gpx;
}

async function saveToDisk(data: string, id: string): Promise<void> {
  try {
    const directory = FileSystem.documentDirectory + "Download/";
    const fileName = `run_${id}.gpx`;
    const filePath = directory + fileName;

    // Check if the download directory exists, if not create it
    const directoryInfo = await FileSystem.getInfoAsync(directory);
    if (!directoryInfo.exists) {
      return;
    }

    // Write the GPX data to the file
    await FileSystem.writeAsStringAsync(filePath, data, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}
