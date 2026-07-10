import { darkSteel, wood, blackPlastic, brass } from '../utils/materials.js';

export function createWiretapDevice(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main casing (Dark Steel)
    const boxGeo = new THREE.BoxGeometry(1.8, 0.6, 1.2);
    const box = new THREE.Mesh(boxGeo, darkSteel);
    group.add(box);

    // Wooden side panels
    const panelGeo = new THREE.BoxGeometry(0.1, 0.65, 1.3);
    const leftPanel = new THREE.Mesh(panelGeo, wood);
    leftPanel.position.set(-0.95, 0, 0);
    group.add(leftPanel);
    const rightPanel = new THREE.Mesh(panelGeo, wood);
    rightPanel.position.set(0.95, 0, 0);
    group.add(rightPanel);

    // Dials (Brass and Plastic)
    for(let i=0; i<3; i++) {
        const dialGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
        const dial = new THREE.Mesh(dialGeo, i % 2 === 0 ? blackPlastic : brass);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(-0.5 + i * 0.5, 0, 0.65);
        dial.name = `wiretapDial${i}`;
        group.add(dial);
    }

    // Antenna (Brass)
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
    const antenna = new THREE.Mesh(antennaGeo, brass);
    antenna.position.set(0.7, 1.5, -0.4);
    group.add(antenna);

    // Microphone attachment wire (Dark Steel)
    const wireGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32, Math.PI);
    const wire = new THREE.Mesh(wireGeo, darkSteel);
    wire.position.set(-0.7, 0, -0.6);
    wire.rotation.x = Math.PI / 2;
    group.add(wire);

    // Tape reels (Black Plastic)
    const reelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 32);
    const reel1 = new THREE.Mesh(reelGeo, blackPlastic);
    reel1.position.set(-0.4, 0.325, 0);
    reel1.name = 'tapeReel1';
    group.add(reel1);

    const reel2 = new THREE.Mesh(reelGeo, blackPlastic);
    reel2.position.set(0.4, 0.325, 0);
    reel2.name = 'tapeReel2';
    group.add(reel2);

    // Animation: reels spinning and dials tuning
    const reelTrack1 = new THREE.NumberKeyframeTrack('tapeReel1.rotation[y]', [0, 2], [0, Math.PI * 6]);
    const reelTrack2 = new THREE.NumberKeyframeTrack('tapeReel2.rotation[y]', [0, 2], [0, Math.PI * 6]);
    
    const dialTrack0 = new THREE.NumberKeyframeTrack('wiretapDial0.rotation[z]', [0, 0.5, 1, 1.5, 2], [0, Math.PI/4, -Math.PI/6, Math.PI/2, 0]);
    const dialTrack2 = new THREE.NumberKeyframeTrack('wiretapDial2.rotation[z]', [0, 1, 2], [0, Math.PI, Math.PI * 2]);
    
    const clip = new THREE.AnimationClip('RecordAndTune', 2, [reelTrack1, reelTrack2, dialTrack0, dialTrack2]);
    animationClips.push(clip);

    return { group, animationClips };
}
