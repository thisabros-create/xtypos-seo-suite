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
 "internal_links": [{"label": "Τίτλος σχετικής κατηγορίας ή Δήμου", "url": "ΕΠΙΛΕΞΕ ΑΠΟΚΛΕΙΣΤΙΚΑ ΥΠΑΡΚΤΟ URL ΑΠΟ ΤΗ ΛΙΣΤΑ ΠΑΡΑΚΑΤΩ"}],
  "external_links": [{"label": "Φορέας 1", "url": "https://...gov.gr"}]
}
ΑΥΣΤΗΡΟΣ ΚΑΝΟΝΑΣ ΓΙΑ ΤΑ INTERNAL LINKS:
Για τα εσωτερικά links, απαγορεύεται αυστηρά να εφευρίσκεις ή να μαντεύεις URLs. Θα χρησιμοποιείς ΠΑΝΤΑ και ΜΟΝΟ πραγματικά URLs από την παρακάτω λίστα του xtypos.gr ανάλογα με τη θεματολογία του κειμένου:

-- ΒΑΣΙΚΕΣ ΚΑΤΗΓΟΡΙΕΣ --
https://www.xtypos.gr/κεντρικό-θέμα/

https://www.xtypos.gr/κοινωνία/

https://www.xtypos.gr/οικονομία/

https://www.xtypos.gr/κατηγορία/ειδήσεις/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/

https://www.xtypos.gr/κατηγορία/περιβάλλον/

https://www.xtypos.gr/κατηγορία/αθλητισμός/

https://www.xtypos.gr/κατηγορία/ελλάδα/

https://www.xtypos.gr/κατηγορία/κόσμος/

https://www.xtypos.gr/κατηγορία/πολιτισμός/

https://www.xtypos.gr/κατηγορία/παιδεία/

https://www.xtypos.gr/κατηγορία/εργασία/

https://www.xtypos.gr/κατηγορία/τεχνολογία/

https://www.xtypos.gr/κατηγορία/υγεία/

https://www.xtypos.gr/κατηγορία/επιχειρήσεις/

https://www.xtypos.gr/κατηγορία/συνεντεύξεις/

https://www.xtypos.gr/κατηγορία/βουλή/

https://www.xtypos.gr/κατηγορία/εκδηλώσεις/

https://www.xtypos.gr/κατηγορία/αφιερώματα/

https://www.xtypos.gr/κατηγορία/ταξίδια/

https://www.xtypos.gr/κατηγορία/ανακοινώσεις/

https://www.xtypos.gr/κατηγορία/ατζέντα/

https://www.xtypos.gr/κατηγορία/δηλώσεις-πολιτικών-δημάρχων/

https://www.xtypos.gr/κατηγορία/επιστολές/

https://www.xtypos.gr/κατηγορία/κεδε/

https://www.xtypos.gr/κατηγορία/impact/

https://www.xtypos.gr/κατηγορία/ελεύθερο-βήμα/

https://www.xtypos.gr/κατηγορία/διασκέδαση/

https://www.xtypos.gr/κατηγορία/εκκλησία/

https://www.xtypos.gr/κατηγορία/γενικά-άρθρα/

https://www.xtypos.gr/κατηγορία/εκλογές/

-- ΔΗΜΟΙ ΑΤΤΙΚΗΣ --

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αγίας-βαρβάρας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αγίας-παρασκευής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αγίου-δημητρίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αγίων-αναργύρων-καματερού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αθηναίων/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αιγάλεω/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αίγινας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αλίμου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αμαρουσίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ασπροπύργου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-αχαρνών/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-βάρης-βούλας-βουλιαγμένης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-βριλησσίων/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-βύρωνα/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-γαλατσίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-γλυφάδας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-δάφνης-υμηττού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-διονύσου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ελευσίνας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ελληνικού-αργυρούπολης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ζωγράφου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ηλιούπολης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ηρακλείου-αττικής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ιλίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-καισαριανής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-καλλιθέας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/dimos-keratsiniou-drapetsonas/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/dimos-kifisias-etythraias-ekalis/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-κορυδαλλού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-κρωπίας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-λαυρεωτικής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-λυκόβρυσης-πεύκης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μάνδρας-ειδυλλίας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μαραθώνα/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μαρκοπούλου-μεσογαίας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μεγαρέων/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μεταμόρφωσης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-μοσχάτου-ταύρου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-νέας-ιωνίας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-νέας-σμύρνης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-νέας-φιλαδέλφειας-χαλκηδόνας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμοι-νήσων-νομού-αττικής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-νίκαιας-άγιος-ιωάννης-ρέντης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-παιανίας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-παλαιού-φαλήρου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-παλλήνης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-παπάγου-χολαργού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-πειραιά/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-πεντέλης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-περάματος/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-περιστερίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-πετρούπολης/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ραφήνας-πικερμίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-σαλαμίνας/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-σαρωνικού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-σπάτων-αρτέμιδος/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-φιλοθέης-ψυχικού/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-φυλής/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-χαϊδαρίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-χαλανδρίου/

https://www.xtypos.gr/κατηγορία/δήμοι-αττικής/δήμος-ωρωπού/]


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
