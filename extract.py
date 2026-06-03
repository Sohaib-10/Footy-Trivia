import os

html_path = "footy-trivia (2).html"

if os.path.exists(html_path):
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    start_marker = "BRACKET PREDICTION"
    end_marker = "DYNAMIC GROUP RANKINGS"
    
    lines = content.split('\n')
    start_line_idx = -1
    end_line_idx = -1
    
    for idx, line in enumerate(lines):
        if start_marker in line and "bp-bracket-wrapper" in lines[idx+1]:
            start_line_idx = idx
        if end_marker in line:
            end_line_idx = idx
            break
            
    if start_line_idx != -1 and end_line_idx != -1:
        print(f"Found CSS line indices. Start: {start_line_idx}, End: {end_line_idx}")
        
        replacement_styles = """    /* ── BRACKET PREDICTION — SYMMETRIC TEMPLATE ── */
    .bp-bracket-wrapper { display: flex; align-items: stretch; overflow-x: auto; padding: 1rem 0 2rem; scrollbar-width: thin; scrollbar-color: var(--border) transparent; gap: 3.5rem; position: relative; width: max-content; margin: 0 auto; }
    .bp-bracket-half { display: flex; flex: 1; flex-shrink: 0; gap: 3.5rem; }
    .bp-bracket-half.right { flex-direction: row-reverse; }
    .bp-bracket-center { display: flex; flex-direction: column; align-items: stretch; min-width: 200px; flex-shrink: 0; position: relative; gap: 1rem; }
    .bp-round { min-width: 200px; flex-shrink: 0; display: flex; flex-direction: column; align-items: stretch; padding: 0 4px; position: relative; }
    .bp-round-title { text-align: center; color: var(--text2); font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; padding: 0.4rem 0.6rem; border-radius: var(--r); background: var(--surface2); border: 1px solid var(--border); flex-shrink: 0; position: sticky; top: 0; z-index: 10; }
    .bp-round-title.active-round { color: var(--gold); border-color: var(--gold); background: var(--gold-light); }
    .bp-round-matches { position: relative; flex: 1; width: 100%; display: flex; flex-direction: column; height: 1900px; }
    .bp-round-matches.r32-matches { justify-content: space-between; }
    .bp-match { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 0.5rem; overflow: hidden; transition: border-color var(--transition), box-shadow var(--transition); }
    .bp-match:hover { border-color: var(--border2, var(--border)); box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
    .bp-match.complete { border-color: var(--success); }
    .bp-match-label { font-size: 0.6rem; color: var(--text3); text-align: center; padding: 0.25rem; background: var(--surface2); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    .bp-slot { display: flex; align-items: center; padding: 0.5rem 0.6rem; cursor: pointer; transition: background var(--transition); gap: 0.4rem; border-bottom: 1px solid var(--border); position: relative; min-height: 36px; }
    .bp-slot:last-of-type { border-bottom: none; }
    .bp-slot:hover { background: var(--surface-hover); }
    .bp-slot.winner { background: var(--gold-light); border-left: 3px solid var(--gold); }
    .bp-slot.locked { opacity: 0.5; cursor: not-allowed; }
    .bp-slot-flag { font-size: 1rem; flex-shrink: 0; }
    .bp-slot-flag img { width: 20px; height: 14px; border-radius: 2px; object-fit: cover; vertical-align: middle; }
    .bp-slot-name { font-size: 0.78rem; font-weight: 600; color: var(--text); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .bp-slot-placeholder { font-size: 0.72rem; color: var(--text3); font-style: italic; }
    .bp-slot-vs { text-align: center; font-size: 0.55rem; color: var(--text3); padding: 1px 0; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--surface2); }
    .bp-slot-edit { font-size: 0.65rem; color: var(--text3); margin-left: auto; opacity: 0; transition: opacity var(--transition), color var(--transition); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; border: 1px solid var(--border); background: var(--surface2); }
    .bp-slot:hover .bp-slot-edit { opacity: 1; }
    .bp-slot-edit:hover { color: var(--gold); border-color: var(--gold); background: var(--surface3); }

    .bp-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 100; background: var(--surface); border: 1px solid var(--border); border-radius: 0 0 var(--r) var(--r); box-shadow: var(--shadow2); max-height: 220px; overflow-y: auto; }
    .bp-dropdown-search { width: 100%; padding: 0.5rem 0.75rem; border: none; border-bottom: 1px solid var(--border); background: var(--surface2); color: var(--text); font-size: 0.8rem; outline: none; font-family: var(--font-body); }
    .bp-dropdown-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.8rem; color: var(--text); transition: background var(--transition); }
    .bp-dropdown-item:hover { background: var(--surface-hover); }
    .bp-dropdown-item.disabled { opacity: 0.35; cursor: not-allowed; }

    .bp-champion { text-align: center; padding: 1.5rem; background: var(--surface); border: 2px dashed var(--border); border-radius: var(--r-lg); transition: all 0.4s ease; z-index: 10; }
    .bp-champion.crowned { border-style: solid; border-color: var(--gold); background: var(--gold-light); box-shadow: 0 0 30px rgba(212, 175, 55, 0.12); }
    .bp-champion-label { font-family: var(--font-display); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text2); margin-bottom: 0.5rem; }
    .bp-champion-flag { font-size: 2.5rem; margin-bottom: 0.25rem; }
    .bp-champion-name { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--gold); text-transform: uppercase; }
    .bp-progress { display: none !important; }
    .bp-progress-step { font-size: 0.7rem; padding: 0.3rem 0.6rem; border-radius: 20px; background: var(--surface2); color: var(--text3); font-weight: 600; border: 1px solid var(--border); transition: all var(--transition); }
    .bp-progress-step.done { background: var(--success); color: #fff; border-color: var(--success); }
    .bp-progress-step.current { border-color: var(--gold); color: var(--gold); }

    /* Refined Symmetric Connector lines between rounds */
    .bp-connector { display: flex; flex-direction: column; justify-content: space-around; width: 14px; flex-shrink: 0; z-index: 5; }
    .bp-connector-block { display: flex; flex-direction: column; flex: 1; min-height: 80px; }
    .bp-connector-branch { display: none !important; }

    @keyframes slotFillIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    .bp-slot.animate-in .bp-slot-flag, .bp-slot.animate-in .bp-slot-name { animation: slotFillIn 0.35s ease forwards; }
"""
        new_lines = lines[:start_line_idx] + [replacement_styles] + lines[end_line_idx:]
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print("CSS replacement successful in HTML file!")
    else:
        print("Markers not found in HTML file")
else:
    print("HTML file not found")
