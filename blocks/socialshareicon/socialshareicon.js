import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
var socialshareicon = null;
export default function decorate(block) {
    /* change to ul, li */
    const ul = document.createElement('ul');
    [...block.children].forEach((row) => {
        const li = document.createElement('li');
        li.innerHTML = row.innerHTML;
        ul.append(li);
    });
    ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    block.textContent = '';
    block.append(ul);
    for (var j = 0; j < block.children[0].children.length; j++) {
        var url = block.children[0].children[j].children[0].children[0].getAttribute(("href"));
        var result = "share_" + url.replace(/(^\w+:|^)\/\//, '');
        block.children[0].children[j].children[0].children[0].setAttribute('href', 'javascript:void(0)');
        block.children[0].children[j].children[0].children[0].setAttribute("id", result);
        document.getElementById(result).addEventListener('click', openLink);
    }

    /*socialshareicon = block.parentElement;
    console.log(block.parentElement.parentElement);
    window.addEventListener('scroll', () => {
        const scrollAmount = window.scrollY;
        const elmnt = document.getElementsByClassName("columns-wrapper");

        console.log("scrollAmount:", scrollAmount);
        console.log("Offset height : " + elmnt.offsetHeight);

        if (scrollAmount > elmnt.offsetHeight) {
            socialshareicon.classList.remove('is-sticky');
        } else {

            socialshareicon.classList.add('is-sticky');
        }

        /*if (scrollAmount > socialshareicon.offsetHeight) {
            socialshareicon.classList.add('is-sticky');
        } else {

            socialshareicon.classList.remove('is-sticky');
        }
    });*/
}


function openLink(e) {
    var idName = e.target.parentElement.parentElement.getAttribute("id");
    if (idName !== null) {
        if (idName.includes("linkedin")) {
            var url = "https://www.linkedin.com/sharing/share-offsite/?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes("twitter")) {
            var url = "https://twitter.com/share?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes("facebook")) {
            var url = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        }

    }
}