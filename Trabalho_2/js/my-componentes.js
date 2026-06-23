class MyHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');

            header {
                text-align: center;
                color: #fdfdfd;
                background-color: #1e3a3a;
                padding: 20px;
            }
            header h1 { 
                font-family: "Montserrat", sans-serif;
                font-size: 20px; 
                font-weight: 700;
                margin: 0;
            }
            hr {
                border: none;
                border-top: 1px solid #0f2020;
                margin: 0;
            }
            nav {
                width: 100%;
                padding: 12px 20px;
                background-color: #163030;
            }
            .botoes {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: flex-start;
                max-width: 1160px;
                margin: 0 auto;
            }
            .botoes a {
                font-family: "Montserrat", sans-serif;
                text-decoration: none;
                background-color: #1d9e75;
                color: #e1f5ee;
                padding: 6px 14px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                transition: 0.2s;
            }
            .botoes a:hover {
                background-color: #9fe1cb;
                color: #0f6e56;
            }
            @media (max-width: 600px) {
                header h1 { font-size: 18px; }
                .botoes { justify-content: center; }
                .botoes a { flex: 1 1 calc(50% - 10px); text-align: center; }
            }
        </style>
        <header>
            <div>
                <h1>Trabalhos Design de interação</h1>                
            </div>
        </header>
        <hr>
        <nav>
            <div class="botoes">
                <a href="/Design-de-interacao/Apresentacao_trabalhos/index.html">Apresentação</a>
                <a href="/Design-de-interacao/Trabalho_1/">Trabalho 1</a>
                <a href="/Design-de-interacao/Trabalho_2/">Trabalho 2</a>
                <a href="/Design-de-interacao/Trabalho_3/">Trabalho 3</a>
                <a href="/Design-de-interacao/Trabalho_4/">Trabalho 4</a>
            </div>
        </nav>`;
    }
}
customElements.define('my-header', MyHeader);

class MyFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
            
            footer { 
                background-color: #1e3a3a;
                color: #9fe1cb;
                text-align: center; 
                padding: 24px 20px; 
                font-size: 13px;
                font-family: "Montserrat", sans-serif;
            }
            footer p {
                margin: 4px 0;
            }
            footer a { 
                color: #ffffff; 
                text-decoration: none; 
                transition: 0.2s; 
            }
            footer a:hover { 
                color: #9fe1cb; 
            }
        </style>
        <footer>
            <p>Disciplina: Design de interação | Aluno: Christian Torres</p>
            <p>
                <a href="https://github.com/christianst93" target="_blank">github.com/christianst93</a>
            </p>
        </footer>`;
    }
}
customElements.define('my-footer', MyFooter);