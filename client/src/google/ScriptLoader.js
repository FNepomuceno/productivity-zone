class ScriptLoader {
    static instance;

    constructor() {
        if (ScriptLoader.instance) { return ScriptLoader.instance; }

        ScriptLoader.instance = this;

        this.value = new Promise((resolve, reject) => {
            let tag = document.createElement('script');

            tag.type = 'text/javascript';
            tag.src = 'https://accounts.google.com/gsi/client';

            tag.addEventListener('load', () => {
                resolve(window.google);
            });

            tag.addEventListener('error', (e) => {
                reject(e);
            });

            document.body.appendChild(tag);
        });
    }
}

export default ScriptLoader;
