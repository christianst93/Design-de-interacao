
class MyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <div>
                <h1>Trabalho 2</h1>
                <p>prova online</p>
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
        <style>footer { text-align: center; padding: 1rem; color: #666; }</style>
        <footer>
            <p>Disciplina: Design de interação | Aluno: Christian Torres</p>
            <p>
                <a href="https://github.com/christianst93" target="_blank">github.com/christianst93</a>
            </p>
        </footer>`;
    }
}
customElements.define('my-footer', MyFooter);