'use strict';
document.addEventListener("DOMContentLoaded",function(){var id=new URLSearchParams(location.search).get("module");if(id&&Object.hasOwn(QuidenceChallengeBank.MODULES,id))document.getElementById("project-start").href="../projects/?module="+encodeURIComponent(id);});
