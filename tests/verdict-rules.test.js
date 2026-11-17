// Comprueba las reglas de clasificación usando las expresiones reales del flujo exportado.
// Uso: node tests/verdict-rules.test.js  (sale con código 1 si alguna falla)
const wf = require("../snackcheck.workflow.json");

const field = (node, name) =>
  wf.nodes.find((n) => n.name === node).parameters.assignments.assignments.find((a) => a.name === name).value.slice(4, -3); // quita "={{ " y " }}"
const run = (code, $json) => Function("$json", "return (" + code + ")")($json);

function verdict(sugar, salt, fat, nutriscore_grade) {
  const j = { sugar, salt, fat, nutriscore_grade };
  for (const f of ["sugar_level", "salt_level", "fat_level"]) j[f] = run(field("Classify - Traffic Lights", f), j);
  for (const f of ["high_count", "nutriscore_reading"]) j[f] = run(field("Classify - Readings", f), j);
  return run(field("Classify - Verdict Level", "verdict_level"), j);
}

const cases = [
  [[1, 0.1, 1, "unknown"], "saludable", "sin Nutri-Score: solo semáforo"],
  [[30, 0.1, 1, "unknown"], "moderado", "sin Nutri-Score, 1 alto"],
  [[30, 2, 20, "unknown"], "no saludable", "sin Nutri-Score, 3 altos"],
  [[10.9, 0, 0, "e"], "no saludable", "gaseosa: el Nutri-Score gana"],
  [[30, 0.1, 1, "a"], "moderado", "el semáforo gana si es peor"],
  [[22.5, 1.5, 17.5, "b"], "saludable", "justo en los umbrales no cuenta como alto"],
  [[56.3, 0.107, 30.9, "e"], "no saludable", "Nutella"],
];

let failed = 0;
for (const [args, want, why] of cases) {
  const got = verdict(...args);
  console.log(got === want ? "OK   " : "FALLO", why, "->", got);
  if (got !== want) failed++;
}
process.exit(failed ? 1 : 0);
