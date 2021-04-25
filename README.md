# discriminacao-acoes-fiis-irpf
Script para gerar as discriminações de ações e FIIS para declarar no IRPF

## Como utilizar

```bash
$ git clone https://github.com/eduardolagolima/discriminacao-acoes-fiis-irpf.git
$ cd discriminacao-acoes-fiis-irpf
# edite o arquivo data.csv com os seus dados
$ cp data-example.csv data.csv
```
```bash
# exemplos de utilização
# argumentos esperados: --tipo | --codigo
$ node .
$ node . --tipo=acoes
$ node . --tipo=fiis
$ node . --codigo=ABEV3
$ node . --codigo=HGLG11
```

```bash
# exemplos de exibição
---------------------------------------------------------------------------------------------------------------------------------------
| Discriminação - Bens e Direitos                                                                                                     |
---------------------------------------------------------------------------------------------------------------------------------------
| Ações - Código 31                                                                                                                   |
---------------------------------------------------------------------------------------------------------------------------------------
| 100 ações de AMBEV S.A., código de negociação ABEV3. Preço médio de R$ 15,000. Custo total de R$ 1500,00.                           |
---------------------------------------------------------------------------------------------------------------------------------------
| FIIS - Código 73                                                                                                                    |
---------------------------------------------------------------------------------------------------------------------------------------
| 100 cotas de CSHG LOGÍSTICA FDO INV IMOB - FII, código de negociação HGLG11. Preço médio de R$ 150,000. Custo total de R$ 15000,00. |
---------------------------------------------------------------------------------------------------------------------------------------
```
