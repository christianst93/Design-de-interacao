class MyHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Montserrat", sans-serif !important;
                line-height: 1.6 !important;
                letter-spacing: normal !important;
                text-transform: none !important;
            }

            header {
                text-align: center;
                color: #fdfdfd !important;
                background-color: #1e3a3a !important;
                padding: 20px !important;
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }

            header h1 { 
                font-size: 20px !important; 
                font-weight: 700 !important;
                margin: 0 !important;
                color: #fdfdfd !important;
                display: block !important;
            }

            hr {
                border: none !important;
                border-top: 1px solid #0f2020 !important;
                margin: 0 !important;
                display: block !important;
            }

            nav {
                width: 100% !important;
                background-color: #163030 !important;
                display: flex !important;
                justify-content: center !important;
                padding: 12px 20px !important;
            }

            .botoes {
                display: flex !important;
                gap: 10px !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                width: 100% !important;
                max-width: 800px !important;
            }

            .botoes a {
                text-decoration: none !important;
                background-color: #1d9e75 !important;
                color: #e1f5ee !important;
                padding: 6px 14px !important;
                border-radius: 6px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                transition: 0.2s !important;
                display: inline-block !important;
                text-align: center !important;
            }

            .botoes a:hover {
                background-color: #9fe1cb !important;
                color: #0f6e56 !important;
            }

            @media (max-width: 600px) {
                header h1 { font-size: 18px !important; }
                .botoes a { flex: 1 1 calc(50% - 10px) !important; }
            }
        </style>
        <header>
            <h1>Trabalhos Design de interação</h1>                
        </header>
        <hr>
        <nav>
            <div class="botoes">
                <a href="../Apresentacao_trabalhos/index.html">Apresentação</a>
                <a href="../Trabalho_1/index.html">Trabalho 1</a>
                <a href="../Trabalho_2/index.html">Trabalho 2</a>
                <a href="../Trabalho_3/index.html">Trabalho 3</a>
                <a href="../Trabalho_4/index.html">Trabalho 4</a>
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

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Montserrat", sans-serif !important;
            }

            footer { 
                background-color: #1e3a3a !important;
                color: #9fe1cb !important;
                text-align: center !important; 
                padding: 24px 20px !important; 
                font-size: 13px !important;
                display: block !important;
                line-height: 1.6 !important;
            }
            footer p {
                margin: 4px 0 !important;
            }
            footer a { 
                color: #ffffff !important; 
                text-decoration: none !important; 
                transition: 0.2s !important; 
            }
            footer a:hover { 
                color: #9fe1cb !important; 
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