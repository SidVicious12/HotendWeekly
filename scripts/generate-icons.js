const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/branding/hotendweekly-icon.svg');
const iconDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

async function generateIcons() {
    try {
        console.log('Generating 192x192 icon...');
        await sharp(svgPath)
            .resize(192, 192)
            .png()
            .toFile(path.join(iconDir, 'icon-192x192.png'));

        console.log('Generating 512x512 icon...');
        await sharp(svgPath)
            .resize(512, 512)
            .png()
            .toFile(path.join(iconDir, 'icon-512x512.png'));

        console.log('Icons generated successfully!');
    } catch (err) {
        console.error('Error generating icons:', err);
        process.exit(1);
    }
}

generateIcons();
