"""Import the supplied review draft without modifying it."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "content" / "number-theory" / "source-v2.md"
text = source.read_text()

def clean(s):
    return s.replace("**", "").replace("`", "").strip()

def quoted(s):
    return "\n".join(re.sub(r"^> ?", "", line) for line in s.splitlines() if line.startswith(">")).strip()

def section(s, start, end):
    return s.split(start, 1)[1].split(end, 1)[0]

projects = []
for raw in re.split(r"(?=^### 项目 \d+ ·)", text, flags=re.M)[1:]:
    raw = raw.split("\n## 五、", 1)[0]
    head = re.match(r"### 项目 (\d+) · (nt-p\d+) · (.+)", raw)
    order, pid, title = head.groups()
    meta = re.search(r"- \*\*层级：\*\* (.+)", raw).group(1).split(" · ")
    uses = re.search(r"- \*\*用到的结论（Uses）：\*\* (.+)", raw).group(1)
    teacher = re.search(r"- \*\*思路导引（中文，给老师和设计者）：\*\* (.+)", raw).group(1)
    approach = quoted(section(raw, "**How to think about it", "#### 1"))
    prompt = quoted(section(raw, "**Prompt**", "**How to think about it"))
    table = section(raw, "**字段与答案**", "**Reference solution（总结）：**")
    fields = {}
    for line in table.splitlines():
        if not line.startswith("| `"):
            continue
        fid, label, kind, expected, review = [x.strip() for x in line.strip().strip("|").split("|", 4)]
        fid = clean(fid)
        assert kind in ["number", "choice", "multi", "reason"], (pid, fid, kind)
        f = dict(id=fid, label=clean(label), type=kind)
        if kind == "reason":
            crit = review.split("审阅要点：", 1)[1].split("<br>追问：", 1)
            f["criteria"] = clean(crit[0]).split(" / ")
            f["followup"] = clean(crit[1]) if len(crit) > 1 else ""
        elif kind == "number":
            f["answer"] = clean(expected)
            accepted = review.split("接受：", 1)[1].split("；", 1)[0]
            f["accepted"] = re.findall(r"`([^`]+)`", accepted)
            rounding = re.search(r"四舍五入至至少 (\d+) 位小数", review)
            if rounding:
                f["minDecimalPlaces"] = int(rounding.group(1))
        else:
            answers = re.findall(r"`([^`]+)`", expected)
            f["answer"] = answers if kind == "multi" else answers[0]
            f["options"] = []
            for i, option in enumerate(review.split("<br>")):
                good = "✓" in option
                label = clean(option).replace("✓", "").replace("✗", "").strip()
                if kind == "multi":
                    val = re.search(r"-?\d+", label).group(0)
                else:
                    val = f["answer"] if good else "other-" + str(i)
                f["options"].append(dict(value=val, label=label))
        fields[fid] = f
    steps = []
    for chunk in re.split(r"(?=^#### \d+ ·)", raw, flags=re.M)[1:]:
        chunk = chunk.split("**字段与答案**", 1)[0]
        title = re.match(r"#### (\d+) · (.+)", chunk).group(2)
        ids = re.findall(r"`([^`]+)`", section(chunk, "字段：", "**Reference proof"))
        assert all(i in fields for i in ids), (pid, ids)
        steps.append(dict(title=title, prompt=quoted(chunk.split("字段：", 1)[0]),
                          proof=quoted(chunk.split("**Reference proof（`referenceSolution`）**", 1)[1]),
                          fields=[fields[i] for i in ids]))
    assert len({f["id"] for st in steps for f in st["fields"]}) == len(fields), pid
    # The Chinese teacher guide stays in the source notes; quidence.com publishes English and Spanish only.
    projects.append(dict(id=pid, order=int(order), title=head.group(3), level=meta[0], difficulty=meta[1],
                         topic=meta[2], prompt=prompt, approach=approach,
                         uses=uses, steps=steps,
                         nextCheck=raw.split("**Next check：**", 1)[1].strip().split("\n---", 1)[0]))

# These wording changes make the model and mathematical domains explicit.
projects[0]["prompt"] = projects[0]["prompt"].replace("without cutting any tile.", "without cutting any tile. Tiles are laid in an aligned rectangular grid.")
for p in projects:
    if p["id"] == "nt-p08":
        p["prompt"] = "A positive integer is perfect if it equals the sum of its positive divisors smaller than itself. Explore divisor sums and numbers of the form 2ᵖ − 1, proving each step."
        p["approach"] = p["approach"].replace("For 2ᵖ − 1,", "For 2ᵖ − 1 with p an odd prime,")
    if p["id"] == "nt-p06":
        st = p["steps"][-1]
        st["prompt"] = "Everyone may know n = 143 and e = 7. Which number must stay secret? Explain how knowing p and q, or knowing φ(n), allows someone to recover the secret exponent. This small-number lock is a mathematical demonstration."
        st["proof"] = "The secret exponent is d. The primes p and q, and φ(n), also reveal d. From p and q we obtain φ(n) = (p − 1)(q − 1), and the extended Euclidean algorithm computes d as the inverse of e modulo φ(n), as in Step 1.\n\nKnowing φ(n) also reveals the factors: p + q = n − φ(n) + 1 and pq = n. Thus p and q are the roots of t² − (n − φ(n) + 1)t + n = 0. For n = 143 and φ(n) = 120 this is t² − 24t + 143 = 0, whose roots are 11 and 13. Once these values are known, Step 1 recovers d = 103.\n\nThese small parameters demonstrate the mathematics of RSA. This toy lock is not suitable for protecting messages."
        st["fields"][-1]["label"] = "Explain how the factors reveal the secret exponent"
        st["fields"][-1]["criteria"] = ["From p and q, obtain φ(n) = (p − 1)(q − 1).", "Use the extended Euclidean algorithm to find d, the inverse of e modulo φ(n)."]
    if p["id"] == "nt-p05":
        p["approach"] = p["approach"].replace("passing the base-2 test proves nothing", "passing the base-2 test does not establish primality")

assert len(projects) == 10
assert sum(len(p["steps"]) for p in projects) == 43
assert sum(len(st["fields"]) for p in projects for st in p["steps"]) == 120
out = ROOT / "courses" / "number-theory" / "data.json"
out.write_text(json.dumps(projects, ensure_ascii=False, indent=2))
print(json.dumps({"projects":len(projects),"steps":sum(len(p["steps"]) for p in projects),
                  "fields":sum(len(st["fields"]) for p in projects for st in p["steps"]),"data_bytes":out.stat().st_size}))
