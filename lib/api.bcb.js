const axios = require('axios')
const getURL = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${data}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getCotacaoAPI = url => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoVenda
const getToday = () => {
  const today = new Date()
  return (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear()
}

const getCotacao = ({ getToday, getURL, getCotacaoAPI, extractCotacao }) => async () => {
  try {
    const today = getToday()
    console.log(today)
    //const url = getURL(today)
    const url = getURL('04-01-2022')
    const res = await getCotacaoAPI(url)
    const cotacao = extractCotacao(res)
    return cotacao
  } catch (err) {
    return ''
  }
  
}

module.exports = {
  getCotacaoAPI,
  getCotacao: getCotacao({ getToday, getURL, getCotacaoAPI, extractCotacao}),
  extractCotacao,
  getToday,
  getURL,
  pure: {
    getCotacao
  }
}