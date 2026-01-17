import re

def parse_wiki_transcription(file_path):
    pinyin_map = {}
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line in lines:
        stripped = line.strip()
        
        # Skip table syntax, comments, and headers
        if (stripped.startswith('{|') or 
            stripped.startswith('!చే') or 
            stripped.startswith('!') or 
            stripped.startswith('|-') or 
            stripped.startswith('|}') or
            stripped.startswith('|+') or
            stripped.startswith('<!--') or
            'colspan' in stripped):
            continue
        
        # We are looking for lines that look like data rows: | pinyin || ru || ukr_acad || ...
        # Standardize delimiters
        parts = stripped.split('||')
        
        # We need at least 3 columns: [0] Pinyin, [1] Ru, [2] Ukr Academic
        if len(parts) >= 3:
            # Clean Pinyin (Column 0)
            # Remove leading pipe if present and whitespace
            pinyin = parts[0].replace('|', '').strip()
            
            # Clean Ukr Academic (Column 2)
            ukr = parts[2].strip()
            
            # Remove any Wikipedia referencing <ref>...</ref> or similar
            ukr = re.sub(r'<.*?>', '', ukr)
            
            # Remove parentheses explanations (sometimes present in wiki tables)
            # taking only the first variant if multiple are listed
            ukr = ukr.split('(')[0].strip()
            
            if pinyin and ukr:
                pinyin_map[pinyin] = ukr

    return pinyin_map

def generate_js_object(mapping):
    # Sort keys alphabetically for neatness
    sorted_keys = sorted(mapping.keys())
    
    js_output = "const pinyinMap = {\n"
    for key in sorted_keys:
        js_output += f"    '{key}': '{mapping[key]}',\n"
    js_output += "};"
    return js_output

if __name__ == "__main__":
    try:
        # Parse the file
        mapping = parse_wiki_transcription('wiki.txt')
        
        # Print stats
        print(f"Parsed {len(mapping)} syllables.")
        
        # Generate JS
        js_code = generate_js_object(mapping)
        
        # Write to file
        with open('pinyin_map.js', 'w', encoding='utf-8') as f:
            f.write(js_code)
            
        print("Success! Dictionary saved to 'pinyin_map.js'")
        print("-" * 30)
        print(js_code) # Print to console as well
        
    except FileNotFoundError:
        print("Error: wiki.txt not found. Please ensure the file exists.")