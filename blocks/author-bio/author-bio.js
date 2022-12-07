import { createTag, getMetadata } from '../../scripts/scripts.js';

export default function decorate(block) {
  const defaultAuthorImageSrc = '../../styles/favicon-thumbnail-merative.svg';
  const defaultAuthor = 'Merative';

  let authorImage = getMetadata('authorimage');
  const readtime = getMetadata('readtime');
  let author = getMetadata('author');

  author = author || defaultAuthor;
  authorImage = authorImage || defaultAuthorImageSrc;

  block.innerHTML = '';
  const authorImageTag = createTag('img', { class: 'author-img' });
  authorImageTag.setAttribute('src', authorImage);
  authorImageTag.setAttribute('alt', 'author-image');
  const authorNameTag = createTag('span', { class: 'author-name' });
  authorNameTag.innerHTML = 'By ';
  const authorNameHighlight = createTag('span', { class: 'author-name-hightlight' });
  authorNameHighlight.innerHTML = `${author}`;
  authorNameTag.append(authorNameHighlight);
  block.append(authorImageTag, authorNameTag);

  if (readtime) {
    const pipeTag = createTag('span', { class: 'pipe' });
    pipeTag.innerHTML = '|';
    const readtimeTag = createTag('span', { class: 'readtime' });
    readtimeTag.innerHTML = readtime;
    block.append(pipeTag, readtimeTag);
  }
}
