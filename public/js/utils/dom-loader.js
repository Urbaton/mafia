const templateCache = {};

export async function loadTemplate(path) {
    if (templateCache[path]) return templateCache[path];

    const res = await fetch(path);
    const html = await res.text();
    const container = document.createElement('div');
    container.innerHTML = html;

    const template = container.querySelector('template');
    const clone = template.content.cloneNode(true);

    templateCache[path] = clone;
    return clone;
}
