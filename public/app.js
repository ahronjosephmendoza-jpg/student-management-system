const $ = id => document.getElementById(id);
let students = [];
const fields = ["studentNo","email","firstName","lastName","course","yearLevel"];
async function api(url, options) { const r = await fetch(url, Object.assign({headers:{"Content-Type":"application/json"}}, options || {})); if (r.status === 204) return null; const data = await r.json().catch(() => ({})); if (!r.ok) throw new Error(data.error || "Request failed."); return data; }
function esc(v) { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll(String.fromCharCode(34),"&quot;").replaceAll(String.fromCharCode(39),"&#39;"); }
function render() {
 $("total").textContent = students.length;
 $("courses").textContent = new Set(students.map(s => s.course)).size;
 $("years").textContent = new Set(students.map(s => s.yearLevel)).size;
 $("count").textContent = students.length + (students.length === 1 ? " record" : " records");
 $("records").innerHTML = students.length ? students.map(s => '<tr><td><div class="person"><span class="initial">' + esc(s.firstName[0] + s.lastName[0]) + '</span><span><strong>' + esc(s.firstName + " " + s.lastName) + '</strong><small>' + esc(s.email) + '</small></span></div></td><td>' + esc(s.studentNo) + '</td><td>' + esc(s.course) + '</td><td>Year ' + s.yearLevel + '</td><td><button class="edit" data-edit="' + s.id + '">Edit</button><button class="delete" data-delete="' + s.id + '">Delete</button></td></tr>').join("") : '<tr><td colspan="5">No student records found. Add your first student.</td></tr>';
}
async function load() { try { $("notice").textContent = ""; students = await api("/api/students?q=" + encodeURIComponent($("search").value)); render(); } catch (e) { $("notice").textContent = e.message + " Check your MySQL connection."; } }
function create() { $("studentForm").reset(); $("id").value = ""; $("formTitle").textContent = "Add student"; $("error").textContent = ""; $("modal").showModal(); }
function edit(s) { $("studentForm").reset(); $("id").value = s.id; fields.forEach(k => $(k).value = s[k]); $("formTitle").textContent = "Edit student"; $("error").textContent = ""; $("modal").showModal(); }
$("add").addEventListener("click", create);
$("close").addEventListener("click", () => $("modal").close());
$("cancel").addEventListener("click", () => $("modal").close());
$("search").addEventListener("input", load);
$("records").addEventListener("click", async e => {
 if (e.target.dataset.edit) { const s = students.find(x => x.id === Number(e.target.dataset.edit)); if (s) edit(s); }
 if (e.target.dataset.delete && confirm("Delete this student record? This cannot be undone.")) { try { await api("/api/students/" + e.target.dataset.delete, {method:"DELETE"}); $("notice").textContent = "Student record deleted."; await load(); } catch (err) { $("notice").textContent = err.message; } }
});
$("studentForm").addEventListener("submit", async e => {
 e.preventDefault(); const id = $("id").value;
 const data = Object.fromEntries(fields.map(k => [k, $(k).value.trim()])); data.yearLevel = Number(data.yearLevel);
 $("save").disabled = true; $("save").textContent = "Saving...";
 try { await api(id ? "/api/students/" + id : "/api/students", {method:id ? "PUT" : "POST", body:JSON.stringify(data)}); $("modal").close(); $("notice").textContent = id ? "Student updated." : "Student added."; await load(); } catch (err) { $("error").textContent = err.message; }
 finally { $("save").disabled = false; $("save").textContent = "Save student"; }
});
load();