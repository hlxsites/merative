import { createTag } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

const embedMarketoForm = (formId, divId) => {
  // PDF Viewer for doc pages
  if (formId && divId) {
    const mktoScriptTag = loadScript('//go.merative.com/js/forms2/js/forms2.min.js');
    mktoScriptTag.onload = () => {
      window.MktoForms2.loadForm('//go.merative.com', `${formId}`, divId);
    };
  }
};

export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  const formId = blockConfig['form-id'];
  const divId = blockConfig['div-id'];

  // Handle H2s in the section
  const section = block.parentElement.parentElement;
  if (section.children.length > 0) section.classList.add('multiple');
  const h2 = section.querySelector('h2');

  if (h2 && h2.parentElement) {
    h2.parentElement.classList.add('h2');
    section.classList.add('h2');
  }

  if (formId && divId) {
    const formDiv = createTag('form', { id: `mktoForm_${divId}` });
    block.textContent = '';
    block.append(formDiv);

    window.setTimeout(() => embedMarketoForm(formId, divId), 3000);
  }
}
