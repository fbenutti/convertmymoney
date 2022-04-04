const api = require('./api.bcb')
const axios = require('axios')
const { TestWatcher } = require('jest')

jest.mock('axios')

test('getCotacaoAPI', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 4.69 }
      ]
    }
  }
  axios.get.mockResolvedValue(res)
  api.getCotacaoAPI('url').then( resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})
test('extract Cotação', () => {
  const cotacao = api.extractCotacao(
    {
      data: {
        value: [
          { cotacaoVenda: 4.69 }
        ]
      }
    })
    expect(cotacao).toBe(4.69)
})
describe('getToday', () => {
  const RealDate = Date
  
  function mockDate(date) {
    global.Date = class extends RealDate {
      constructor(){
        return new RealDate(date)
      }
    }
  }
  afterEach(() => {
    global.Date = RealDate
  })

  test('getToday', () => {
    mockDate('2022-01-01T12:00:00z')
    const today = api.getToday()
    expect(today).toBe('1-1-2022')
  })
})

test('getURL', () => {
  const url = api.getURL('MINHA-DATA')
  expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='MINHA-DATA'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao")
})

test('getCotacao', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 4.69 }
      ]
    }
  }

  const getToday = jest.fn()
  getToday.mockReturnValue('04-01-2022')

  const getURL = jest.fn()
  getURL.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  //getCotacaoAPI.mockReturnValue(Promise.reject('err'))
  getCotacaoAPI.mockReturnValue(res)

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(4.69)

  api.pure
  .getCotacao({getToday, getURL, getCotacaoAPI, extractCotacao})()
  .then( res => {
    expect(res).toBe('')
  })
})