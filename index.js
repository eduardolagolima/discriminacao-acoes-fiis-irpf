const {
    getArgs,
    getData,
    throwError,
} = require('./helpers');

const ACOES = 'acoes';
const FIIS = 'fiis';

const NOMENCLATURAS = Object.freeze({
    [ACOES]: 'ações',
    [FIIS]: 'cotas',
});

function filtrarAtivos(ativos, tipo, codigo) {
    let ativosFiltrados = ativos;
    
    if (tipo) {
        ativosFiltrados = ativosFiltrados.filter(ativo => ativo.tipo === tipo);
    }

    if (codigo) {
        ativosFiltrados = ativosFiltrados.filter(ativo => ativo.codigo === codigo);
    }

    return ativosFiltrados;
}

function gerarDiscriminacao({ quantidade, tipo, razao, codigo, preco_medio, custo_total }) {
    return `${quantidade} ${NOMENCLATURAS[tipo]} de ${razao}, código de negociação ${codigo}. ` +
           `Preço médio de R$ ${preco_medio}. Custo total de R$ ${custo_total}.`
}

function gerarDiscriminacoes(ativos) {
    return ativos.reduce((acc, ativo) => {
        acc[ativo.tipo] = [
            ...acc[ativo.tipo],
            gerarDiscriminacao(ativo)
        ];

        return acc;
    }, { [ACOES]: [], [FIIS]: [] });
}

function obterComprimentoMaiorLinha(linhas) {
    return linhas.reduce((acc, linha) => (
        (linha.length > acc) ? linha.length : acc
    ), 0);
}

function gerarLinha(comprimentoMaiorLinha) {
    const tamanhoFormatacaoLados = 4;
    return ''.padStart(comprimentoMaiorLinha + tamanhoFormatacaoLados, '-');
};

function tabularLinha(comprimentoMaiorLinha, linha) {
    const diferenca = comprimentoMaiorLinha - linha.length;
    return '| ' + linha + ''.padEnd(diferenca, ' ') + ' |';
};

function tabularLinhas(comprimentoMaiorLinha, linhas) {
    return linhas.reduce((acc, linha) => {
        return [...acc, tabularLinha(comprimentoMaiorLinha, linha)];
    }, []).join('\n');
};

const { tipo = '', codigo = '' } = getArgs();
const ativos = getData();
const ativosFiltrados = filtrarAtivos(ativos, tipo, codigo);
const discriminacoes = gerarDiscriminacoes(ativosFiltrados);
const discriminacoesAcoes = discriminacoes[ACOES];
const discriminacoesFiis = discriminacoes[FIIS];
const discriminacoesAtivos = discriminacoesAcoes.concat(discriminacoesFiis);

if (discriminacoesAtivos.length === 0) {
    throwError('Nenhum ativo foi encontrado para os parâmetros informados');
}

const comprimentoMaiorLinha = obterComprimentoMaiorLinha(discriminacoesAtivos);
const linha = gerarLinha(comprimentoMaiorLinha);

console.log(linha);
console.log(tabularLinha(comprimentoMaiorLinha, 'Discriminação - Bens e Direitos'));
console.log(linha);

if (discriminacoesAcoes.length) {
    console.log(tabularLinha(comprimentoMaiorLinha, 'Ações - Código 31'));
    console.log(linha);
    console.log(tabularLinhas(comprimentoMaiorLinha, discriminacoesAcoes));
    console.log(linha);
}

if (discriminacoesFiis.length) {
    console.log(tabularLinha(comprimentoMaiorLinha, 'FIIS - Código 73'));
    console.log(linha);
    console.log(tabularLinhas(comprimentoMaiorLinha, discriminacoesFiis));
    console.log(linha);
}
