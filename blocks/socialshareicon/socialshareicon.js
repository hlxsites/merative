export default function decorate(block) {

    const socialshareicon = block.parentNode.parentNode;
    block.textContent = '';
    const blogContent = document.createElement('div');
    blogContent.classList.add('blog-content');
    socialshareicon.append(blogContent);
    const childrenDiv = document.getElementById('blog-right-nav').querySelectorAll("div");
    childrenDiv.forEach(div => {
        blogContent.append(div);
    });
    document.getElementById('blog-right-nav').remove();
    AnchorTagCreation("linkedIn", block);
    AnchorTagCreation("twitter", block);
    AnchorTagCreation("facebook", block);
    AnchorTagCreation("shareLink", block);
}

function AnchorTagCreation(scoialMedia, block) {
    var clsName = "social-share-" + scoialMedia;
    var txtNode = scoialMedia;
    var _sid = "social_share_link" + scoialMedia;
    var _a = document.createElement('a');
    _a.setAttribute('class', clsName);
    _a.setAttribute("id", _sid);
    _a.title = scoialMedia;
    _a.href = "javascript:void(0)";
    block.append(_a);
    document.getElementById(_sid).addEventListener('click', openLink);
}

function openLink(e) {
    var idName = e.target.getAttribute("id");
    if (idName !== null) {
        if (idName.includes("linkedIn")) {
            var url = "https://www.linkedin.com/sharing/share-offsite/?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes("twitter")) {
            var url = "https://twitter.com/share?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes("facebook")) {
            var url = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes("shareLink")) {
            navigator.clipboard.writeText(window.location.href);
        }

    }
}
