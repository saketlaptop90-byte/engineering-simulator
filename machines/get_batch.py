import re
with open(r"C:\Users\Saket\OneDrive\Desktop\engineering-simulator\machines\cell_phase5.js", "r") as f:
    code = f.read()
match = re.search(r"const modelsList = \[(.*?)\];", code, re.DOTALL)
if match:
    items = [x.strip().strip('"').strip("'") for x in match.group(1).split(",")]
    items = [x for x in items if x]
    print("\n".join(items[1241:1341]))
