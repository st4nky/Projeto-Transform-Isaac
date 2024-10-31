import React, { useEffect, useState } from 'react';
import './App.css'; // Referência ao App.css
import * as XLSX from 'xlsx';

const App = () => {
  const [alunos, setAlunos] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = 'AIzaSyCK1ch9h-3QznaJg6NWAPX9epFHBOqa5K0';
      const spreadsheetId = '122Ud28hPObsPAeMhcNgUp-8n35TAE4Hk-lIdoTPOWbI';
      const range = 'A:E';

      try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
        const data = await response.json();

        if (data.values) {
          const fetchedData = data.values.slice(1).map(row => ({
            nomeAluno: row[0],
            nomeResponsavel: row[1],
            tituloCobranca: row[2],
            unidade: row[3],
            motivo: row[4]
          }));
          setAlunos(fetchedData);
        } else {
          console.error('Nenhum dado encontrado na planilha.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, []);

  const unidades = [...new Set(alunos.map(item => item.unidade))];

  const formatarUnidade = (unidade) => {
    const mapeamento = {
      "IP - integração isaac (Prata)": "PRATA/RJ",
      "IP - integração isaac (São Gonçalo)": "SÃO GONÇALO/RJ",
      "IP - integração isaac (Alcântara)": "ALCÂNTARA/RJ",
      "IP – integração isaac (Araruama)": "ARARUAMA/RJ",
      "IP – integração isaac (Belford Roxo)": "BELFORD ROXO/RJ",
      "IP – integração isaac (Cabo Frio)": "CABO FRIO/RJ",
      "IP – integração isaac (Icaraí)": "ICARAÍ/RJ",
      "IP – integração isaac (Maricá 1)": "MARICÁ 1/RJ",
      "IP – integração isaac (Olaria)": "OLARIA/RJ",
      "IP – integração isaac (Niterói)": "NITERÓI/RJ",
      "IP – integração isaac (Duque de Caxias)": "DUQUE DE CAXIAS/RJ",
      "IP - integração isaac (Itaipu)": "ITAIPU/RJ",
      "IP - integração isaac (Madureira)": "MADUREIRA/RJ",
      "IP - integração isaac (Nilopolis)": "NILÓPOLIS/RJ",
      "IP - integração isaac (Iguaçu)": "NOVA IGUAÇU/RJ",
      "IP – integração isaac (Maricá 2)": "MARICÁ 2/RJ",
      "IP – integração isaac (Queimados)": "QUEIMADOS/RJ",
      "IP - integração isaac (Vilar dos Teles)": "VILAR DOS TELES/RJ",
      "IP - integração isaac (Vila Isabel)": "VILA ISABEL/RJ",
      "IP - integração isaac (Méier)": "MEIER/RJ",
      "IP - integração isaac (Ilha)": "ILHA 1/RJ",
      "IP – integração isaac (Itaboraí)": "ITABORAI/RJ",
      "IP – integração isaac (Friburgo)": "FRIBURGO/RJ",
      "IP – integração isaac/ ZERO HUM ITAIPUAÇU": "ITAIPUAÇU/RJ",
      "IP – integração isaac | Seropédica": "SEROPÉDICA/RJ",
      "IP – integração isaac (Campo Grande)": "CAMPO GRANDE/RJ",
      "IP – integração isaac (Tijuca)": "TIJUCA/RJ",
      "IP – integração isaac (Centro)": "CENTRO/RJ",
    };
    return mapeamento[unidade] || unidade;
  };

  const handleSelectUnit = (unidade) => {
    setSelectedUnit(unidade);
    setDropdownVisible(false);
  };

  const alunosFiltrados = alunos.filter(aluno => formatarUnidade(aluno.unidade) === selectedUnit);

  const baixarExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(alunosFiltrados.map(aluno => ({
      "Nome Aluno": aluno.nomeAluno,
      "Nome Responsável": aluno.nomeResponsavel,
      "Título da Cobrança": aluno.tituloCobranca,
      "Unidade": formatarUnidade(aluno.unidade),
      "Motivo": aluno.motivo
    })));

    XLSX.utils.book_append_sheet(wb, ws, 'Alunos');
    XLSX.writeFile(wb, 'alunos.xlsx');
  };

  if (loading) {
    return (
      <div id="loadingScreen">
        <img src="logo3.png" alt="Logo da Empresa" />
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container-pd">
      <div className="container alunos">
        <h1>Títulos pendentes de espelhamento na Isaac</h1>
        <div className="select-container">
          <div className="select-alunos">
            <button id="select-button" onClick={() => setDropdownVisible(!dropdownVisible)}>
              {selectedUnit || "Selecione a unidade"}
            </button>
            {dropdownVisible && (
              <div id="dropdown" className="dropdown-content">
                {unidades.map(unidade => (
                  <div key={unidade} onClick={() => handleSelectUnit(formatarUnidade(unidade))}>
                    {formatarUnidade(unidade)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedUnit && (
          <div id="resultado" className="resultado">
            <h2>{selectedUnit}</h2>
            <button id="baixar-excel" onClick={baixarExcel}>Baixar em Excel</button>
            <div className="alunos-scroll" id="alunos-scroll">
              <table className="alunos-table">
                <thead>
                  <tr>
                    <th>Nome Aluno</th>
                    <th>Nome Responsável</th>
                    <th>Título da Cobrança</th>
                    <th>Unidade</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.map((aluno, index) => (
                    <tr key={index}>
                      <td>{aluno.nomeAluno}</td>
                      <td>{aluno.nomeResponsavel}</td>
                      <td>{aluno.tituloCobranca}</td>
                      <td>{formatarUnidade(aluno.unidade)}</td>
                      <td>{aluno.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
