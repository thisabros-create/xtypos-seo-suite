let activeApiKey = "";

document.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("xtypos_gemini_key");
  if (savedKey) {
    activeApiKey = savedKey;
    document.getElementById("apiKeyInput").value = savedKey;
    setKeyStatus(true);
  }
});

function setKeyStatus(active) {
  const badge = document.getElementById("apiStatusBadge");
  if (active) {
    badge.className = "badge bg-success";
    badge.innerText = "Key Active";
  } else {
    badge.className = "badge bg-danger";
    badge.innerText = "No Key";
  }
}

function saveApiKey() {
  const key = document.getElementById("apiKeyInput").value.trim();
  if (key !== "") {
    activeApiKey = key;
    localStorage.setItem("xtypos_gemini_key", key);
    setKeyStatus(true);
    alert("Το API Key αποθηκεύτηκε επιτυχώς στον περιηγητή σας!");
  } else {
    alert("Παρακαλώ εισάγετε πρώτα το API Key.");
  }
}

document.getElementById("articleContent").addEventListener("input", function() {
  const text = this.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  document.getElementById("wordCount").innerText = words;
  document.getElementById("readTime").innerText = Math.ceil(words / 200);
});

function updateSerp() {
  const title = document.getElementById("metaTitleInput").value;
  const desc = document.getElementById("metaDescInput").value;
  
  document.getElementById("serpTitlePreview").innerText = title || "Τίτλος Άρθρου στο ΧΤΥΠΟ";
  document.getElementById("serpDescPreview").innerText = desc || "Περιγραφή άρθρου...";

  const tLen = title.length;
  const dLen = desc.length;

  document.getElementById("titleCounter").innerText = `${tLen} / 60 char`;
  document.getElementById("titleCounter").className = `badge badge-counter ${tLen > 60 ? 'bg-danger' : tLen >= 50 ? 'bg-success' : 'bg-secondary'}`;

  document.getElementById("descCounter").innerText = `${dLen} / 155 char`;
  document.getElementById("descCounter").className = `badge badge-counter ${dLen >= 120 && dLen <= 155 ? 'bg-success' : 'bg-secondary'}`;
}

async function generateSeoWithAi() {
  const apiKey = activeApiKey || document.getElementById("apiKeyInput").value.trim();

  if (!apiKey) {
    alert("Παρακαλώ εισάγετε και αποθηκεύστε το Gemini API Key πάνω δεξιά.");
    return;
  }

  const content = document.getElementById("articleContent").value.trim();
  if (!content) {
    alert("Παρακαλώ επικολήστε πρώτα το κείμενο του άρθρου.");
    return;
  }

  const prompt = `Είσαι ο Senior SEO Editor του ελληνικού ειδησεογραφικού portal "ΧΤΥΠΟΣ" (xtypos.gr). 
Ανάλυσε το παρακάτω κείμενο και επίστρεψε ΑΠΟΚΛΕΙΣΤΙΚΑ ένα έγκυρο JSON object (χωρίς markdown codeblocks) με την εξής δομή:
{
  "title": "SEO Τίτλος (50-60 χαρακτήρες)",
  "meta_description": "Meta description (120-155 χαρακτήρες)",
  "focus_keyword": "Κύρια λέξη-κλειδί",
  "queries": ["Query 1", "Query 2", "Query 3"],
  "tags": "Tag1, Tag2, Tag3",
  "slug": "greeklish-url-slug",
  "internal_links": [{"label": "Τίτλος 1", "url": "https://www.xtypos.gr/..."}],
  "external_links": [{"label": "Φορέας 1", "url": "https://...gov.gr"}]
}

Κείμενο Άρθρου:
${content}`;

  const model = "gemini-3.8-flash";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    
    const resData = JSON.parse(rawText);

    document.getElementById("metaTitleInput").value = resData.title;
    document.getElementById("metaDescInput").value = resData.meta_description;
    document.getElementById("aiFocusKeyword").value = resData.focus_keyword;
    document.getElementById("aiTags").value = resData.tags;
    document.getElementById("aiSlug").value = resData.slug;
    document.getElementById("serpSlugPreview").innerText = resData.slug;

    updateSerp();

    const qList = document.getElementById("aiQueriesList");
    qList.innerHTML = "";
    resData.queries.forEach(q => {
      const li = document.createElement("li");
      li.className = "list-group-item small py-1";
      li.innerText = q;
      qList.appendChild(li);
    });

    const intBox = document.getElementById("internalLinksBox");
    intBox.innerHTML = "";
    resData.internal_links.forEach(l => {
      intBox.innerHTML += `<a href="${l.url}" target="_blank" class="list-group-item list-group-item-action small"><i class="bi bi-link-45deg me-1 text-danger"></i>${l.label}</a>`;
    });

    const extBox = document.getElementById("externalLinksBox");
    extBox.innerHTML = "";
    resData.external_links.forEach(l => {
      extBox.innerHTML += `<a href="${l.url}" target="_blank" rel="noopener" class="list-group-item list-group-item-action small"><i class="bi bi-box-arrow-up-right me-1 text-primary"></i>${l.label}</a>`;
    });

    let readAlsoHtml = `<div class="read-also-box" style="border-left: 4px solid #d9534f; padding: 12px; margin: 18px 0; background-color: #f8f9fa;">\n  <strong style="color: #333;">Διαβάστε επίσης στο Xtypos.gr:</strong>\n  <ul style="margin: 8px 0 0 0; padding-left: 20px;">\n`;
    resData.internal_links.forEach(l => {
      readAlsoHtml += `    <li><a href="${l.url}" style="color: #0056b3; text-decoration: none;">${l.label}</a></li>\n`;
    });
    readAlsoHtml += `  </ul>\ndiv>`;
    document.getElementById("htmlReadAlsoBox").innerText = readAlsoHtml;

    alert("Η ανάλυση ολοκληρώθηκε επιτυχώς!");
  } catch (err) {
    alert("Σφάλμα AI: " + err.message);
  }
}

function copyToClipboard(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.value || el.innerText);
  alert("Αντιγράφηκε!");
}

function copyCodeOutput(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.innerText);
  alert("Ο HTML κώδικας αντιγράφηκε!");
}
