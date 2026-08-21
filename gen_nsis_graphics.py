from PIL import Image, ImageDraw, ImageFont
import os

# Create build dir if not exists
os.makedirs("build", exist_ok=True)

# 1. installerSidebar.bmp (164x314)
img_sidebar = Image.new("RGB", (164, 314), "#0F0F13")
draw = ImageDraw.Draw(img_sidebar)

# Draw some retro grid
for y in range(0, 314, 20):
    draw.line([(0, y), (164, y)], fill="#1a1a24", width=1)
for x in range(0, 164, 20):
    draw.line([(x, 0), (x, 314)], fill="#1a1a24", width=1)

# Draw some arcade style text or shapes
draw.rectangle([10, 10, 154, 40], outline="#41a6f6", width=2)
# Since we might not have a pixel font, we'll draw text if possible or just geometric shapes
try:
    # Try to load a generic font or fallback
    font = ImageFont.truetype("arialbd.ttf", 16)
except:
    font = ImageFont.load_default()

draw.text((25, 18), "RETRO", fill="#41a6f6", font=font)
draw.text((25, 45), "CASTER", fill="#22c55e", font=font)

# Add some "stars" or pixels
import random
for _ in range(50):
    sx, sy = random.randint(0, 164), random.randint(0, 314)
    draw.point((sx, sy), fill="#facc15")

img_sidebar.save("build/installerSidebar.bmp")


# 2. installerHeader.bmp (150x57)
img_header = Image.new("RGB", (150, 57), "#0F0F13")
draw_h = ImageDraw.Draw(img_header)
# Grid
for y in range(0, 57, 10):
    draw_h.line([(0, y), (150, y)], fill="#1a1a24", width=1)
for x in range(0, 150, 10):
    draw_h.line([(x, 0), (x, 57)], fill="#1a1a24", width=1)

draw_h.rectangle([5, 5, 145, 52], outline="#41a6f6", width=2)
draw_h.text((15, 15), "RETRO CASTER", fill="#facc15", font=font)
draw_h.text((15, 30), "INSTALLER", fill="#22c55e", font=font)

img_header.save("build/installerHeader.bmp")

print("NSIS BMPs generated.")
