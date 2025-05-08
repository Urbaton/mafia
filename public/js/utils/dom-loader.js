export async function loadTemplate(path) {
    const res = await fetch(path);
    const html = await res.text();
    const container = document.createElement('div');
    container.innerHTML = html;

    const template = container.querySelector('template');
    const clone = template.content.cloneNode(true);

    return clone;
}
