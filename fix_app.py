import re

with open('C:/Users/Saket/OneDrive/Desktop/engineering-simulator/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
imports_seen = set()
machine_ids_seen = set()

in_machines_array = False

for line in lines:
    if line.startswith('import { '):
        match = re.search(r'import \{ ([^}]+) \} from', line)
        if match:
            func_name = match.group(1).strip()
            if func_name in imports_seen:
                continue
            imports_seen.add(func_name)
    
    if 'const MACHINES = [' in line:
        in_machines_array = True
    
    if in_machines_array and line.strip().startswith('{ id:'):
        match = re.search(r'id:\s*[\'\"\]([^\'\"\]+)', line)
        if match:
            m_id = match.group(1).strip()
            if m_id in machine_ids_seen:
                continue
            machine_ids_seen.add(m_id)
            
    if '];' in line and in_machines_array:
        in_machines_array = False

    out_lines.append(line)

with open('C:/Users/Saket/OneDrive/Desktop/engineering-simulator/app.js', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)
print('Deduplication complete.')
