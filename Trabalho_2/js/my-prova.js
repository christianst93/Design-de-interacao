class MyProva extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questoes = [
            { q: "Qual a capital da França?", a: ["Londres", "Paris", "Berlim"], c: 1 },
            { q: "Quanto é 5 + 5?", a: ["10", "15", "20"], c: 0 },
            { q: "Qual linguagem usamos para estruturar páginas?", a: ["Java", "CSS", "HTML"], c: 2 }
        ];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const style = `<style>
            :host { display: block; font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .questao { margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #eee; }
            label { display: block; margin: 5px 0; cursor: pointer; }
            button { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
            .resultado { margin-top: 20px; padding: 15px; background: #f8f9fa; border-left: 5px solid #007bff; }
            .correta { color: green; font-weight: bold; }
            .errada { color: red; }
        </style>`;

        let html = `<h2>Prova Online</h2>`;
        this.questoes.forEach((item, i) => {
            html += `<div class="questao">
                <p><strong>${i + 1}. ${item.q}</strong></p>
                ${item.a.map((alt, j) => `
                    <label>
                        <input type="radio" name="q${i}" value="${j}" required> ${alt}
                    </label>
                `).join('')}
            </div>`;
        });

        html += `<button id="btn-verificar">Corrigir Prova</button><div id="res"></div>`;
        this.shadowRoot.innerHTML = style + html;
        this.shadowRoot.getElementById('btn-verificar').onclick = () => this.corrigir();
    }

    corrigir() {
        let nota = 0;
        let feedback = "<h3>Resultado:</h3>";
        
        this.questoes.forEach((item, i) => {
            const selecionado = this.shadowRoot.querySelector(`input[name="q${i}"]:checked`);
            const respUser = selecionado ? parseInt(selecionado.value) : -1;
            
            if (respUser === item.c) {
                nota++;
                feedback += `<p class="correta">Q${i+1}: Você acertou! (${item.a[item.c]})</p>`;
            } else {
                feedback += `<p class="errada">Q${i+1}: Errou. Respondeu: ${respUser >= 0 ? item.a[respUser] : 'Nada'}. Correta: ${item.a[item.c]}</p>`;
            }
        });

        const total = ((nota / this.questoes.length) * 10).toFixed(1);
        this.shadowRoot.getElementById('res').innerHTML = `${feedback} <h4>Nota Final: ${total}</h4> 
        <button onclick="this.getRootNode().host.render()">Refazer Prova</button>`;
    }
}
customElements.define('my-prova', MyProva);