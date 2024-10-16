type DataRange = [number[], number[]]

export type Waves = DataRange[]

export type ParsedData = {
    waves: Waves,
    fs: number,
    name: string,
    sex: string,
    age: number,
    date: string,
    time: string,
}

export function parseData(content: string): ParsedData {

    const lines = content.split('\n');
    const waves: Waves = [];
    const result: ParsedData = {
        waves: waves,
        fs: 0,
        name: '',
        age: 0,
        sex: '',
        date: '',
        time: ''
    }

    let monitorWaveSection: boolean = false;
    let indices: number[] = [];
    let values: number[] = [];

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
                    waves.push([indices, values]);
                }
                indices = [];
                values = [];
                continue;
            }
            const parts = line.split(',');
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
                const parts = line.split(',');
                let time = parseFloat(parts[1].trim());
                if (parts[2].trim() === '"ms"') {
                    time = time;
                }
                else if (parts[2].trim() === '"us"') {
                    time = time / 1000;
                }
                else if (parts[2].trim() === '"s"') {
                    time = time * 1000;
                }
                result.fs = 1 / (time / 1000);

                continue;
            }
        }
        if (line.startsWith('"Name"')) {
            const parts = line.split(',');
            result.name = JSON.parse(parts[1].trim());
            continue;
        }
        if (line.startsWith('"Sex"')) {
            const parts = line.split(',');
            result.sex = JSON.parse(parts[1].trim());
            continue;
        }
        if (line.startsWith('"Age"')) {
            const parts = line.split(',');
            result.age = JSON.parse(parts[1].trim());
            continue;
        }
        if (line.startsWith('"Date"')) {
            const parts = line.split(',');
            result.date = JSON.parse(parts[1].trim());
            continue;
        }
        if (line.startsWith('"Time"')) {
            const parts = line.split(',');
            result.time = JSON.parse(parts[1].trim());
            continue;
        }

    }
    return result
}