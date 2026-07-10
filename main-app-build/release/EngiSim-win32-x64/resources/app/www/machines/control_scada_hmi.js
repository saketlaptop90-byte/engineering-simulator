import { whitePlastic, darkSteel, greenAccent, redAccent, blueAccent, glass } from '../utils/materials.js';

export function createScadaHmiPanel(THREE) {
    const group = new THREE.Group();

    // Enclosure
    const enclosureGeo = new THREE.BoxGeometry(4, 3, 1);
    const enclosure = new THREE.Mesh(enclosureGeo, whitePlastic);
    enclosure.position.y = 1.5;
    group.add(enclosure);

    // Screen
    const screenGeo = new THREE.BoxGeometry(2.8, 1.8, 0.1);
    const screen = new THREE.Mesh(screenGeo, darkSteel);
    screen.position.set(-0.3, 2.0, 0.51);
    group.add(screen);

    const glassGeo = new THREE.BoxGeometry(2.7, 1.7, 0.05);
    const screenGlass = new THREE.Mesh(glassGeo, glass);
    screenGlass.position.set(-0.3, 2.0, 0.56);
    group.add(screenGlass);

    // E-Stop Button
    const estopBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const estopBase = new THREE.Mesh(estopBaseGeo, darkSteel);
    estopBase.rotation.x = Math.PI / 2;
    estopBase.position.set(1.5, 2.5, 0.55);
    group.add(estopBase);

    const estopBtnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const estopBtn = new THREE.Mesh(estopBtnGeo, redAccent);
    estopBtn.rotation.x = Math.PI / 2;
    estopBtn.position.set(1.5, 2.5, 0.6);
    group.add(estopBtn);

    // Start Button
    const startBtnGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const startBtn = new THREE.Mesh(startBtnGeo, greenAccent);
    startBtn.rotation.x = Math.PI / 2;
    startBtn.position.set(1.5, 1.8, 0.55);
    group.add(startBtn);

    // Stop Button
    const stopBtn = new THREE.Mesh(startBtnGeo, redAccent);
    stopBtn.rotation.x = Math.PI / 2;
    stopBtn.position.set(1.5, 1.4, 0.55);
    group.add(stopBtn);

    // Selector Switch
    const switchBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const switchBase = new THREE.Mesh(switchBaseGeo, darkSteel);
    switchBase.rotation.x = Math.PI / 2;
    switchBase.position.set(1.5, 0.8, 0.55);
    group.add(switchBase);

    const switchKnobGeo = new THREE.BoxGeometry(0.05, 0.3, 0.1);
    const switchKnob = new THREE.Mesh(switchKnobGeo, blueAccent);
    switchKnob.position.set(0, 0, 0.05);
    switchBase.add(switchKnob);

    // Screen GUI Element (Gauge needle)
    const needleGeo = new THREE.BoxGeometry(0.02, 0.6, 0.01);
    const needle = new THREE.Mesh(needleGeo, redAccent);
    needle.position.set(0, -0.3, 0.02);
    
    const dialCenter = new THREE.Group();
    dialCenter.position.set(-0.3, 1.6, 0.52);
    dialCenter.add(needle);
    group.add(dialCenter);

    // Animation
    const times = [0, 1, 2, 3, 4];

    // E-Stop push in and release
    const estopTrack = new THREE.NumberKeyframeTrack(
        estopBtn.uuid + '.position[z]',
        [0, 1, 2, 3, 4],
        [0.6, 0.55, 0.55, 0.6, 0.6]
    );

    // Switch turning
    const switchTrack = new THREE.NumberKeyframeTrack(
        switchKnob.uuid + '.rotation[z]',
        [0, 1, 2, 3, 4],
        [0, 0, Math.PI/4, Math.PI/4, 0]
    );

    // Dial needle moving
    const needleTrack = new THREE.NumberKeyframeTrack(
        dialCenter.uuid + '.rotation[z]',
        [0, 1, 2, 3, 4],
        [Math.PI/4, -Math.PI/4, -Math.PI/2, Math.PI/8, Math.PI/4]
    );

    const clip = new THREE.AnimationClip('InteractHMI', 4, [estopTrack, switchTrack, needleTrack]);

    return { group, animationClips: [clip] };
}
