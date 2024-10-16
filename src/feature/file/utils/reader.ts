import CryptoJS from "crypto-js";

export type IFileInfo = {
  fileName?: string;
  hashValue: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  date: string;
  time: string;
  muscleName: string;
  muscleSide: string;
};
export type IFileData = {
  waves: {
    waveNo: number;
    fs: number;
    x?: number[];
    y: number[];
  }[];
};

export default function parser(fileContent: string): {
  fileInfo: IFileInfo;
  fileData: IFileData;
} {
  const fileData: IFileData = {
    waves: [],
  };
  const fileInfo: IFileInfo = {
    hashValue: "",
    patientName: "",
    patientAge: 0,
    patientSex: "",
    date: "",
    time: "",
    muscleName: "",
    muscleSide: "",
  };

  fileInfo.hashValue = CryptoJS.MD5(fileContent).toString(CryptoJS.enc.Hex);

  const lines = fileContent.split("\n");

  let monitorWaveSection: boolean = false;
  let indices: number[] = [];
  let values: number[] = [];
  let fs: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line == '"*Monitor Wave"') {
      monitorWaveSection = true;
      continue;
    }

    if (monitorWaveSection) {
      if (line == '"Wave End"') {
        monitorWaveSection = false;
        if (indices.length > 0 && values.length > 0) {
          fileData.waves.push({
            waveNo: fileData.waves.length,
            fs: fs,
            x: indices,
            y: values,
          });
        }
        indices = [];
        values = [];
        continue;
      }
      const parts = line.split(",");
      if (parts.length > 1) {
        const index = parseInt(parts[0], 10);
        const value = parseInt(parts[1], 10);
        if (!isNaN(index) && !isNaN(value)) {
          indices.push(index);
          values.push(value);
        }
      }
    }

    if (line.startsWith('"Sampling Time')) {
      if (line.match(/"Sampling Time [0-9]+"/gm) !== null) {
        const parts = JSON.parse("[" + line + "]");
        let time = parseFloat(parts[1]);
        if (parts[2].trim() === "ms") {
          time = time;
        }
        else if (parts[2].trim() === "us") {
          time = time / 1000;
        }
        else if (parts[2].trim() === "s") {
          time = time * 1000;
        }
        //fs = 1 / (time / 1000);
        fs = 1 / time;
        continue;
      }
    }
    if (line.startsWith('"Name"')) {
      fileInfo.patientName = JSON.parse("[" + line + "]")[1];
      continue;
    }
    if (line.startsWith('"Sex"')) {
      fileInfo.patientSex = JSON.parse("[" + line + "]")[1];
      continue;
    }
    if (line.startsWith('"Age"')) {
      fileInfo.patientAge = Number(JSON.parse("[" + line + "]")[1]);
      continue;
    }
    if (line.startsWith('"Date"')) {
      fileInfo.date = JSON.parse("[" + line + "]")[1];
      continue;
    }
    if (line.startsWith('"Time"')) {
      fileInfo.time = JSON.parse("[" + line + "]")[1];
      continue;
    }
    if (line.startsWith('"Muscle"')) {
      fileInfo.muscleName = JSON.parse("[" + line + "]")[1];
      continue;
    }
    if (line.startsWith('"Side"')) {
      fileInfo.muscleSide = JSON.parse("[" + line + "]")[1];
      continue;
    }
  }
  return {
    fileData,
    fileInfo,
  };
}
