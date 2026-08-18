from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG = (11, 15, 20)          # #0B0F14
SURFACE = (19, 25, 34)     # #131922
BORDER = (31, 39, 51)      # #1F2733
TEXT_PRIMARY = (245, 247, 250)
TEXT_SECONDARY = (139, 149, 165)
GAIN = (0, 217, 130)
LOSS = (255, 92, 92)
CTA = (240, 180, 41)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 66)
regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
mono = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 24)
mono_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 20)

# Subtle top/bottom border lines, echoing the ticker-tape divider motif
draw.line([(0, 130), (W, 130)], fill=BORDER, width=2)
draw.line([(0, 500), (W, 500)], fill=BORDER, width=2)

# Ticker-tape strip texture along the bottom band
tickers = [("MXRF11", "10,18", True), ("PETR4", "38,42", True), ("HGLG11", "162,90", False),
           ("VALE3", "61,05", True), ("BOVA11", "128,73", True)]
x = 60
y = 555
for symbol, price, gain in tickers:
    draw.text((x, y), symbol, font=mono_small, fill=TEXT_SECONDARY)
    x += draw.textlength(symbol, font=mono_small) + 14
    draw.text((x, y), price, font=mono_small, fill=TEXT_PRIMARY)
    x += draw.textlength(price, font=mono_small) + 10
    arrow = "▲" if gain else "▼"
    color = GAIN if gain else LOSS
    draw.text((x, y), arrow, font=mono_small, fill=color)
    x += 60

# Logo mark (simple candlestick-style tick, echoes favicon)
mark_x, mark_y = 60, 60
draw.rounded_rectangle([mark_x, mark_y, mark_x + 56, mark_y + 56], radius=12, fill=SURFACE, outline=BORDER)
draw.line([(mark_x + 12, mark_y + 38), (mark_x + 22, mark_y + 24), (mark_x + 32, mark_y + 32), (mark_x + 44, mark_y + 16)],
          fill=GAIN, width=4, joint="curve")

# Wordmark
draw.text((mark_x + 72, mark_y + 10), "InvestPainel", font=ImageFont.truetype(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 34), fill=TEXT_PRIMARY)

# Headline
draw.text((60, 190), "Cotação, carteira e análise", font=bold, fill=TEXT_PRIMARY)
draw.text((60, 268), "de fundos em um só painel", font=bold, fill=TEXT_PRIMARY)

# Subtext
draw.text((60, 360), "Feito para o investidor da B3", font=regular, fill=TEXT_SECONDARY)

img.save("/home/claude/investpainel/public/og-image.png")
print("saved")
