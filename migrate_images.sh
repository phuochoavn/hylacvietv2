#!/bin/bash
# Migration script: convert existing uploads to WebP (max 1200px width)
# Run once: bash migrate_images.sh

UPLOADS_DIR="/opt/hylacviet/uploads"
BACKUP_DIR="/opt/hylacviet/uploads_backup"

# Check cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Install: apt-get install webp"
    exit 1
fi

# Backup originals
echo "📦 Backing up originals to $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -n "$UPLOADS_DIR"/*.{png,jpg,jpeg} "$BACKUP_DIR/" 2>/dev/null

# Count files
total=$(ls "$UPLOADS_DIR"/*.png "$UPLOADS_DIR"/*.jpg "$UPLOADS_DIR"/*.jpeg 2>/dev/null | wc -l)
current=0

echo "🔄 Converting $total images to WebP..."

for f in "$UPLOADS_DIR"/*.png "$UPLOADS_DIR"/*.jpg "$UPLOADS_DIR"/*.jpeg; do
    [ -f "$f" ] || continue
    current=$((current + 1))
    basename=$(basename "$f")
    name="${basename%.*}"
    webp_file="$UPLOADS_DIR/${name}.webp"

    # Skip if already converted
    if [ -f "$webp_file" ]; then
        echo "  ⏭️  [$current/$total] $basename (already exists)"
        continue
    fi

    # Get dimensions
    dims=$(identify -format "%wx%h" "$f" 2>/dev/null)
    width=$(echo "$dims" | cut -dx -f1)

    # Resize if wider than 1200px
    if [ -n "$width" ] && [ "$width" -gt 1200 ]; then
        echo "  🔄 [$current/$total] $basename ($dims → max 1200px wide, WebP)"
        convert "$f" -resize 1200x\> -quality 85 "$UPLOADS_DIR/${name}_resized.png" 2>/dev/null
        cwebp -q 85 "$UPLOADS_DIR/${name}_resized.png" -o "$webp_file" -quiet
        rm -f "$UPLOADS_DIR/${name}_resized.png"
    else
        echo "  🔄 [$current/$total] $basename ($dims → WebP)"
        cwebp -q 85 "$f" -o "$webp_file" -quiet
    fi

    # Show size reduction
    old_size=$(stat -c%s "$f" 2>/dev/null)
    new_size=$(stat -c%s "$webp_file" 2>/dev/null)
    if [ -n "$old_size" ] && [ -n "$new_size" ]; then
        reduction=$(( (old_size - new_size) * 100 / old_size ))
        echo "    📊 $(numfmt --to=iec $old_size) → $(numfmt --to=iec $new_size) (-${reduction}%)"
    fi
done

echo ""
echo "✅ Migration complete!"
echo "📊 Before: $(du -sh $BACKUP_DIR 2>/dev/null | cut -f1)"
echo "📊 After:  $(du -sh $UPLOADS_DIR 2>/dev/null | cut -f1)"
echo ""
echo "⚠️  Old .png/.jpg files kept. Remove after verifying:"
echo "    rm $UPLOADS_DIR/*.png $UPLOADS_DIR/*.jpg $UPLOADS_DIR/*.jpeg"
