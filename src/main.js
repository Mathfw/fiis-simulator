import "./_reset.css"
import "./style.css"
import "./blocks.css"
import "./utility.css"

document.querySelector('#app').innerHTML = `
  <header>
    <h1>Simulador de investimento em FIIS</h1>
  </header>
  <main>
    <div class="[ card ] [ grid-flow ]">
      <h2>Simulador</h2>
      <label class="[ text-field ] [ flex-wrapper ]">
        <span class="[ text-field__label ]">valor incial</span>
        <input type="text" id="input-inicial" placeholder="R$ 1000,00" class="[ text-field__control ]" />
      </label>
      <label class="[ text-field ] [ flex-wrapper ]">
        <span class="[ text-field__label ]">valor mensal</span>
        <input type="text" id="input-mensal" placeholder="R$ 100,00" class="[ text-field__control ]" />
      </label>
      <label class="[ text-field ] [ flex-wrapper ]">
        <span class="[ text-field__label ]">cota do FII</span>
        <input type="text" id="input-cota" placeholder="R$ 8,17" class="[ text-field__control ]" />
      </label>
      <label class="[ text-field ]">
        <span class="[ text-field__label ]">dividendo do fundo</span>
        <div class="[ flex-wrapper ]">
          <input type="text" id="input-dividendo" placeholder="12.82" class="[ text-field__control ]" />
          <span class="[ text-field__tag ]">%</span>
        </div>
      </label>
      <label class="[ text-field ]">
        <span class="[ text-field__label ]">periodo</span>
        <div class="[ flex-wrapper ]">
          <input type="text" id="input-periodo" placeholder="12" required class="[ text-field__control ]" />
          <span class="[ text-field__tag ]">meses</span>
        </div>
      </label>
      <button id="button-calc">
        calcular
      </button>
    </div>
    <div class="[ grid-flow ]">
      <h2>Resultados</h2>
      <table>
        <!-- <caption></caption> -->
        <thead>
          <tr>
            <th>mês</th>
            <th>investido</th>
            <th>cotas</th>
            <th>valor</th>
            <th>sobra</th>
            <th>cotas_dividendo_mensal</th>
            <th>cotas_dividendo_acumulado</th>
            <th>dividendo_mensal</th>
            <th>dividendo_acumulado</th>
          </tr>
        </thead>
        <tbody id="tbody">
        </tbody>
      </table>
    </div>
  </main>
  <footer>
    <p>Copyright &copy <span id="copy-date"></span> Matheus José Bento Ferreira. All Rights Reserved.</p>
    <div>
      <h3>contato</h3>
      <p>
        email: <a href="mailto:contato@mjbferreira.com">contato@mjbferreira.com</a>
      </p>
    </div>
  </footer>
`;

document.querySelector("#copy-date").innerHTML = new Date().getFullYear();

/* [ VARIAVEIS DO CALCULO ] */

let inicial = 0, mensal = 0, cota = 0, dividendo = 0, periodo = 0;

/* [ ELEMENTOS ] */

/** @type {HTMLDivElement} */
const tbody = document.querySelector("#tbody");

const input_inicial = document.querySelector("#input-inicial");
input_inicial.addEventListener("change", handleMoneyInput);

const input_mensal = document.querySelector("#input-mensal");
input_mensal.addEventListener("change", handleMoneyInput);

const input_cota = document.querySelector("#input-cota");
input_cota.addEventListener("change", handleMoneyInput);

const input_dividendo = document.querySelector("#input-dividendo");
input_dividendo.addEventListener("change", handleNumberInput)

const input_periodo = document.querySelector("#input-periodo");
input_periodo.addEventListener("change", handleNumberInput)

const button_calc = document.querySelector("#button-calc");
button_calc.addEventListener("click", () => {
  console.log(inicial, mensal, cota, dividendo, periodo);
  const res = calcular_projecao(inicial, mensal, cota, dividendo, periodo);
  update_table(tbody, res);
})

const brFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
})

/* [ EVENT LISTENERS ] */

/**
 * @param {Event} e 
 * */
function handleMoneyInput(e) {
  /** @type {string} */
  const value = e.target.value;
  const cleaned_value = value.replace(/\D/g, '');
  if (cleaned_value === '') {
    e.target.value = '';
    return;
  }
  const numeric_value = Number(cleaned_value) / 100;
  const formatted_value = brFormatter.format(numeric_value);
  e.target.value = formatted_value;
  console.log(e.target.id);
  switch (e.target.id) {
    case "input-inicial": {
      inicial = numeric_value;
      break;
    }
    case "input-mensal": {
      mensal = numeric_value;
      break;
    }
    case "input-cota": {
      cota = numeric_value;
      break;
    }
    default:
      break;
  }
}

/**
 * @param {Event} e 
 * */
function handleNumberInput(e) {
  const value = e.target.value;
  const has_comma = /\,/g.test(value)
  const cleaned_value = value.replace(/\D/g, '');
  if (cleaned_value === '') {
    e.target.value = '';
    return;
  }
  if (has_comma) {
    e.target.value = replace_dot_to_comma((Number(cleaned_value) / 100).toString());
  } else {
    e.target.value = cleaned_value
  }
  switch (e.target.id) {
    case "input-dividendo": {
      dividendo = Number(cleaned_value) / 100
      break;
    }
    case "input-periodo": {
      periodo = Number(cleaned_value)
      break;
    }
    default:
      break;
  }
}

/* [ FUNÇÕES CALCULO ] */

/**
 * @function simulate - make the fii investment projection
 * @param {number} incial 
 * @param {number} mensal 
 * @param {number} dividendos 
 * @param {number} meses 
 * @param {number} cota 
 * @returns {import('./types').Projecao}
 * */
function calcular_projecao(incial, mensal, cota, dividendo, meses) {
  mensal = mensal * 100;
  cota = cota * 100;
  incial = incial * 100;
  const dividendo_mes = dividendo / 12;
  /** @type {import('./types').Projecao} */
  const result = {
    mes: [1],
    investido: [incial],
    cotas: [Math.trunc(incial/cota)],
    valor: [Math.trunc(incial/cota)*cota],
    sobra: [incial%cota],
    cotas_dividendo_mensal: [Math.trunc(incial/cota) * 100 * dividendo_mes / cota],
    cotas_dividendo_acumulado: [Math.trunc(incial/cota) * 100 * dividendo_mes / cota],
    dividendo_mensal: [Math.trunc(incial/cota) * dividendo_mes],
    dividendo_acumulado: [Math.trunc(incial/cota) * dividendo_mes],
    size: meses,
  }
  for (let i=1; i < meses; i++) {
    result.mes.push(i+1);
    result.investido.push(result.investido[result.investido.length -1] + mensal + result.dividendo_mensal[result.dividendo_mensal.length-1]);
    result.sobra.push(result.investido[result.investido.length-1] % cota);
    result.cotas.push(Math.trunc(result.investido[result.investido.length-1] / cota));
    result.valor.push(result.cotas[result.cotas.length-1] * cota);
    result.dividendo_mensal.push(result.cotas[result.cotas.length-1] * dividendo_mes);
    result.dividendo_acumulado.push(result.cotas[result.cotas.length-1] * dividendo_mes + result.dividendo_acumulado.reduce((acc, n) => acc + n))
    result.cotas_dividendo_mensal.push(result.dividendo_mensal[result.dividendo_mensal.length-1] * 100 / cota);
    result.cotas_dividendo_acumulado.push(result.dividendo_acumulado[result.dividendo_acumulado.length-1] * 100 / cota);
  }
  return result;
}

/**
 * @param {HTMLDivElement} element 
 * @param {import('./types').Projecao} projecao 
 * @param {number} length 
 * */
function update_table(element, projecao) {
  element.innerHTML = "";
  for (let i=0; i < projecao.size; i++) {
    const row = document.createElement("tr");
    for (const [k,v] of Object.entries(projecao)) {
      if (k!=="size") {
        const cell = document.createElement("td");
        if (k==="mes"||k==="cotas") {
          cell.textContent = v[i];
        } else if (k === "cotas_dividendo_mensal" || k === "cotas_dividendo_acumulado") {
          cell.textContent = to_fixed_floor(v[i]/100, 2);
        } else {
          cell.textContent = brFormatter.format(to_fixed_floor(v[i]/100, 2));
        }
        row.appendChild(cell);
      }
    }
    element.appendChild(row);
  }
}

/* [ UTILS ] */

/**
 * @param {number} num 
 * @param {number} decimals
 * */
function to_fixed_floor(num, decimals) {
  const factor = Math.pow(10, decimals);
  const floored_num = Math.floor(num * factor) / factor;
  return floored_num.toFixed(decimals);
}

/**
 * @param {string} content 
 * @returns {string}
 * */
function replace_dot_to_comma(content) {
  return content
    .replaceAll(',', '[dot2comma]')
    .replaceAll('.', ',')
    .replaceAll('[dot2comma]','.');
}

/**
 * @param {string} content 
 * */
function replace_comma_to_dot(content) {
  content
    .replaceAll(/\./g, '[comma2dot]')
    .replaceAll(/\,/g, '.')
    .replaceAll(/[comma2dot]/g, ',');
  
}

