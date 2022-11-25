import * as fs from 'fs';

/*
    This script has as function to calculate the difference between the previous
    gasReport and the current, this will works under the pretext that the report
    that is being calculated against is called 'oldGasReport.txt'. The output
    file is called 'gasReportDiff.txt'
*/

function main(): void {
    const gasReport = fs.readFileSync('gasReport.txt', 'utf8');
    const gasReportOld = fs.readFileSync('oldGasReport.txt', 'utf8');

    const gasMap = toReport(gasReport);
    const gasMapOld = toReport(gasReportOld);

    const diffGasMap = new Map<string, Map<string, GasDiff>>();

    gasMap.forEach((val, key) => {
        if (!diffGasMap.has(key)) {
            diffGasMap.set(key, new Map<string, GasDiff>());
        }
        val.forEach((val2, key2) => {
            const oldVal2 = gasMapOld.get(key)?.get(key2);
            if (oldVal2 == null) return;
            diffGasMap.get(key)?.set(key2, {
                Absolute: oldVal2.Avg - val2.Avg,
                Percent: (oldVal2.Avg / val2.Avg) * 100 - 100,
            });
        });
    });

    fs.writeFileSync(
        'gasReportDiff.txt',
        JSON.stringify(mapToObject(diffGasMap), null, 2),
        {
            flag: 'w',
        },
    );
}

function mapToObject(m: any): string {
    const o: any = {};
    for (const [k, v] of m) {
        o[k] = {};
        for (const [k2, v2] of v) {
            o[k][k2] = v2;
        }
    }
    return o;
}

interface GasDiff {
    Absolute: number;
    Percent: number;
}

function toReport(rawReport: string): Map<string, Map<string, MethodReport>> {
    // Parse to lines
    const newlineReport = rawReport
        .split('\n')
        .splice(4)
        .filter((element) => element[0] == '|');
    const deploymentsIndex = newlineReport.findIndex((string) =>
        string.includes('Deployments'),
    );
    const methods = newlineReport.splice(1, deploymentsIndex - 1);
    // const deployments = newlineReport.splice(1);

    // get a map of [Contract][Methods]
    const methodMap = new Map<string, Map<string, MethodReport>>();
    methods.forEach((string) => {
        const str = string
            .replaceAll('|', '')
            .replaceAll('·', '')
            .replaceAll('│', '')
            .replaceAll('·', '')
            .trim()
            .split(/\s+/);

        const contract = str[0];
        const method = str[1];
        const min = str[2];
        const max = str[3];
        const avg = str[4];

        if (!methodMap.has(contract)) {
            methodMap.set(contract, new Map<string, MethodReport>());
        }
        // on Number('-'), a NaN will be returned, which is Ok
        methodMap.get(contract)?.set(method, {
            Min: Number(min),
            Max: Number(max),
            Avg: Number(avg),
        });
    });

    return methodMap;
}

interface MethodReport {
    Min: number;
    Max: number;
    Avg: number;
}

main();
