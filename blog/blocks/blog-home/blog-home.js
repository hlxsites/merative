import { getAllBlogs, createCard, getBlogCategoryPages } from '../../scripts/scripts.js';

const NUM_CARDS_SHOWN_AT_A_TIME = 6;
let loadMoreElement;

function loadMoreCards(num) {
  const numCards = num !== undefined ? num : NUM_CARDS_SHOWN_AT_A_TIME;
  // Get cards that are not hidden and not active to load them
  const activeCards = document.querySelectorAll('.blog-card:not([aria-hidden="true"]):not([card-active="true"])');
  if (activeCards) {
    activeCards.forEach((activeCard, i) => {
      if (i < numCards) activeCard.setAttribute('card-active', 'true');
    });
    if (activeCards.length > numCards) {
      if (loadMoreElement.hasAttribute('aria-hidden')) loadMoreElement.removeAttribute('aria-hidden');
      loadMoreElement.innerHTML = `Load More (${(activeCards.length - numCards)})`;
    } else {
      loadMoreElement.innerHTML = 'Load More (0)';
      loadMoreElement.setAttribute('aria-hidden', 'true');
    }
  } else {
    loadMoreElement.innerHTML = 'Load More (0)';
    loadMoreElement.setAttribute('aria-hidden', 'true');
  }
}

function deselectAllCheckboxes() {
  // Deselect val from the checkbox list if it is selected
  const checkboxes = document.querySelectorAll('input[type=checkbox][name=blogFilters]');
  if (checkboxes.length) {
    const selectedCheckboxes = Array.from(checkboxes).filter((i) => i.checked);
    if (selectedCheckboxes.length) {
      selectedCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }
}

function toggleBodyOverflow(val) {
  const body = document.querySelector('body');
  if (val) {
    body.setAttribute('filters-open', val);
  } else {
    const filtersOpen = body.getAttribute('filters-open') === 'true';
    body.setAttribute('filters-open', filtersOpen ? 'false' : 'true');
  }
}

function updateFiltersCount(count) {
  // update the number of checked filters to show in mobile and tablet views
  const mobileFiltersCount = document.querySelector('.blog-home .filters > .filters-header > h4');
  mobileFiltersCount.innerHTML = `Filters (${count})`;
}

function clearFilters() {
  // get's called when nothing is selected. every card shows
  const hiddenCards = document.querySelectorAll('.blog-card');
  hiddenCards.forEach((card) => {
    card.removeAttribute('aria-hidden');
    card.setAttribute('card-active', 'false');
  });

  // clear our selected filters on the top
  const selectedFilters = document.querySelector('.blog-home .selected-filters');
  const selectedFiltersList = selectedFilters.querySelector('.selected-filters-list');
  selectedFiltersList.textContent = '';
  const selectedFiltersTitle = selectedFilters.querySelector('.selected-filters-title');
  selectedFiltersTitle.textContent = '';
  updateFiltersCount('0');
  loadMoreCards(7);
}

async function createCheckboxList(label) {
  const div = document.createElement('div');
  const inputEl = document.createElement('input');
  inputEl.setAttribute('type', 'checkbox');
  inputEl.setAttribute('name', 'blogFilters');
  inputEl.setAttribute('id', label);
  inputEl.setAttribute('value', label);
  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', label);
  labelEl.append(label);
  div.append(inputEl);
  div.append(labelEl);
  return (div);
}

function uncheckCheckbox(val) {
  // Deselect val from the checkbox list if it is selected
  const checkboxes = document.querySelectorAll('input[type=checkbox][name=blogFilters]');
  if (checkboxes.length) {
    const selectedCheckboxes = Array.from(checkboxes).filter((i) => i.checked);
    if (selectedCheckboxes.length) {
      selectedCheckboxes.forEach((checkbox) => {
        if ((checkbox.value === val) && (checkbox.checked === true)) {
          checkbox.checked = false;
          // update the cards to reflect the deselection
          // eslint-disable-next-line no-use-before-define
          refreshCards();
        }
      });
    }
  }
}

function refreshCards() {
  let hits = 0;
  const checkboxes = document.querySelectorAll('input[type=checkbox][name=blogFilters]');
  // Convert checkboxes to an array to use filter and map.
  // Use Array.filter to remove unchecked checkboxes.
  // Use Array.map to extract only the checkbox values from the array of objects.
  const checkedList = Array.from(checkboxes).filter((i) => i.checked).map((i) => i.value);
  updateFiltersCount(checkedList.length);
  if (checkedList.length) {
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card) => {
      card.setAttribute('aria-hidden', 'true');
      card.setAttribute('card-active', 'false');
      if (card.hasAttribute('topics')) {
        const filterGroupValues = card.getAttribute('topics').split(',');
        const found = filterGroupValues
          .some((checkedItem) => checkedList.includes(checkedItem.trim()));
        if (found) {
          card.removeAttribute('aria-hidden');
        }
      }
      if (card.hasAttribute('audiences')) {
        const filterGroupValues = card.getAttribute('audiences').split(',');
        const found = filterGroupValues
          .some((checkedItem) => checkedList.includes(checkedItem.trim()));
        if (found) {
          card.removeAttribute('aria-hidden');
        }
      }
      if (!(card.hasAttribute('aria-hidden'))) hits += 1;
      if (hits < NUM_CARDS_SHOWN_AT_A_TIME) card.setAttribute('card-active', 'true');
    });

    // update load more number
    if (hits.length > NUM_CARDS_SHOWN_AT_A_TIME) {
      if (loadMoreElement.hasAttribute('aria-hidden')) loadMoreElement.removeAttribute('aria-hidden');
      loadMoreElement.innerHTML = `Load More (${(hits.length - NUM_CARDS_SHOWN_AT_A_TIME)})`;
    } else {
      loadMoreElement.innerHTML = 'Load More (0)';
      loadMoreElement.setAttribute('aria-hidden', 'true');
    }

    // refresh selected filters at the top
    const selectedFilters = document.querySelector('.blog-home .selected-filters');
    const selectedFiltersTitle = selectedFilters.querySelector('.selected-filters-title');
    selectedFiltersTitle.innerHTML = '<h4>Showing results for</h4><br />';
    const selectedFiltersList = selectedFilters.querySelector('.selected-filters-list');

    // Clear out any existing filters before showing the new ones based on filterGroup
    selectedFiltersList.textContent = '';

    checkedList.forEach((val) => {
      const selectedValue = document.createElement('div');
      selectedValue.classList.add('selected-value');
      selectedValue.append(val);
      selectedFiltersList.append(selectedValue);
      // Add another event listener for click events to remove this item and uncheck the checkbox
      selectedValue.addEventListener('click', () => {
        uncheckCheckbox(val);
        selectedValue.innerText = '';
      });
    });
  } else {
    clearFilters();
  }
}

async function addEventListeners(checkboxes) {
  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', refreshCards));
}

async function createCategories(categoriesList) {
  const categoriesElement = document.createElement('div');
  categoriesElement.classList.add('categories');
  const catLabel = document.createElement('span');
  catLabel.classList.add('category-title');
  catLabel.append('Categories');
  categoriesElement.append(catLabel);
  categoriesList.forEach((row) => {
    if ((row.path !== '0') && (row.title !== '0')) {
      const link = document.createElement('a');
      link.classList.add('category-link');
      link.href = row.path;
      if (window.location.pathname === row.path) {
        link.classList.add('active');
        if (row.title) link.innerHTML += `<h5>${row.title}</h5>`;
      } else if (row.title) link.innerHTML += `${row.title}`;
      categoriesElement.append(link);
    }
  });
  return (categoriesElement);
}

async function createFilters(categories, topics, audiences) {
  // Create DOM elements for topics and audiences to display in the left nav
  // Root filters div
  const filters = document.createElement('div');
  filters.classList.add('filters');
  filters.setAttribute('aria-expanded', 'false');

  // Filters main section
  const filtersMain = document.createElement('div');
  filtersMain.classList.add('filters-main');

  // Filters footer section
  const filtersFooter = document.createElement('div');
  filtersFooter.classList.add('filters-footer');
  const applyDiv = document.createElement('div');
  applyDiv.classList.add('apply');
  applyDiv.innerHTML = 'Apply';
  const resetDiv = document.createElement('div');
  resetDiv.classList.add('reset');
  resetDiv.innerHTML = 'Reset';
  filtersFooter.append(applyDiv);
  filtersFooter.append(resetDiv);

  // Filters header section
  const filtersHeader = document.createElement('div');
  filtersHeader.classList.add('filters-header');
  filtersHeader.innerHTML = '<h4>Filters</h4>';
  filtersHeader.addEventListener('click', () => {
    const expanded = filters.getAttribute('aria-expanded') === 'true';
    filters.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    toggleBodyOverflow();
  });
  const filtersHeaderArrow = document.createElement('div');
  filtersHeaderArrow.classList.add('arrow');
  filtersHeader.append(filtersHeaderArrow);

  // Add sticky shadow to header if any scroll
  filtersMain.addEventListener('scroll', () => {
    if (filtersMain.scrollTop > 0) {
      filtersHeader.classList.add('is-sticky');
    } else {
      filtersHeader.classList.remove('is-sticky');
    }
  });

  // Add Apply and Reset listeners
  applyDiv.addEventListener('click', () => {
    toggleBodyOverflow();
    filters.setAttribute('aria-expanded', 'false');
  });
  resetDiv.addEventListener('click', () => {
    // clear the filters & refresh cards, deselect any checked checkboxes,
    // close the filter modal and make sure body scroll is back to normal
    clearFilters();
    deselectAllCheckboxes();
    toggleBodyOverflow('false');
    filters.setAttribute('aria-expanded', 'false');
  });

  // Adding some key press listeners as well
  // document.body.addEventListener('keyup', (e) => {
  //   const filterExpanded = filters.getAttribute('aria-expanded');
  //   if (filterExpanded === 'true') {
  //     if (e.key === 'Escape') {
  //       filters.setAttribute('aria-expanded', 'false');
  //     } else if (e.key === 'Enter') {
  //       filters.setAttribute('aria-expanded', 'false');
  //     }
  //   }
  // });

  // Audience filters
  const audiencesElement = document.createElement('div');
  audiencesElement.classList.add('audiences');
  audiencesElement.setAttribute('aria-expanded', 'true');
  const audienceLabel = document.createElement('span');
  audienceLabel.classList.add('list-title');
  audienceLabel.append('Audience');
  audiencesElement.append(audienceLabel);
  audienceLabel.addEventListener('click', () => {
    const expanded = audiencesElement.getAttribute('aria-expanded') === 'true';
    audiencesElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  if (audiences.size) {
    await audiences.forEach(async (audience) => {
      audiencesElement.append(await createCheckboxList(audience));
    });
    filtersMain.append(audiencesElement);
  }

  // Topic filters
  const topicsElement = document.createElement('div');
  topicsElement.classList.add('topics');
  topicsElement.setAttribute('aria-expanded', 'true');
  const topicLabel = document.createElement('span');
  topicLabel.classList.add('list-title');
  topicLabel.append('Topic');
  topicsElement.append(topicLabel);
  topicLabel.addEventListener('click', () => {
    const expanded = topicsElement.getAttribute('aria-expanded') === 'true';
    topicsElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  if (topics.size) {
    await topics.forEach(async (topic) => {
      topicsElement.append(await createCheckboxList(topic));
    });
    filtersMain.append(topicsElement);
  }

  // Add event listeners to all Checkboxes
  const blogFilters = filtersMain.querySelectorAll('input[type=checkbox][name=blogFilters]');
  await addEventListeners(blogFilters);

  // Add Categories to filters main section
  filtersMain.prepend(await createCategories(categories));

  // Add Blog home link to the top of filters main section
  const blogHomeEl = document.createElement('div');
  blogHomeEl.classList.add('blog-home-link');
  const blogHomeLink = document.createElement('a');
  blogHomeLink.classList.add('category-link');
  blogHomeLink.href = '/blog';
  if (/(^\/blog$)/.test(window.location.pathname)) {
    blogHomeLink.classList.add('active');
    blogHomeLink.innerHTML += '<h5>Merative Blog</h5>';
  } else {
    blogHomeLink.innerHTML += 'Merative Blog';
  }
  blogHomeEl.append(blogHomeLink);
  filtersMain.prepend(blogHomeEl);
  filters.prepend(filtersHeader);
  filters.append(filtersMain);
  filters.append(filtersFooter);
  return (filters);
}

export default async function decorate(block) {
  const category = block.textContent.trim();
  block.textContent = '';
  // Make a call to get all blog details from the blog index
  const blogList = await getAllBlogs(category);
  const categoriesList = await getBlogCategoryPages();
  const topics = new Set();
  const audiences = new Set();
  if (blogList.length) {
    const blogContent = document.createElement('div');
    blogContent.classList.add('blog-content');
    // Get default content in this section and add it to blog-content
    const defaultContent = document.querySelectorAll('.blog-home-container > .default-content-wrapper');
    defaultContent.forEach((div) => blogContent.append(div));

    // Create the selected filters DOM structure
    const selectedFilters = document.createElement('div');
    selectedFilters.classList.add('selected-filters');
    const selectedFiltersTitle = document.createElement('div');
    selectedFiltersTitle.classList.add('selected-filters-title');
    const selectedFiltersList = document.createElement('div');
    selectedFiltersList.classList.add('selected-filters-list');
    selectedFilters.append(selectedFiltersTitle);
    selectedFilters.append(selectedFiltersList);

    // Create blog cards DOM structure
    const blogCards = document.createElement('div');
    blogCards.classList.add('blog-cards');
    await blogList.forEach(async (row, i) => {
      const blogCard = await createCard(row, 'blog-card');
      // first render show featured article and 6 cards so total 7
      // If featured article, then add class name and make active no matter what
      if (row.featuredArticle && row.featuredArticle === 'true') {
        blogCard.classList.add('featured-article');
      }
      if (i < (NUM_CARDS_SHOWN_AT_A_TIME + 1)) {
        blogCard.setAttribute('card-active', 'true');
      } else {
        blogCard.setAttribute('card-active', 'false');
      }
      if (row.topic && row.topic !== '0') {
        blogCard.setAttribute('topics', row.topic);
        const topicValues = row.topic.split(',');
        topicValues.forEach((topicValue) => {
          if (topicValue.trim() !== '') topics.add(topicValue.trim());
        });
      }
      if (row.audience && row.audience !== '0') {
        blogCard.setAttribute('audiences', row.audience);
        const audienceValues = row.audience.split(',');
        audienceValues.forEach((audienceValue) => {
          if (audienceValue.trim() !== '') audiences.add(audienceValue.trim());
        });
      }
      blogCards.append(blogCard);
    });

    // Load More button
    loadMoreElement = document.createElement('div');
    loadMoreElement.classList.add('load-more');
    if (blogList.length > (NUM_CARDS_SHOWN_AT_A_TIME + 1)) {
      loadMoreElement.innerHTML = `Load More (${(blogList.length - (NUM_CARDS_SHOWN_AT_A_TIME + 1))})`;
    } else {
      loadMoreElement.innerHTML = 'Load More (0)';
      loadMoreElement.setAttribute('aria-hidden', 'true');
    }
    loadMoreElement.addEventListener('click', () => {
      loadMoreCards();
    });

    blogContent.append(await createFilters(categoriesList, topics, audiences));
    blogContent.append(selectedFilters);
    blogContent.append(blogCards);
    blogContent.append(loadMoreElement);
    block.append(blogContent);
  } else {
    block.remove();
  }
}
