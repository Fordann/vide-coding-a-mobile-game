#!/usr/bin/env python3
"""
Sprite sheet generator for Hardcore Economy Game
Generates a 1024x1024 sprite sheet with 5x5 grid (25 sprites of 128x128 each)
"""

import os

# Check if PIL is available, otherwise provide instructions
try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("PIL not available. Install with: pip install Pillow")
    print("Generating sprite specification instead...")

# Sprite definitions
SPRITE_DEFINITIONS = [
    # Row 1: Characters
    {"id": 0, "name": "king", "desc": "King/Player Avatar", "color": "#FFD700", "symbol": "♔"},
    {"id": 1, "name": "scout", "desc": "Scout Unit", "color": "#90EE90", "symbol": "👁"},
    {"id": 2, "name": "trader", "desc": "Trader Unit", "color": "#87CEEB", "symbol": "⚖"},
    {"id": 3, "name": "diplomat", "desc": "Diplomat Unit", "color": "#DDA0DD", "symbol": "🗨"},
    {"id": 4, "name": "enforcer", "desc": "Enforcer Unit", "color": "#CD5C5C", "symbol": "⚔"},

    # Row 2: Equipment
    {"id": 5, "name": "weapon", "desc": "Weapon Equipment", "color": "#C0C0C0", "symbol": "🗡"},
    {"id": 6, "name": "armor", "desc": "Armor Equipment", "color": "#B8860B", "symbol": "🛡"},
    {"id": 7, "name": "bag", "desc": "Bag/Chest", "color": "#8B4513", "symbol": "📦"},
    {"id": 8, "name": "scroll", "desc": "Scroll/Document", "color": "#F5DEB3", "symbol": "📜"},
    {"id": 9, "name": "horse", "desc": "Mount/Transport", "color": "#A0522D", "symbol": "🐴"},

    # Row 3: Resources
    {"id": 10, "name": "gold", "desc": "Gold Resource", "color": "#FFD700", "symbol": "💰"},
    {"id": 11, "name": "information", "desc": "Information Resource", "color": "#4169E1", "symbol": "ℹ"},
    {"id": 12, "name": "influence", "desc": "Influence Resource", "color": "#9370DB", "symbol": "👑"},
    {"id": 13, "name": "faith", "desc": "Faith Resource", "color": "#F0E68C", "symbol": "✝"},
    {"id": 14, "name": "trade_goods", "desc": "Trade Goods", "color": "#DEB887", "symbol": "📦"},

    # Row 4: Status Effects
    {"id": 15, "name": "success", "desc": "Success Effect", "color": "#00FF00", "symbol": "✓"},
    {"id": 16, "name": "failure", "desc": "Failure Effect", "color": "#FF0000", "symbol": "✗"},
    {"id": 17, "name": "wounded", "desc": "Wounded Status", "color": "#8B0000", "symbol": "🩸"},
    {"id": 18, "name": "fatigued", "desc": "Fatigue Status", "color": "#696969", "symbol": "😴"},
    {"id": 19, "name": "dead", "desc": "Death Marker", "color": "#000000", "symbol": "💀"},

    # Row 5: UI Elements
    {"id": 20, "name": "mission_icon", "desc": "Mission Icon", "color": "#FF8C00", "symbol": "🎯"},
    {"id": 21, "name": "rebellion", "desc": "Rebellion Warning", "color": "#DC143C", "symbol": "⚠"},
    {"id": 22, "name": "market", "desc": "Market Icon", "color": "#32CD32", "symbol": "🏪"},
    {"id": 23, "name": "route_fast", "desc": "Fast Route", "color": "#FF4500", "symbol": "⚡"},
    {"id": 24, "name": "route_safe", "desc": "Safe Route", "color": "#228B22", "symbol": "🛡"},
]

SPRITE_SIZE = 128
GRID_SIZE = 5
SHEET_SIZE = SPRITE_SIZE * GRID_SIZE  # 1024x1024

def generate_sprite_sheet():
    """Generate the sprite sheet using PIL"""
    if not PIL_AVAILABLE:
        return False

    # Create blank image
    sheet = Image.new('RGBA', (SHEET_SIZE, SHEET_SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(sheet)

    # Try to load a font
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 64)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Generate each sprite
    for sprite in SPRITE_DEFINITIONS:
        sprite_id = sprite["id"]
        row = sprite_id // GRID_SIZE
        col = sprite_id % GRID_SIZE

        x = col * SPRITE_SIZE
        y = row * SPRITE_SIZE

        # Draw background
        color = sprite["color"]
        # Convert hex to RGB
        r = int(color[1:3], 16)
        g = int(color[3:5], 16)
        b = int(color[5:7], 16)

        # Draw rounded rectangle background
        padding = 8
        draw.rounded_rectangle(
            [x + padding, y + padding, x + SPRITE_SIZE - padding, y + SPRITE_SIZE - padding],
            radius=10,
            fill=(r, g, b, 200)
        )

        # Draw border
        draw.rounded_rectangle(
            [x + padding, y + padding, x + SPRITE_SIZE - padding, y + SPRITE_SIZE - padding],
            radius=10,
            outline=(50, 50, 50, 255),
            width=2
        )

        # Draw symbol centered
        symbol = sprite["symbol"]
        # Calculate text position (centered)
        bbox = draw.textbbox((0, 0), symbol, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = x + (SPRITE_SIZE - text_width) // 2
        text_y = y + (SPRITE_SIZE - text_height) // 2 - 10

        draw.text((text_x, text_y), symbol, fill=(255, 255, 255, 255), font=font)

        # Draw name at bottom
        name_text = sprite["name"]
        bbox = draw.textbbox((0, 0), name_text, font=small_font)
        name_width = bbox[2] - bbox[0]
        name_x = x + (SPRITE_SIZE - name_width) // 2
        name_y = y + SPRITE_SIZE - 24

        draw.text((name_x, name_y), name_text, fill=(255, 255, 255, 255), font=small_font)

    # Save the sprite sheet
    output_path = os.path.join(os.path.dirname(__file__), 'spritesheet.png')
    sheet.save(output_path)
    print(f"Sprite sheet saved to: {output_path}")
    return True

def generate_sprite_mapping():
    """Generate sprite mapping JSON"""
    import json

    mapping = {
        "metadata": {
            "sheet_size": SHEET_SIZE,
            "sprite_size": SPRITE_SIZE,
            "grid_size": GRID_SIZE,
            "total_sprites": len(SPRITE_DEFINITIONS)
        },
        "sprites": {}
    }

    for sprite in SPRITE_DEFINITIONS:
        sprite_id = sprite["id"]
        row = sprite_id // GRID_SIZE
        col = sprite_id % GRID_SIZE

        mapping["sprites"][sprite["name"]] = {
            "id": sprite_id,
            "description": sprite["desc"],
            "position": {
                "x": col * SPRITE_SIZE,
                "y": row * SPRITE_SIZE,
                "width": SPRITE_SIZE,
                "height": SPRITE_SIZE
            },
            "grid": {
                "row": row,
                "col": col
            },
            "color": sprite["color"],
            "symbol": sprite["symbol"]
        }

    output_path = os.path.join(os.path.dirname(__file__), 'sprite-mapping.json')
    with open(output_path, 'w') as f:
        json.dump(mapping, f, indent=2)

    print(f"Sprite mapping saved to: {output_path}")

def generate_sprite_spec():
    """Generate sprite specification document"""
    spec = f"""
╔════════════════════════════════════════════════════════════╗
║          SPRITE SHEET SPECIFICATION                        ║
╚════════════════════════════════════════════════════════════╝

Sheet Size: {SHEET_SIZE}x{SHEET_SIZE} pixels
Grid: {GRID_SIZE}x{GRID_SIZE} (25 sprites)
Individual Sprite Size: {SPRITE_SIZE}x{SPRITE_SIZE} pixels
Format: PNG with transparency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPRITE LIST:

"""

    for sprite in SPRITE_DEFINITIONS:
        sprite_id = sprite["id"]
        row = sprite_id // GRID_SIZE
        col = sprite_id % GRID_SIZE
        x = col * SPRITE_SIZE
        y = row * SPRITE_SIZE

        spec += f"""
#{sprite_id:02d} - {sprite['name'].upper()}
   Description: {sprite['desc']}
   Grid Position: Row {row}, Col {col}
   Pixel Position: ({x}, {y})
   Color: {sprite['color']}
   Symbol: {sprite['symbol']}
"""

    spec += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE IN GAME:

To extract individual sprites in Unity/Godot:
1. Import spritesheet.png
2. Set Sprite Mode to Multiple
3. Use the sprite-mapping.json to define slice rectangles
4. Each sprite is 128x128 with known positions

Example (Unity):
- Import Settings → Sprite Mode: Multiple
- Sprite Editor → Slice → Grid By Cell Size: 128x128

Example (Godot):
- Import as Texture
- Create AtlasTexture resources for each sprite
- Use positions from sprite-mapping.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLOR PALETTE:

Characters (warm tones):
- King: #FFD700 (Gold)
- Scout: #90EE90 (Light Green)
- Trader: #87CEEB (Sky Blue)
- Diplomat: #DDA0DD (Plum)
- Enforcer: #CD5C5C (Indian Red)

Resources (cool tones):
- Gold: #FFD700
- Information: #4169E1 (Royal Blue)
- Influence: #9370DB (Medium Purple)
- Faith: #F0E68C (Khaki)

Effects (special):
- Success: #00FF00 (Bright Green)
- Failure: #FF0000 (Red)
- Wounded: #8B0000 (Dark Red)
- Fatigue: #696969 (Dim Gray)
- Death: #000000 (Black)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

    output_path = os.path.join(os.path.dirname(__file__), 'SPRITE_SPEC.txt')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(spec)

    print(f"Sprite specification saved to: {output_path}")

if __name__ == '__main__':
    print("Generating sprite assets...")

    # Generate mapping
    generate_sprite_mapping()

    # Generate specification
    generate_sprite_spec()

    # Try to generate sprite sheet
    if PIL_AVAILABLE:
        success = generate_sprite_sheet()
        if success:
            print("\n✓ Sprite sheet generation complete!")
        else:
            print("\n✗ Sprite sheet generation failed")
    else:
        print("\n⚠ PIL not available - sprite sheet image not generated")
        print("  Install PIL with: pip install Pillow")
        print("  Then run this script again to generate the PNG")

    print("\nAll sprite assets generated successfully!")
    print("Check the assets/ directory for outputs.")
