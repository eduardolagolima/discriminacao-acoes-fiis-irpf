const { EOL } = require('os');
const fs = require('fs');

const ACCEPTED_ARGS = ['tipo', 'codigo'];
const CSV_HEADER = ['tipo', 'razao', 'codigo', 'quantidade', 'preco_medio', 'custo_total'];
const FILE = 'data.csv';
const FILE_PATH = `./${FILE}`;

function throwError(error) {
    if (error) {
        console.error(error);
    }

    process.exit();
}

function getArgs() {
    const foundArgs = process.argv.filter(arg => (
        ACCEPTED_ARGS.find(acceptedArg => {
            const regexp = new RegExp(`--${acceptedArg}=.+`);
            return regexp.test(arg);
        })
    ));
    const args = foundArgs.reduce((acc, foundArg) => {
        const regexp = /--(?<key>.+)=(?<value>.+)/;
        const match = foundArg.match(regexp);
        const { key, value } = match['groups'];
        return { ...acc, [key]: value };
    }, {});
    
    return args;
}

function getCsv() {
    try {
        return fs.readFileSync(FILE_PATH, 'utf8');
    } catch (error) {
        throwError(`O arquivo ${FILE} não foi encontrado`);
    }
}

function rowToColumns(row) {
    const regexp = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const columns = row.split(regexp)
    return columns.map(column => (column.replace(/["]+/g, '')));
}

function createObjectFromArrays(keys, values) {
    return keys.reduce((acc, key, index) => (
        { ...acc, [key]: values[index] }
    ), {});
}

function csvToJson(csv) {
    const rows = csv
        .split(EOL)
        // remove as quebras de linha que podem ficar após o split
        .map(row => row.replace(/\n|\r/, ''))
        // remove as linhas vazias
        .filter(row => row.replace(/,/g, '').trim())
        // remove o cabeçalho
        .slice(1);

    if (rows.length === 0) {
        throwError(`O arquivo ${FILE} está vazio`);
    }
        
    const json = rows.reduce((acc, row, index) => {
        const columns = rowToColumns(row);

        if (columns.length !== CSV_HEADER.length) {
            throwError(
                `O arquivo ${FILE} possui um erro na linha ${index + 2}${EOL}` +
                `Quantidade esperada de colunas: ${CSV_HEADER.length}${EOL}` +
                `Quantidade encontrada de colunas: ${columns.length}`
            );
        }

        return [
            ...acc,
            createObjectFromArrays(CSV_HEADER, columns),
        ];
    }, []);

    return json;
}

function getData() {
    const csv = getCsv();
    const data = csvToJson(csv);
    return data;
}

module.exports = {
    getArgs,
    getData,
    throwError,
}
