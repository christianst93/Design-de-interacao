class MyProva extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.dados = [
            { q: "Qual a capital da França?", a: ["Londres", "Paris", "Berlim"], c: 1 },
            { q: "Quanto é 5 + 5?", a: ["10", "15", "20"], c: 0 },
            { q: "Qual linguagem usamos para estruturar páginas?", a: ["Java", "CSS", "HTML"], c: 2 }
        ];
    }

    connectedCallback() { this.render(); }

    render() {
        let html = `
        <style>
            :host { display: block; text-align: center; font-family: 'Montserrat', sans-serif; color: #1a1a1a; }
            .pergunta { text-align: left; max-width: 550px; margin: 25px auto; padding: 15px; }
            
            label { 
                display: block; padding: 12px; margin: 8px 0; cursor: pointer; 
                border-radius: 8px; background: rgba(255, 255, 255, 0.4); transition: 0.3s; 
            }
            label:hover { background: #9fe1cb; }
            input { margin-right: 10px; transform: scale(1.2); }

            button { 
                background-color: #1d9e75; color: #e1f5ee; border: none; 
                padding: 12px 35px; cursor: pointer; border-radius: 6px; 
                font-size: 15px; font-weight: 700; transition: all 0.2s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            button:hover { background-color: #163030; transform: translateY(-2px); }
            button:active { transform: translateY(0); }

            #res { margin-top: 30px; padding-bottom: 40px; }
            .c { color: #0cce36; font-weight: bold; } 
            .e { color: #e61212; }
        </style>

        <form id="prova">
            <h2>Prova Online</h2>
            ${this.dados.map((item, i) => `
                <div class="pergunta">
                    <p><strong>${i + 1}. ${item.q}</strong></p>
                    ${item.a.map((alt, j) => `
                        <label><input type="radio" name="q${i}" value="${j}" required> ${alt}</label>
                    `).join('')}
                </div>
            `).join('')}
            <button type="submit">Corrigir Prova</button>
        </form>
        <div id="res"></div>`;

        this.shadowRoot.innerHTML = html;
        this.shadowRoot.querySelector('form').onsubmit = (e) => {
            e.preventDefault();
            this.corrigir();
        };
    }

    corrigir() {
        let nota = 0;
        let info = "";

        this.dados.forEach((item, i) => {
            const sel = this.shadowRoot.querySelector(`input[name="q${i}"]:checked`).value;
            const acertou = parseInt(sel) === item.c;
            if (acertou) nota++;
            info += `<p class="${acertou ? 'c' : 'e'}">Questão ${i+1}: ${acertou ? '✔ Acertou' : '✘ Errou (Certo: ' + item.a[item.c] + ')'}</p>`;
        });

        this.shadowRoot.getElementById('res').innerHTML = `
            <hr style="width:50%; margin: 20px auto; opacity: 0.3;">
            ${info} 
            <h3 style="margin: 15px 0;">Nota Final: ${(nota / this.dados.length * 10).toFixed(1)}</h3>
            <button onclick="this.getRootNode().host.render()">Refazer Prova</button>
        `;
    }
}
customElements.define('my-prova', MyProva);